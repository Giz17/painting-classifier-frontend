import React, { useEffect, useState } from "react";
import { Sparkles, LogIn, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Aurora from "../components/Aurora";
import logo from "../assets/ba.png";
import splashLeft from "../assets/splash-left.png";
import splashRight from "../assets/splash-right.png";
import { supabase } from "../lib/supabase";
import Footer from '../components/Footer'; 

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);


  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <>
      {/* CSS Styles for the "Get Started" button */}
      <style>{`
        /* --- Light Mode Styles --- */
        .get-started-btn-uiverse {
          padding: 15px 25px;
          border: unset;
          border-radius: 15px;
          color: #212121;
          z-index: 1;
          background: #e8e8e8;
          position: relative;
          font-weight: 1000;
          font-size: 17px;
          -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
          box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
          transition: all 250ms;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .get-started-btn-uiverse::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0;
          border-radius: 15px;
          background-color: #212121;
          z-index: -1;
          -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
          box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
          transition: all 250ms;
        }
        
        .get-started-btn-uiverse .btn-content-wrapper {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .get-started-btn-uiverse:hover {
          color: #e8e8e8;
        }

        .get-started-btn-uiverse:hover::before {
          width: 100%;
        }

        .get-started-btn-uiverse .lucide-icon {
          transition: color 250ms;
        }

        .get-started-btn-uiverse:hover .lucide-icon {
          color: #e8e8e8;
        }
        
        /* --- Dark Mode Styles --- */
        .dark .get-started-btn-uiverse {
          background: rgba(255, 255, 255, 0.1);
          color: #e8e8e8;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 8px rgba(173, 216, 230, 0.3), 0 0 20px rgba(173, 216, 230, 0.1);
          transition: all 250ms, box-shadow 250ms;
        }

        .dark .get-started-btn-uiverse::before {
          background-color: #121826;
          box-shadow: none;
        }

        .dark .get-started-btn-uiverse:hover {
          color: #e8e8e8;
          border-color: #121826;
          box-shadow: 0 0 12px rgba(173, 216, 230, 0.5), 0 0 30px rgba(173, 216, 230, 0.2);
        }

        .dark .get-started-btn-uiverse .lucide-icon {
          color: #e8e8e8;
        }
      `}</style>
      <div className="bg-white dark:bg-gray-900">
        {/* Full Screen Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col">
          {/* Top Bar */}
          {user && (
            <div className="absolute top-0 left-0 w-full z-20 flex justify-end items-center px-6 py-4 bg-transparent">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-white hover:text-red-400 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}

          {/* Aurora Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Aurora
              className="absolute top-0 left-0 w-1/2 h-full"
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}   
              blend={0.6}
              amplitude={0.3}
              speed={0.25}
            />
          </div>

          {/* Decorative Paint Splashes */}
          <img
            src={splashLeft}
            alt="Paint Splash Left"
            className="absolute bottom-0 left-0 w-32 md:w-52 lg:w-[20rem] z-0 pointer-events-none max-w-full h-auto"
          />
          <img
            src={splashRight}
            alt="Paint Splash Right"
            className="absolute bottom-0 right-0 w-32 md:w-52 lg:w-[18rem] z-0 pointer-events-none max-w-full h-auto"
          />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow px-4">
            <img
              src={logo}
              alt="App Logo"
              className="w-40 h-40 md:w-52 md:h-52 object-contain mb-6"
            />
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white italic"
              style={{ fontFamily: "'Merriweather', serif", fontWeight: 500 }}
            >
              Welcome to Art Curator
            </h2>
            <p
              className="max-w-md text-base md:text-lg text-gray-900 dark:text-white mb-8 italic"
              style={{ fontFamily: "'Merriweather', serif", fontWeight: 500 }}
            >
              Unveil the artistic style. Let's begin your journey of discovery.
            </p>

            {user ? (
              <button
                className="get-started-btn-uiverse"
                onClick={() => navigate("/upload")}
              >
                <span className="btn-content-wrapper">
                  <Sparkles className="lucide-icon" size={18} />
                  Get Started
                </span>
              </button>
            ) : (
              <button
                className="get-started-btn-uiverse"
                onClick={() => navigate("/auth")}
              >
                <span className="btn-content-wrapper">
                  <LogIn className="lucide-icon" size={18} />
                  Login / Signup
                </span>
              </button>
            )}
          </div>
        </section>

       <Footer /> 
      </div>
    </>
  );
};

export default HomePage;