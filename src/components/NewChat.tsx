"use client";
import Image from "next/image";

export default function WelcomeScreen() {
 



  return (
    <div className="h-full flex flex-col items-center justify-center px-6 bg-gradient-to-br from-white via-white to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 transition-colors duration-300">
      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Hero section */}
        <div className="mb-8">
          <div className="relative inline-block mb-6">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div> */}
            <div className="relative bg-gradient-to-r p-4 rounded-full">
              <Image
                src="/logo.png"
                alt="Logo"
                width={128}
                height={128}
                className="w-16 h-16 z-10"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent dark:from-white dark:via-blue-300 dark:to-purple-400 mb-4">
            Welcome to Hain AI
          </h1>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["AI-Powered", "Creative", "Intelligent", "Helpful"].map(
              (badge, index) => (
                <div
                  key={badge}
                  className="px-4 py-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {badge}
                </div>
              )
            )}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Ready to get started? Type your message below.
          </p>
        </div>
      </div>
    </div>
  );
}
