import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Upload Artwork", path: "/upload" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
    { name: "History", path: "/history" },
    { name: "Ai Converter", path: "/style-transfer" },
  ];

  return (
    <footer className="relative z-10 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 px-4 sm:px-8 md:px-12 font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        
        {/* About */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            About Art Curator
          </h3>
          <p className="text-xs md:text-sm leading-relaxed">
            Art Curator is your go-to platform for exploring and understanding
            the styles behind your favorite artworks.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-1 text-xs md:text-sm">
            {links
              .filter(link => link.path !== location.pathname)
              .map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:underline text-left transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Contact Us
          </h3>
          <address className="not-italic text-xs md:text-sm space-y-1 leading-relaxed">
            <p>
              Email:{" "}
              <a
                href="mailto:support@artcurator.com"
                className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                support@artcurator.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                +1 (234) 567-890
              </a>
            </p>
            <p>123 Art Street, Creativity City</p>
          </address>
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Follow Us
          </h3>
          <div className="flex gap-3 text-gray-700 dark:text-gray-300">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
              <Facebook className="w-5 h-5 hover:text-indigo-600 dark:hover:text-indigo-400" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <Twitter className="w-5 h-5 hover:text-indigo-600 dark:hover:text-indigo-400" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
              <Instagram className="w-5 h-5 hover:text-indigo-600 dark:hover:text-indigo-400" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <Linkedin className="w-5 h-5 hover:text-indigo-600 dark:hover:text-indigo-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-3 text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-sans">
        © {new Date().getFullYear()} Art Curator. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
