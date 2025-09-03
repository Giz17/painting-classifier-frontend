import React, { useRef, useState } from 'react';
import { Upload, BrainCircuit, Camera, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import { classifyImage } from '../utils/classifyImage';
import Aurora from '../components/Aurora';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

const UploadPage = ({ setHistory }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setImageFile] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // --- File Upload ---
  const triggerFileUpload = () => fileInputRef.current.click();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Camera ---
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error('Camera error:', error);
      alert('Cannot access camera. Check permissions.');
    }
  };

  const closeCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
    setStream(null);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
        setUploadedImage(URL.createObjectURL(blob));
        setImageFile(file);
      }, 'image/jpeg');

      closeCamera();
    }
  };

  // --- Classification ---
  const handleClassify = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to classify images.");
        navigate('/auth');
        return;
      }

      // Debug logging
      console.log('UploadPage - About to classify with:', {
        file: file,
        fileName: file?.name,
        fileSize: file?.size,
        uploadedImage: uploadedImage,
        imageType: typeof uploadedImage
      });

      const result = await classifyImage(file, user.email);

      const classification = {
        id: Date.now(),
        style: result.predictions[0][0],
        confidence: result.predictions[0][1],
        predictions: result.predictions,
        description: result.description,
        image: uploadedImage,
        timestamp: result.timestamp,
        image_url: result.image_url,
      };

      setHistory(prev => [...prev, classification]);

      // Debug logging before navigation
      console.log('UploadPage - Navigating to results with:', {
        result: classification,
        image: uploadedImage,
        file: file,
        fileExists: !!file
      });

      // 🔥 FIX: Pass the file along with the result and image
      navigate('/results', {
        state: { 
          result: classification, 
          image: uploadedImage,
          file: file  // ✅ This was missing!
        },
      });
    } catch (error) {
      console.error('Classification error:', error);
      alert(error.message || 'Error during classification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        
        <Aurora
          className="absolute top-0 right-0 w-1/2 h-full"
          colorStops={['#FF3232', '#FF94B4', '#3A29FF']}
          blend={0.6}
          amplitude={0.3}
          speed={0.25}
        />
      </div>

      {/* Hidden inputs */}
      <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Upload Container */}
      <div className="relative z-10 flex-grow flex justify-center items-center px-4 py-6">
        <div className="w-full max-w-xl bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 shadow-2xl text-center">
          {!uploadedImage ? (
            <>
              <Upload className="w-16 h-16 text-gray-500 dark:text-gray-400 mb-6 mx-auto" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Upload or Capture</h2>
              <p className="text-black dark:text-white mb-8">
                Select an image file or use your camera to begin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <ActionButton onClick={triggerFileUpload} icon={<Upload />} text="Select Image" primary />
                <ActionButton onClick={openCamera} icon={<Camera />} text="Use Camera" />
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Image Preview</h3>
              <div className="w-full flex justify-center mb-6">
                <img src={uploadedImage} alt="Uploaded artwork" className="max-h-[400px] w-auto rounded-xl shadow-lg object-contain" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ActionButton
                  onClick={handleClassify}
                  icon={loading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
                  text={loading ? 'Classifying...' : 'Classify'}
                  primary
                  disabled={loading}
                />
                <ActionButton
                  onClick={() => { setUploadedImage(null); setImageFile(null); }}
                  icon={<Upload />}
                  text="Reclassify"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-4xl h-auto rounded-lg shadow-2xl" />
          <div className="flex items-center gap-6 mt-6">
            <ActionButton onClick={handleCapture} icon={<Camera />} text="Capture" primary />
            <button
              onClick={closeCamera}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              aria-label="Close camera"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default UploadPage;