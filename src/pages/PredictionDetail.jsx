import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Percent, Tag, FileText, Palette } from 'lucide-react';
import Aurora from '../components/Aurora';
import Footer from '../components/Footer.jsx';

const PredictionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};

  if (!item) {
    return (
      <div className="relative flex flex-col min-h-screen bg-white dark:bg-gray-900 px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Aurora colorStops={['#FF3232', '#FF94B4', '#3A29FF']} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Item Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please return to the history page and select an item to view its details.
          </p>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} />
            Back to History
          </Link>
        </div>

        {/* Footer at bottom */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  const confidence = item.confidence
    ? ((item.confidence || 0) * 100).toFixed(0)
    : '—';

  let timestampDisplay = 'No timestamp available';
  if (item.timestamp) {
    try {
      if (typeof item.timestamp === 'string') {
        timestampDisplay = new Date(item.timestamp).toLocaleString();
      } else if (item.timestamp.seconds) {
        timestampDisplay = new Date(item.timestamp.seconds * 1000).toLocaleString();
      } else {
        timestampDisplay = new Date(item.timestamp).toLocaleString();
      }
    } catch {
      timestampDisplay = 'Invalid date';
    }
  }

  const imageSrc =
    item.imageUrl || item.image || item.image_url || item.storage_path || '';

  const handleStyleTransfer = async () => {
    try {
      // If we have the original image data, use it directly
      if (item.image && item.image.startsWith('data:')) {
        console.log('PredictionDetail - Using base64 image data for style transfer');
        
        navigate('/style-transfer', {
          state: {
            image: item.image,
            file: null, // We don't have the original file from history
            originalStyle: item.style,
            fromHistory: true,
            originalResult: {
              style: item.style,
              confidence: item.confidence,
              predictions: item.predictions,
              description: item.description
            }
          }
        });
        return;
      }

      // If we only have a URL, fetch the image and convert it
      if (imageSrc) {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], `${item.style || 'artwork'}.jpg`, { 
          type: blob.type || 'image/jpeg' 
        });

        // Create object URL for display
        const imageUrl = URL.createObjectURL(blob);

        console.log('PredictionDetail - Fetched image for style transfer:', {
          imageUrl,
          file,
          originalStyle: item.style
        });

        navigate('/style-transfer', {
          state: {
            image: imageUrl,
            file: file,
            originalStyle: item.style,
            fromHistory: true,
            originalResult: {
              style: item.style,
              confidence: item.confidence,
              predictions: item.predictions,
              description: item.description
            }
          }
        });
      } else {
        alert('No image data available for style transfer.');
      }

    } catch (error) {
      console.error("Failed to prepare image for style transfer:", error);
      alert("Failed to load image for style transfer.");
    }
  };



  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora colorStops={['#FF3232', '#FF94B4', '#3A29FF']} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to History
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="lg:col-span-3">
            <div className="relative group">
              <img
                src={imageSrc}
                alt={item.style || 'Artwork'}
                className="w-full h-auto object-contain rounded-3xl shadow-2xl border-4 border-white/20 transition-transform group-hover:scale-[1.02]"
              />
              
              {/* Hover overlay for style transfer */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                <button
                  onClick={handleStyleTransfer}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors shadow-lg"
                >
                  <Palette size={20} />
                  Apply Style Transfer
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {item.style || 'Unknown Style'}
            </h2>

            <div className="space-y-5">
              {/* Confidence */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-yellow-400/20 dark:bg-yellow-400/10 p-3 rounded-full">
                  <Percent className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Confidence</h3>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                    {confidence}%
                  </p>
                </div>
              </div>

              {/* Art Style */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-blue-400/20 dark:bg-blue-400/10 p-3 rounded-full">
                  <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Art Style</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">{item.style}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-green-400/20 dark:bg-green-400/10 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Date Classified</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{timestampDisplay}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <FileText size={18} /> Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Transform Artwork</h3>
              
              {/* Style Transfer Button */}
              <button
                onClick={handleStyleTransfer}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                <Palette size={20} />
                Apply Style Transfer
              </button>
            </div>

            {/* Style Transfer Info */}
            <div className="mt-6 bg-purple-50/80 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-1">
                    Transform This {item.style}
                  </h4>
                  <p className="text-purple-700 dark:text-purple-300 text-xs leading-relaxed">
                    Apply neural style transfer to transform this classified artwork into different artistic styles. 
                    Create unique variations while preserving the original composition and structure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer at bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default PredictionDetail;