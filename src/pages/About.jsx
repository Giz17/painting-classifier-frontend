import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Aurora from "../components/Aurora";
import Footer from "../components/Footer"; // <-- importing footer component


const items = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Atharv S. Verlekar",
    subtitle: "Frontend Developer",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Giselle C. Fernandes",
    subtitle: "Backend Engineer",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Allen Payapally",
    subtitle: "UI/UX Designer",
    borderColor: "#EC4899",
    gradient: "linear-gradient(145deg, #EC4899, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Rashi Kavlekar",
    subtitle: "DevOps Engineer",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(180deg, #F59E0B, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=5",
    title: "Shane Furtado",
    subtitle: "Project Manager",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(145deg, #8B5CF6, #000)",
    url: "",
  },
];

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-white dark:bg-gray-900">
        {/* Full Screen Hero Section */}
       <section className="relative w-full min-h-screen flex flex-col">
        <div className="absolute top-0 left-0 w-full z-20 flex justify-end items-center px-6 py-4 bg-transparent"></div>
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

      
  
      {/* Main Content */}
      <div className="relative z-10 flex-grow px-5 py-20">
        {/* About Us */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-lg leading-7">
            We are a team of passionate individuals bringing art and technology
            together. Our goal is to make art exploration more intuitive,
            intelligent, and enjoyable through AI-driven tools and visually
            engaging design.
          </p>
        </section>

        {/* Our Vision */}
        <section className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-semibold mb-6">Our Vision</h2>
          <p className="text-lg leading-7">
            To revolutionize how people interact with art using cutting-edge
            machine learning models, making it easier to classify, curate, and
            connect with creativity across generations.
          </p>
        </section>

        {/* Team Section */}
        <h2 className="text-3xl text-center mb-10 font-semibold">
          Meet the Team
        </h2>
        <div className="flex justify-center flex-wrap gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.url || "#"}
              target={item.url ? "_blank" : undefined}
              rel={item.url ? "noopener noreferrer" : undefined}
              style={{
                width: "180px",
                padding: "10px",
                borderRadius: "16px",
                textDecoration: "none",
                color: "inherit",
                background: item.gradient,
                boxShadow: `0 4px 15px ${item.borderColor}80`,
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  border: `3px solid ${item.borderColor}`,
                }}
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.subtitle}</p>
              <p className="text-xs text-gray-400">{item.handle}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
      </section>
    </div>
  );
};

export default About;
