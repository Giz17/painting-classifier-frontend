import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, History, Sun, Moon, Info, Image, Wand2 } from "lucide-react";
import logo from "../assets/ba.png";

// Navigation Button
const NavButton = ({ to, icon, text, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative group px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/20"
    >
      {icon}
      <span>{text}</span>
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 dark:bg-indigo-400 transform transition-transform duration-300 ease-out ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
};

// Theme Toggle
const EclipseToggleButton = ({ onClick, theme }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 dark:border-white/20 backdrop-blur-md bg-white/10 dark:bg-gray-800/20 transition-all duration-300 hover:scale-105"
      aria-label="Toggle Theme"
    >
      <div
        className={`absolute text-yellow-400 transition-transform duration-700 ease-in-out ${
          theme === "dark" ? "scale-75" : "scale-100"
        }`}
      >
        <Sun size={24} />
      </div>
      <div
        className={`absolute w-10 h-10 bg-gray-900 rounded-full transition-transform duration-700 ease-in-out ${
          theme === "dark" ? "scale-100" : "scale-0"
        }`}
      />
      <div
        className={`absolute text-white transition-opacity duration-500 ease-in-out ${
          theme === "dark" ? "opacity-100 delay-300" : "opacity-0"
        }`}
      >
        <Moon size={24} />
      </div>
    </button>
  );
};

// Hamburger Icon
const AnimatedHamburgerIcon = ({ isOpen, onClick }) => {
  const lineBaseClasses =
    "h-0.5 w-6 rounded-full bg-gray-800 dark:bg-gray-200 transition-all duration-500 ease-in-out";
  return (
    <button
      onClick={onClick}
      className="flex flex-col h-12 w-12 justify-center items-center group"
      aria-label="Toggle mobile menu"
    >
      <div
        className={`${lineBaseClasses} ${
          isOpen ? "rotate-45 translate-y-[2px]" : "my-1"
        }`}
      />
      <div
        className={`${lineBaseClasses} ${isOpen ? "opacity-0" : "my-1"}`}
      />
      <div
        className={`${lineBaseClasses} ${
          isOpen ? "-rotate-45 -translate-y-[2px]" : "my-1"
        }`}
      />
    </button>
  );
};

const Navbar = ({ toggleTheme, theme }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isMenuOpen && event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-white/20 dark:border-white/10 backdrop-blur-lg shadow-lg transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900/60" : "bg-white/60"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? "py-1" : "py-3"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-lg"
            />
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Art Curator
            </h1>
          </Link>

          {/* Desktop Nav — switched from md to lg */}
          <div className="hidden lg:flex items-center gap-4">
            <NavButton
              to="/"
              icon={<Home size={18} />}
              text="Home"
              isActive={location.pathname === "/"}
            />
            <NavButton
              to="/style-transfer"
              icon={<Wand2 size={18} />}
              text="Converter"
              isActive={location.pathname === "/style-transfer"}
            />
            <NavButton
              to="/history"
              icon={<History size={18} />}
              text="History"
              isActive={location.pathname === "/history"}
            />
            <NavButton
              to="/about"
              icon={<Info size={18} />}
              text="About"
              isActive={location.pathname === "/about"}
            />
            <NavButton
              to="/gallery"
              icon={<Image size={18} />}
              text="Gallery"
              isActive={location.pathname === "/gallery"}
            />
            <EclipseToggleButton onClick={toggleTheme} theme={theme} />
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <EclipseToggleButton onClick={toggleTheme} theme={theme} />
            <AnimatedHamburgerIcon
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full border-t border-white/20 dark:border-white/10 shadow-lg transition-all duration-500 overflow-hidden ${
          theme === "dark" ? "bg-[#121826]" : "bg-white"
        } ${isMenuOpen ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="flex flex-col items-center gap-4 px-2 pt-4 pb-6">
          {[
            { to: "/", text: "Home" },
            { to: "/style-transfer", text: "Converter" },
            { to: "/history", text: "History" },
            { to: "/about", text: "About" },
            { to: "/gallery", text: "Gallery" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className="w-full text-center py-3 rounded-lg group transition-colors duration-300 hover:bg-indigo-500/10"
            >
              <span className="inline-block text-lg font-medium text-gray-800 dark:text-gray-200 transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 group-hover:font-bold">
                {link.text}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;