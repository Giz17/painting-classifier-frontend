// src/pages/ResultsPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Palette, BrainCircuit, Upload, ArrowRight } from 'lucide-react';
import ActionButton from '../components/ActionButton';
import Aurora from '../components/Aurora';
import Footer from '../components/Footer'; // Footer component

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, image, file } = location.state || {};

  const handleReset = () => {
    navigate('/upload');
  };

  const handleStyleTransfer = () => {
    // Navigate to style transfer page with the current image and file
    navigate('/style-transfer', {
      state: {
        image: image,
        file: file || null // Pass the file if available
      }
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">

      {/* Aurora background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
          blend={0.6}
          amplitude={0.3}
          speed={0.25}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex-grow max-w-6xl mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 md:p-10 space-y-8 transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={image}
            alt="Classified artwork"
            className="w-full h-auto max-h-[500px] object-contain rounded-xl shadow-xl border border-gray-300 dark:border-gray-800 transition-transform hover:scale-[1.02]"
          />

          <div className="flex flex-col justify-center space-y-6">
            {/* Style prediction */}
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest text-blue-500 dark:text-blue-400 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Predicted Style
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {result?.style || 'Unknown'}
              </p>
            </div>

            {/* Confidence bar */}
            <div className="mb-2">
              <h3 className="text-sm font-medium uppercase tracking-widest text-blue-500 dark:text-blue-400">
                Confidence
              </h3>
              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(result?.confidence || 0) * 100}%` }}
                />
              </div>
              <p className="text-right text-sm font-mono text-blue-600 dark:text-blue-300 mt-1">
                {((result?.confidence || 0) * 100).toFixed(1)}%
              </p>
            </div>

            {/* Top 3 predictions */}
            {result?.predictions && (() => {
              const relatedStyles = result.predictions;

              return relatedStyles.length > 0 ? (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                    Related Styles
                  </h3>
                  <div className="space-y-1 mt-1">
                    {relatedStyles.map(([label, score], index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        <span>{label}</span>
                        <span>{(score * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest text-blue-500 dark:text-blue-400 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                AI Curator's Notes
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed text-md">
                {result?.description || 'No description available.'}
              </p>
            </div>

            {/* Action buttons */}
            
              <div className="pt-4 space-y-3">
              {/* Try Another Image Button */}
              <ActionButton
                onClick={handleReset}
                icon={<Upload />}
                text="Try Another Image"
                className="w-full"
              />

              
              {/* Style Transfer Button */}
              <ActionButton
                onClick={handleStyleTransfer}
                icon={<Palette />}
                text="Apply Style Transfer"
                primary
                className="w-full"
              />
            </div>

            {/* Style Transfer Info */}
            <div className="bg-purple-50/80 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-800 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                  Ready for Style Transfer
                </h4>
              </div>
              <p className="text-purple-700 dark:text-purple-300 text-xs leading-relaxed">
                Transform this classified artwork with AI-powered neural style transfer. 
                Apply different artistic styles like Cubism, impressionism, or abstract patterns to create unique variations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spanning full width with no horizontal spacing */}
      <div className="w-full mt-12">
        <Footer />
      </div>

    </div>
  );
};

export default ResultsPage;
