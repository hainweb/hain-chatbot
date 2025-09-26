import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative w-32 h-32">
        {/* Center square */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black dark:bg-white rounded-sm"></div>
        
        {/* SVG for lines and dots */}
        <svg className="w-full h-full" viewBox="0 0 128 128" fill="none">
          {/* Lines connecting intermediate dots to outer dots */}
          {/* Top */}
          <line x1="64" y1="42" x2="64" y2="16" strokeWidth="2" className="text-black dark:text-white animate-line-1" />
          {/* Top Right */}
          <line x1="80" y1="48" x2="96" y2="32" strokeWidth="2" className="text-black dark:text-white animate-line-2" />
          {/* Right */}
          <line x1="86" y1="64" x2="112" y2="64" strokeWidth="2" className="text-black dark:text-white animate-line-3" />
          {/* Bottom Right */}
          <line x1="80" y1="80" x2="96" y2="96" strokeWidth="2" className="text-black dark:text-white animate-line-4" />
          {/* Bottom */}
          <line x1="64" y1="86" x2="64" y2="112" strokeWidth="2" className="text-black dark:text-white animate-line-5" />
          {/* Bottom Left */}
          <line x1="48" y1="80" x2="32" y2="96" strokeWidth="2" className="text-black dark:text-white animate-line-6" />
          {/* Left */}
          <line x1="42" y1="64" x2="16" y2="64" strokeWidth="2" className="text-black dark:text-white animate-line-7" />
          {/* Top Left */}
          <line x1="48" y1="48" x2="32" y2="32" strokeWidth="2" className="text-black dark:text-white animate-line-8" />
          
          {/* Intermediate dots (closer to center, filled) */}
          {/* Top */}
          <circle cx="64" cy="42" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Top Right */}
          <circle cx="80" cy="48" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Right */}
          <circle cx="86" cy="64" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Bottom Right */}
          <circle cx="80" cy="80" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Bottom */}
          <circle cx="64" cy="86" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Bottom Left */}
          <circle cx="48" cy="80" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Left */}
          <circle cx="42" cy="64" r="4" className="text-black dark:text-white" fill="currentColor" />
          {/* Top Left */}
          <circle cx="48" cy="48" r="4" className="text-black dark:text-white" fill="currentColor" />
          
          {/* Outer dots with sequential animation (larger, empty by default) */}
          {/* Top - dot 1 */}
          <circle 
            cx="64" 
            cy="16" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-1"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Top Right - dot 2 */}
          <circle 
            cx="96" 
            cy="32" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-2"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Right - dot 3 */}
          <circle 
            cx="112" 
            cy="64" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-3"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Bottom Right - dot 4 */}
          <circle 
            cx="96" 
            cy="96" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-4"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Bottom - dot 5 */}
          <circle 
            cx="64" 
            cy="112" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-5"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Bottom Left - dot 6 */}
          <circle 
            cx="32" 
            cy="96" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-6"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Left - dot 7 */}
          <circle 
            cx="16" 
            cy="64" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-7"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Top Left - dot 8 */}
          <circle 
            cx="32" 
            cy="32" 
            r="6" 
            className="text-black dark:text-white animate-spin-dot-8"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
          />
        </svg>
      </div>
      
      {/* Loading text with typing animation */}
      <div className="mt-8 text-center">
        <p className="text-lg font-medium text-black dark:text-white animate-typing">
          Loading<span className="animate-dots">...</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 animate-fade-in">
          Verifying connection
        </p>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-dot {
          0%, 75% {
            fill: none;
          }
          12.5%, 37.5% {
            fill: currentColor;
          }
        }
        
        @keyframes spin-line {
          0%, 75% {
            stroke: rgba(128, 128, 128, 0.3);
          }
          12.5%, 37.5% {
            stroke: currentColor;
          }
        }
        
        .animate-spin-dot-1 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 0s;
        }
        
        .animate-spin-dot-2 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 0.25s;
        }
        
        .animate-spin-dot-3 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-spin-dot-4 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 0.75s;
        }
        
        .animate-spin-dot-5 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-spin-dot-6 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 1.25s;
        }
        
        .animate-spin-dot-7 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .animate-spin-dot-8 {
          animation: spin-dot 2s ease-in-out infinite;
          animation-delay: 1.75s;
        }
        
        .animate-line-1 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 0s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-2 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 0.25s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-3 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 0.5s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-4 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 0.75s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-5 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 1s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-6 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 1.25s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-7 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 1.5s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        .animate-line-8 {
          animation: spin-line 2s ease-in-out infinite;
          animation-delay: 1.75s;
          stroke: rgba(128, 128, 128, 0.3);
        }
        
        /* Dark mode line colors */}
        .dark .animate-line-1,
        .dark .animate-line-2,
        .dark .animate-line-3,
        .dark .animate-line-4,
        .dark .animate-line-5,
        .dark .animate-line-6,
        .dark .animate-line-7,
        .dark .animate-line-8 {
          stroke: rgba(255, 255, 255, 0.3);
        }
        
        .dark .animate-line-1 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 0s;
        }
        
        .dark .animate-line-2 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 0.25s;
        }
        
        .dark .animate-line-3 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .dark .animate-line-4 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 0.75s;
        }
        
        .dark .animate-line-5 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .dark .animate-line-6 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 1.25s;
        }
        
        .dark .animate-line-7 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .dark .animate-line-8 {
          animation: spin-line-dark 2s ease-in-out infinite;
          animation-delay: 1.75s;
        }
        
        @keyframes spin-line-dark {
          0%, 75% {
            stroke: rgba(255, 255, 255, 0.3);
          }
          12.5%, 37.5% {
            stroke: white;
          }
        }
        
        @keyframes typing {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes dots {
          0%, 20% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          60% {
            opacity: 0;
          }
          80%, 100% {
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-typing {
          animation: typing 2s ease-in-out infinite;
        }
        
        .animate-dots {
          animation: dots 1.5s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;