import React, { useState, useRef, useEffect } from 'react';
import { Upload, Palette, Download, Loader2, Camera, X, ArrowRight, Wand2, ArrowLeft, Smile, Droplets, Zap, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Orb from '../components/Orb';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { styleTransferImage } from '../utils/styleTransferImage';
import waImage from '../assets/wa.jpg'; // Light mode background
import Image from '../assets/4.png';
// ✅ Import local style images
import candyImg from '../assets/style1.jpg';
import mosaicImg from '../assets/style4.jpg';
import udnieImg from '../assets/style7.jpg';
import rainPrincessImg from '../assets/style5.jpg';

console.log("Image URL:", Image); // Add this line

const styleImages = {
  candy: candyImg,
  mosaic: mosaicImg,
  udnie: udnieImg,
  rain_princess: rainPrincessImg,
};
const StyleTransferPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availableStyles, setAvailableStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [styledImage, setStyledImage] = useState(null);
  const [error, setError] = useState('');
  const [file, setImageFile] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [showStyles, setShowStyles] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define local style definitions with richer UI properties
  const localStyleDefinitions = [
    {
      name: "candy",
      display_name: "Abstract", // Renamed for UI consistency
      icon: Palette,
      gradient: "from-purple-500/20 to-pink-500/20",
      hoverGradient: "from-purple-600/30 to-pink-600/30",
      accentColor: "purple",
    },
    {
      name: "mosaic",
      display_name: "Modern", // Renamed for UI consistency
      icon: Smile,
      gradient: "from-orange-500/20 to-yellow-500/20",
      hoverGradient: "from-orange-600/30 to-yellow-600/30",
      accentColor: "orange",
    },
    {
      name: "udnie",
      display_name: "Classical", // Renamed for UI consistency
      icon: Droplets,
      gradient: "from-blue-500/20 to-cyan-500/20",
      hoverGradient: "from-blue-600/30 to-cyan-600/30",
      accentColor: "blue",
    },
    {
      name: "rain_princess",
      display_name: "Watercolor", // Renamed for UI consistency
      icon: Zap,
      gradient: "from-emerald-500/20 to-teal-500/20",
      hoverGradient: "from-emerald-600/30 to-teal-600/30",
      accentColor: "emerald",
    },
  ];

  const getAccentClasses = (color) => {
    const colorMap = {
      purple: {
        shadow: "group-hover:shadow-purple-500/50",
        border: "group-hover:border-purple-400/50",
        iconBg: "group-hover:bg-purple-500/30",
      },
      orange: {
        shadow: "group-hover:shadow-orange-500/50",
        border: "group-hover:border-orange-400/50",
        iconBg: "group-hover:bg-orange-500/30",
      },
      blue: {
        shadow: "group-hover:shadow-blue-500/50",
        border: "group-hover:border-blue-400/50",
        iconBg: "group-hover:bg-blue-500/30",
      },
      emerald: {
        shadow: "group-hover:shadow-emerald-500/50",
        border: "group-hover:border-emerald-400/50",
        iconBg: "group-hover:bg-emerald-500/30",
      },
    };
    return colorMap[color];
  };

  // Check if image was passed from classification results
  useEffect(() => {
    if (location.state?.image && location.state?.file) {
      setImagePreview(location.state.image);
      setImageFile(location.state.file);
      setShowStyles(true); // Show styles immediately if coming from another page
    }
  }, [location.state]);

  // Fetch available styles on component mount
  useEffect(() => {
    fetchAvailableStyles();
  }, []);

  const fetchAvailableStyles = async () => {
    try {
      const response = await fetch('http://localhost:8000/styles');
      const styles = await response.json();

      // Merge fetched styles with local definitions
      const mergedStyles = styles.map(apiStyle => {
        const localDef = localStyleDefinitions.find(def => def.name === apiStyle.name);
        return {
          ...apiStyle,
          ...localDef // Override API style with local definition if available
        };
      });
      setAvailableStyles(mergedStyles);
      if (mergedStyles.length > 0) {
        setSelectedStyle(mergedStyles[0].name);
      }
    } catch (err) {
      setError('Failed to load available styles');
    }
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const handleImageSelection = (file, imageUrl) => {
    setImagePreview(imageUrl);
    setImageFile(file);
    setShowStyles(false);
    setStyledImage(null);
    setError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleImageSelection(file, reader.result);
    reader.readAsDataURL(file);
  };

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
      setError('Cannot access camera. Check permissions.');
    }
  };

  const closeCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
    setStream(null);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
      handleImageSelection(file, URL.createObjectURL(blob));
    }, 'image/jpeg');
    closeCamera();
  };

  const resetState = () => {
    setImagePreview(null);
    setImageFile(null);
    setShowStyles(false);
    setStyledImage(null);
    setError('');
  };

  const handleStyleSelect = async (styleName) => {
    if (!file || !styleName) return;
    setIsLoading(true);
    setError('');
    setStyledImage(null);
    setSelectedStyle(styleName);
    try {
      const { data: { user } = {} } = await supabase.auth.getUser(); // Safely access user
      if (!user) {
        // Using a custom message box instead of alert
        // (You'll need to implement a modal/message box component for this)
        console.log("Please log in to use style transfer."); // Placeholder for actual modal
        navigate('/auth');
        return;
      }
      const result = await styleTransferImage(file, styleName);
      setStyledImage(result);
    } catch (err) {
      setError(err.message || 'Style transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  const tryAnotherStyle = () => {
    setStyledImage(null);
    setSelectedStyle('');
    setShowStyles(true);
    setError('');
  };

  const downloadStyledImage = () => {
    if (styledImage) {
      const link = document.createElement('a');
      link.href = styledImage;
      link.download = `styled_${selectedStyle}_${Date.now()}.jpg`;
      link.click();
    }
  };

  const StyledButton = ({ onClick, icon, text, primary, disabled, variant = 'default' }) => {
    const baseClasses = "flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base transform hover:scale-105 active:scale-95";

    const variants = {
      default: primary
        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        : "bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 dark:text-white hover:bg-white/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
      secondary: "bg-gray-600/20 backdrop-blur-sm border border-gray-500/30 text-gray-900 dark:text-white hover:bg-gray-500/30 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]}`}
      >
        {icon}
        {text}
      </button>
    );
  };

  // Revamped StyleCard component using the provided UI structure
  const StyleCard = ({ style, onSelect, isSelected }) => {
    // Fallback to Palette if icon is not defined or style.icon is not a component
    const IconComponent = style.icon || Palette;
    const accentClasses = getAccentClasses(style.accentColor || 'purple'); // Default accent color
    const backgroundImage = style.image || styleImages[style.name] ;

    return (
      <div
        key={style.name}
        className={`group relative w-full aspect-w-1 aspect-h-1 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br ${style.gradient || 'from-gray-700/20 to-gray-800/20'} border border-white/10 backdrop-blur-xl transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-xl ${accentClasses.shadow} ${accentClasses.border}`}
        onClick={() => onSelect(style.name)}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-90 transition-all duration-1000 ease-out transform scale-110 group-hover:scale-100"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Overlay Gradients */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.hoverGradient || 'from-gray-700/30 to-gray-800/30'} opacity-0 group-hover:opacity-100 transition-all duration-700`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-pulse"></div>
        </div>
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
          {/* Icon */}
          <div
            className={`mb-6 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm group-hover:bg-white/20 ${accentClasses.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}
          >
            <IconComponent className="w-6 h-6 text-white transition-all duration-300" />
          </div>
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white transition-all duration-300 tracking-wide">
            {style.display_name || style.name}
          </h3>
          {/* Hover Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
            <div className="flex items-center justify-center space-x-2 text-white/90 text-sm font-medium">
              <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
              <span>Select Style</span>
              <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
        {/* Shine Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out delay-200" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1200 ease-out" />
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping delay-100"></div>
          <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping delay-500"></div>
        </div>
        {isSelected && (
          <div className="absolute top-4 right-4 p-2 rounded-full bg-purple-600 text-white shadow-lg">
            <Check size={20} />
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main
        className="relative flex-grow w-full flex justify-center items-center overflow-hidden px-4 bg-cover bg-center text-gray-900 dark:text-gray-300"
        style={{
          backgroundImage: `url(${waImage})`
        }}
      >
        {/* Dark mode overlay to hide the image */}
        

<div
  className="absolute inset-0 hidden dark:block bg-cover bg-center "
  style={{ backgroundImage: `url(${Image})` }}
></div>

        {/* Hidden file input - always available */}
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
        <canvas ref={canvasRef} className="hidden" />

        {/* Unified content container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">

          {/* Show orb only at start */}
          {!imagePreview && (
  <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6 md:px-8 lg:px-12">
    <div className="relative w-[90vw] sm:w-[500px] md:w-[650px] lg:w-[800px] aspect-square">
  <Orb hoverIntensity={0.6} rotateOnHover={true} hue={280} forceHoverState={false} />

  <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
        
        {/* Icon wrapper */}
<div className="mb-6 p-3 sm:p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full backdrop-blur-sm border border-purple-400/30">
  <Wand2 className="w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 text-gray-900 dark:text-white drop-shadow-lg" />
</div>

{/* Title */}
<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-transparent bg-clip-text mb-2 sm:mb-3 md:mb-4">
  AI Style Transfer
</h2>

{/* Subtitle */}
<p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 text-gray-700 dark:text-white/80 font-medium max-w-[90%] sm:max-w-md md:max-w-lg">
  Transform your images with artistic styles
</p>

{/* Buttons */}
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <StyledButton 
    onClick={triggerFileUpload} 
    icon={<Upload className="w-4 h-4 sm:w-5 sm:h-5" />} 
    text="Select Image" 
    primary 
  />
  <StyledButton 
    onClick={openCamera} 
    icon={<Camera className="w-4 h-4 sm:w-5 sm:h-5" />} 
    text="Use Camera" 
  />
</div>

      </div>
    </div>
  </section>
)}


          {/* Main content layout when image is selected */}
          {imagePreview && (
            <section className="min-h-[80vh] flex flex-col justify-center">

              {/* Enhanced Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 text-sm max-w-sm mx-auto shadow-lg">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <div className="mb-6 p-8 bg-purple-600/20 backdrop-blur-md rounded-3xl border border-purple-400/30">
                    <Loader2 className="w-16 sm:w-20 h-16 sm:h-20 animate-spin text-purple-300" />
                  </div>
                  <p className="text-xl text-black font-medium animate-pulse  dark:text-purple-300">Processing your image...</p>
                  <p className="text-sm text-black/60 mt-2  dark:text-white">This may take a few moments</p>
                </div>
              )}

              {/* Style Selection Layout */}
              {showStyles && !isLoading && !styledImage && (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center py-8">
                  {/* Original Image */}
                  <div className="flex flex-col items-center w-full lg:w-1/2 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                      Original Image
                    </h3>
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl w-full">
                      <img
                        src={imagePreview}
                        alt="Original"
                        className="w-full h-auto max-h-[400px] rounded-2xl shadow-lg object-contain mx-auto"
                      />
                    </div>
                    <div className="mt-6">
                      <StyledButton onClick={resetState} icon={<Upload className="w-4 h-4" />} text="Change Image" variant="secondary" />
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div className="flex flex-col items-center w-full lg:w-1/2 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                      Choose Your Style
                    </h3>
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-4 justify-items-center">
                        {availableStyles.map((style) =>
                          // Add a defensive check here
                          style && style.name ? (
                            <StyleCard
                              key={style.name}
                              style={style}
                              onSelect={handleStyleSelect}
                              isSelected={selectedStyle === style.name}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <StyledButton onClick={() => setShowStyles(false)} icon={<ArrowLeft className="w-4 h-4" />} text="Back" variant="secondary" />
                    </div>
                  </div>
                </div>
              )}

              {/* Results Layout */}
              {styledImage && !isLoading && (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center py-8">
                  {/* Original Image */}
                  <div className="flex flex-col items-center w-full lg:w-1/2 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-lg">Original</h3>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl w-full">
                      <img
                        src={imagePreview}
                        alt="Original"
                        className="w-full h-auto max-h-[400px] rounded-2xl shadow-lg object-contain"
                      />
                    </div>
                  </div>

                  {/* Styled Result */}
                  <div className="flex flex-col items-center w-full lg:w-1/2 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-lg">Styled Result</h3>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl w-full">
                      <img
                        src={styledImage}
                        alt="Styled Result"
                        className="w-full h-auto max-h-[400px] rounded-2xl shadow-lg object-contain"
                      />
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <StyledButton onClick={downloadStyledImage} icon={<Download className="w-5 h-5" />} text="Download" primary />
                      <StyledButton onClick={tryAnotherStyle} icon={<Palette className="w-5 h-5" />} text="Try Another Style" />
                    </div>
                  </div>
                </div>
              )}

              {/* Simple state when image selected but no styles shown yet */}
              {!showStyles && !styledImage && !isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-8 w-full max-w-sm md:max-w-md">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="w-full h-auto max-h-[400px] rounded-2xl shadow-lg object-contain"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <StyledButton onClick={() => setShowStyles(true)} icon={<Wand2 className="w-5 h-5" />} text="Choose Style" primary />
                    <StyledButton onClick={resetState} icon={<Upload className="w-5 h-5" />} text="Change Image" />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Enhanced Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg px-4">
            <div className="w-full max-w-4xl p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
              <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-2xl shadow-xl" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mt-8">
              <StyledButton onClick={handleCapture} icon={<Camera className="w-6 h-6" />} text="Capture Photo" primary />
              <button
                onClick={closeCamera}
                className="p-4 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <X size={28} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StyleTransferPage;