"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react"; 
import { store } from "./store/store";

type LayoutProps = {
  children: ReactNode;
};

// Sidebar Context
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SessionProvider> 
      <Provider store={store}>
        <SidebarContext.Provider value={{
          isCollapsed,
          setIsCollapsed,
          isMobileOpen,
          setIsMobileOpen,
        }}>
          <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <aside 
              className={`
                ${isCollapsed ? 'w-16' : 'w-80'} 
                bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                transition-all duration-300 ease-in-out
                hidden md:block
                flex-shrink-0
              `}
            >
              <Sidebar />
            </aside>

            {isMobileOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
            )}
            
            <aside 
              className={`
                fixed left-0 top-0 h-full w-80 z-50
                bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                md:hidden
              `}
            >
              <Sidebar />
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-800">
              <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <div className="custom-scroll flex-1 overflow-y-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarContext.Provider>
      </Provider>
    </SessionProvider>
  );
}
