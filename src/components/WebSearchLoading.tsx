"use client";

import React, { useState, useEffect } from "react";
import { Search, Globe, Zap, LucideIcon } from "lucide-react";

interface Phase {
  text: string;
  icon: LucideIcon;
}

interface WebSearchLoadingProps {
  searchQuery?: string;
}

const WebSearchLoading: React.FC<WebSearchLoadingProps> = ({ searchQuery }) => {
  const [currentPhase, setCurrentPhase] = useState<number>(0);

  const phases: Phase[] = [
    { text: "Initializing search...", icon: Search },
    { text: "Scanning the web...", icon: Globe },
    { text: "Processing results...", icon: Zap },
    { text: "Crafting response...", icon: Search },
  ];

useEffect(() => {
  if (currentPhase === phases.length - 1) return; // Stop cycling after last phase

  const phaseInterval = setInterval(() => {
    setCurrentPhase((prev) => {
      const next = prev + 1;
      return next < phases.length ? next : prev; // Don't loop
    });
  }, 2000);

  return () => clearInterval(phaseInterval);
}, [currentPhase, phases.length]);


  const IconComponent = phases[currentPhase].icon;

  return (
    <div className="relative flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-2xl shadow-lg max-w-md mx-auto overflow-hidden">
      {/* Main Search Animation */}
      <div className="relative">
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-30"></div>

        <div className="relative w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-700">
          <IconComponent
            className="w-7 h-7 text-blue-600 dark:text-blue-400 transition-all duration-500 ease-in-out transform hover:scale-110"
            style={{ animation: "spin 2s linear infinite" }}
          />
        </div>
      </div>

      {/* Phase Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 transition-all duration-500 ease-in-out">
          {phases[currentPhase].text}
        </p>

        {/* Search Query from Props */}
        {searchQuery && (
          <div className="mt-3 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-600 max-w-xs">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-mono truncate whitespace-nowrap overflow-hidden text-ellipsis">
              &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Dot Animation */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 shadow-sm"
            style={{
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="flex space-x-1 mt-4">
        {phases.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-8 rounded-full transition-all duration-500 ${
              index === currentPhase
                ? "bg-gradient-to-r from-blue-400 to-purple-500 shadow-sm"
                : index < currentPhase
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          ></div>
        ))}
      </div>

      {/* Web Pattern BG */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3Ccircle cx='45' cy='15' r='1'/%3E%3Ccircle cx='15' cy='45' r='1'/%3E%3Ccircle cx='45' cy='45' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default WebSearchLoading;
