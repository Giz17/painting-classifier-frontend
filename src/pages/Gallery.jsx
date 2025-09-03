import React, { useEffect, useState } from 'react';
import { LoaderCircle, Download, X, Palette } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ba from '../assets/ab.jpg'; // Background image
import Image from '../assets/4.png'
import Footer from '../components/Footer'; // Importing Footer

const links = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'History', path: '/history' },
  { name: 'About', path: '/about' },
];

const GalleryPage = ({ setPage }) => {
  const [groupedImages, setGroupedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      setPage && setPage("gallery");

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("User not authenticated:", error?.message);
        setLoading(false);
        return;
      }

      const user_email = user.email;
      try {
        const response = await fetch(`http://localhost:8000/gallery/?user_email=${user_email}`);
        const data = await response.json();
        setGroupedImages(data || {});
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [setPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-fade-in">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedImage.name || 'painting.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image.");
    }
  };

  const handleStyleTransfer = async () => {
    try {
      // Fetch the image and convert it to a File object for style transfer
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const file = new File([blob], selectedImage.name || 'gallery-image.jpg', { 
        type: blob.type || 'image/jpeg' 
      });

      // Create an object URL for the image display
      const imageUrl = URL.createObjectURL(blob);

      console.log('Gallery - Navigating to style transfer with:', {
        imageUrl,
        file,
        style: selectedImage.style
      });

      // Navigate to style transfer page with the image and file
      navigate('/style-transfer', {
        state: {
          image: imageUrl, // For display in the style transfer component
          file: file, // File object for processing
          originalStyle: selectedImage.style, // Additional context
          fromGallery: true // Flag to indicate source
        }
      });

      // Close the modal
      setSelectedImage(null);

    } catch (error) {
      console.error("Failed to prepare image for style transfer:", error);
      alert("Failed to load image for style transfer.");
    }
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden animate-fade-in text-black"
      style={{
        backgroundImage: `url(${ba})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
     <div
      className="absolute inset-0 hidden dark:block bg-cover bg-center "
      style={{ backgroundImage: `url(${Image})` }}
    ></div>
  
      {/* Main Content */}
      <div className="relative z-10 px-4 py-6 md:px-12 min-h-screen">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-6  dark:text-white">
          Art Gallery
        </h2>
        <p className="text-center mb-8 max-w-2xl mx-auto  dark:text-white">
          Explore a curated selection of breathtaking artworks from various styles.
        </p>

        {Object.keys(groupedImages).length === 0 ? (
          <div className="text-center  dark:text-white">
            No artworks found. Classify images to see them here.
          </div>
        ) : (
          Object.entries(groupedImages).map(([style, images]) => (
            <div key={style} className="mb-10">
              <h3 className="text-lg font-semibold text-blue-700 mb-3  dark:text-white/70">{style}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer group relative"
                    onClick={() => setSelectedImage({ url, style, name: `${style}-${idx}` })}
                  >
                    <img
                      src={url}
                      alt={`${style}-${idx}`}
                      className="w-full h-48 object-cover"
                    />
                    {/* Hover overlay with style transfer hint */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Palette className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to view & transform</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Image Modal with Style Transfer */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {selectedImage.style}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Gallery Artwork • Ready for Style Transfer
              </p>
            </div>

            {/* Image */}
            <div className="mb-6 flex justify-center">
              <img
                src={selectedImage.url}
                alt="Selected Artwork"
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              
              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Original
              </button>

              {/* Style Transfer Button */}
              <button
                onClick={handleStyleTransfer}
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                <Palette className="w-5 h-5 mr-2" />
                Apply Style Transfer
              </button>
            </div>

            {/* Style Transfer Info */}
            <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-1">
                    Transform This Artwork
                  </h4>
                  <p className="text-purple-700 dark:text-purple-300 text-xs leading-relaxed">
                    Use AI-powered neural style transfer to transform this <strong>{selectedImage.style}</strong> artwork 
                    into different artistic styles. Create unique variations by applying Impressionist, Cubist, 
                    Abstract, or other artistic techniques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default GalleryPage;