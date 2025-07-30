"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearChats, setChats } from "@/app/store/slices/chatSlice";
import { LogOut, PanelLeftOpen, PanelRightOpen, Settings } from "lucide-react";
import { RootState } from "@/app/store/store";
import { MessageSquarePlus, Search, User, Sun, Moon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/app/LayoutPage";
import { signOut } from "next-auth/react";
import { BASE_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import { setUser, clearUser } from "@/app/store/slices/userSlice";
import axios from "axios";

// Import the SettingsModal component
import SettingsModal from "./SettingsModal"; // Adjust the import path as needed

interface Chat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const router = useRouter();

  const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebar();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        console.log("me response", response);

        if (response.data.status) {
          console.log("user is logined");

          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearUser());
          router.push("/auth/login");
        }
      } catch (error) {
        console.log("error getting user", error);
      }
    };
    getUser();
  }, [dispatch, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/chats`, {
          withCredentials: true,
        });
        const data = res.data.chats || [];
        dispatch(setChats(data));
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [dispatch]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true,
      });

      if (response.data.status) {
        dispatch(clearUser());
        dispatch(clearChats());
        await signOut({ redirect: false });
        router.push("/auth/login");
      }
    } catch (error) {
      console.log("error in logout", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    setShowUserMenu(false);
  };

  const filteredChats = (chats || []).filter((chat: Chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchTerm("");
    }
  };

  function MessageTime({ createdAt }: { createdAt: string }) {
    const [formattedTime, setFormattedTime] = useState<string>("");

    useEffect(() => {
      const formatMessageTime = (createdAt: string): string => {
        const messageDate = new Date(createdAt);
        const now = new Date();

        const isToday =
          messageDate.getDate() === now.getDate() &&
          messageDate.getMonth() === now.getMonth() &&
          messageDate.getFullYear() === now.getFullYear();

        const isYesterday = (() => {
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          return (
            messageDate.getDate() === yesterday.getDate() &&
            messageDate.getMonth() === yesterday.getMonth() &&
            messageDate.getFullYear() === yesterday.getFullYear()
          );
        })();

        const timeStr = messageDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        if (isToday) return timeStr;
        if (isYesterday) return `Yesterday ${timeStr}`;

        return (
          messageDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }) + ` ${timeStr}`
        );
      };

      setFormattedTime(formatMessageTime(createdAt));
    }, [createdAt]);

    return <span>{formattedTime || "Loading..."}</span>;
  }

  const LoadingSpinner = () => {
    const skeletonArray = Array.from({ length: 6 });

    return (
      <ul className="space-y-2 animate-pulse">
        {skeletonArray.map((_, idx) => (
          <li
            key={idx}
            className="rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
                  <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const EmptyState = () =>
    !isCollapsed && (
      <div className="text-center py-8 px-4">
        <MessageSquarePlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-400">No chats yet</p>
        <p className="text-xs text-gray-500 mt-1">Start a new conversation</p>
      </div>
    );

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 group relative">
          <div className="flex items-center gap-3">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={128}
                  height={128}
                  className="w-8 h-8 z-10"
                  priority
                />
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hain
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle theme"
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {!isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hidden md:block"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelRightOpen size={18} />
              </button>
            ) : (
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hidden md:block"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}

            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          <Link href="/">
            <button
              className={`flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
              title="Start new chat"
            >
              <MessageSquarePlus size={20} />
              {!isCollapsed && <span>New chat</span>}
            </button>
          </Link>

          <button
            onClick={toggleSearch}
            className={`flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
            title="Search chats"
          >
            <Search size={20} />
            {!isCollapsed && <span>Search chats</span>}
          </button>

          {/* Search Input */}
          {showSearch && !isCollapsed && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Chats Section */}
        <div className="flex-1 overflow-hidden">
          {!isCollapsed && (
            <div className="px-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Recent Chats
              </h4>
            </div>
          )}

          <div className="custom-scroll flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredChats.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-1">
                {filteredChats.map((chat: Chat) => (
                  <li key={chat._id}>
                    <Link
                      href={`/chat/${chat._id}`}
                      className={`block hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors group cursor-pointer ${
                        isCollapsed ? "flex justify-center" : ""
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? chat.title : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquarePlus
                          size={16}
                          className="flex-shrink-0 text-gray-500"
                        />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {chat.title}
                            </p>
                            {chat.updatedAt && (
                              <p className="text-xs text-gray-500 truncate">
                                <MessageTime createdAt={chat.createdAt} />
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* User Section with dropdown */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 relative">
          <div
            onClick={() => setShowUserMenu((prev) => !prev)}
            className={`flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            )}
          </div>

          {/* Dropdown menu */}
          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-14 left-4 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSettingsClick}
                className="w-full flex gap-1 text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings size={18} /> Settings
              </button>
              {isLoggingOut ? (
                <div className="flex items-center justify-center px-4 py-2 text-sm text-red-500">
                  Logging out...
                  <svg
                    className="animate-spin ml-2 h-4 w-4 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex gap-1 text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
    </>
  );
}
