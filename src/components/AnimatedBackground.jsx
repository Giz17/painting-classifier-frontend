import { useState, useEffect } from 'react';

const AnimatedBackground = ({ 
  variant = 'flowing', 
  colors = ['#667eea', '#764ba2', '#f093fb'],
  speed = 'medium',
  intensity = 'normal',
  className = '',
  children 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const speedMap = {
    slow: '15s',
    medium: '8s',
    fast: '4s'
  };

  const getVariantStyles = () => {
    const baseColors = colors.length >= 3 ? colors : ['#667eea', '#764ba2', '#f093fb'];
    
    switch (variant) {
      case 'flowing':
        return {
          background: `linear-gradient(-45deg, ${baseColors[0]}, ${baseColors[1]}, ${baseColors[2]}, ${baseColors[0]})`,
          backgroundSize: '400% 400%',
          animation: `flowingGradient ${speedMap[speed]} ease infinite`
        };
      
      case 'waves':
        return {
          background: `
            radial-gradient(circle at 20% 50%, ${baseColors[0]}40 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${baseColors[1]}40 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, ${baseColors[2]}40 0%, transparent 50%),
            linear-gradient(135deg, ${baseColors[0]}, ${baseColors[2]})
          `,
          animation: `waveMotion ${speedMap[speed]} ease-in-out infinite alternate`
        };
      
      case 'orbs':
        return {
          background: `
            radial-gradient(circle at 25% 25%, ${baseColors[0]} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${baseColors[1]} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${baseColors[2]} 0%, transparent 70%),
            linear-gradient(45deg, ${baseColors[0]}20, ${baseColors[2]}20)
          `,
          animation: `orbFloat ${speedMap[speed]} ease-in-out infinite`
        };
      
      case 'mesh':
        return {
          background: `
            conic-gradient(from 0deg at 50% 50%, ${baseColors[0]}, ${baseColors[1]}, ${baseColors[2]}, ${baseColors[0]}),
            radial-gradient(ellipse at center, transparent 20%, ${baseColors[1]}10 70%)
          `,
          animation: `meshRotate ${speedMap[speed]} linear infinite`
        };
      
      case 'interactive':
        { const x = typeof window !== 'undefined' ? (mousePos.x / window.innerWidth) * 100 : 50;
        const y = typeof window !== 'undefined' ? (mousePos.y / window.innerHeight) * 100 : 50;
        return {
          background: `
            radial-gradient(circle at ${x}% ${y}%, ${baseColors[0]} 0%, transparent 50%),
            radial-gradient(circle at ${100-x}% ${100-y}%, ${baseColors[1]} 0%, transparent 50%),
            linear-gradient(45deg, ${baseColors[2]}30, ${baseColors[0]}30)
          `,
          transition: 'background 0.3s ease'
        }; }
      
      default:
        return {
          background: `linear-gradient(135deg, ${baseColors[0]}, ${baseColors[1]}, ${baseColors[2]})`,
        };
    }
  };

  const intensityOpacity = {
    light: '0.6',
    normal: '0.8',
    intense: '1.0'
  };

  return (
    <>
      {/* Global CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flowingGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes waveMotion {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.05) rotate(2deg); }
          }
          
          @keyframes orbFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            33% { transform: translateY(-10px) scale(1.02); }
            66% { transform: translateY(5px) scale(0.98); }
          }
          
          @keyframes meshRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes drift {
            from { transform: translateX(0px); }
            to { transform: translateX(20px); }
          }
        `
      }} />

      <div 
        className={`relative overflow-hidden ${className}`}
        style={{
          ...getVariantStyles(),
          opacity: intensityOpacity[intensity]
        }}
      >
        {/* Optional overlay patterns */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)
            `,
            backgroundSize: '20px 20px',
            animation: variant === 'flowing' ? `drift ${speedMap[speed]} linear infinite` : 'none'
          }}
        />
        
        {children && (
          <div className="relative z-10 h-full w-full">
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default AnimatedBackground;