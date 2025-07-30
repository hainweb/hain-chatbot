export const TypingAnimation = () => (
  <div className="flex items-center space-x-4 p-6">
    <div className="flex space-x-2">
      <div className="w-2.5 h-2.5 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full animate-bounce shadow-sm"></div>
      <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-bounce delay-75 shadow-sm"></div>
      <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-bounce delay-150 shadow-sm"></div>
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">
      Hain is crafting response...
    </span>
  </div>
);