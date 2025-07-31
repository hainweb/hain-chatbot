"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Settings,
  Globe,
  Lightbulb,
  Search,
  Wand2,
  Mic,
  X,
  Upload,
  FileText,
  Sparkles,
  Send,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setChats } from "@/app/store/slices/chatSlice";

const generateId = () => Math.random().toString(36).substr(2, 9);

interface Message {
  _id: string;
  chatId: string;
  role: string;
  content: string;
  tool?: string;
  createdAt: string;
  fileNames?: string[];
}

interface SearchInputComponentProps {
  chatId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: boolean;
  setFirstMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchInputComponent: React.FC<SearchInputComponentProps> = ({
  chatId,
  setMessages,
  isTyping,
  setIsTyping,
  setFirstMessage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"files" | "tools">("files");
  interface Tool {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    color: string;
    textColor: string;
  }
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputValue, setInputValue] = useState("");
  interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    status: "uploading" | "done" | "error";
  }

  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const tools = [
    {
      id: "think",
      name: "Think for longer",
      icon: Lightbulb,
      description: "Extended reasoning and analysis",
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-500",
    },
    {
      id: "research",
      name: "Deep research",
      icon: Search,
      description: "Comprehensive information gathering",
      color: "from-blue-500 to-indigo-500",
      textColor: "text-blue-500",
    },
    {
      id: "image",
      name: "Create image",
      icon: Wand2,
      description: "AI-powered image generation",
      color: "from-violet-500 to-purple-500",
      textColor: "text-violet-500",
    },
    {
      id: "search",
      name: "Web search",
      icon: Globe,
      description: "Real-time web information",
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-500",
    },
    {
      id: "canvas",
      name: "Canvas",
      icon: Sparkles,
      description: "Creative workspace and design",
      color: "from-rose-500 to-pink-500",
      textColor: "text-rose-500",
    },
  ];

  useEffect(() => {
    setHasMounted(true);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePlusClick = () => {
    setActiveTab("files");
    setIsDropdownOpen(true);
  };

  const handleToolsClick = () => {
    setActiveTab("tools");
    setIsDropdownOpen(true);
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const clearSelectedTool = () => {
    setSelectedTool(null);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const tempId = generateId();

      const tempFile: UploadedFile = {
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
      };

      setUploadedFiles((prev) => [...prev, tempFile]);

      const formData = new FormData();
      formData.append("file", file);

      try {
        let fileId = "";
        const response = await axios.post(`${BASE_URL}/upload-file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        fileId = response.data.fileId;

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === tempId ? { ...f, id: fileId, status: "done" } : f
          )
        );
        console.log("Upload success:", response.data);
      } catch (err) {
        console.error("Upload failed:", err);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === tempId ? { ...f, status: "error" } : f))
        );
      }
    }

    setIsDropdownOpen(false);
  };

  const removeFile = (id: number | string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getPlaceholderText = () => {
    if (selectedTool) {
      switch (selectedTool.id) {
        case "search":
          return "Search the web for information...";
        case "think":
          return "What complex problem should I analyze?";
        case "research":
          return "What topic should I research thoroughly?";
        case "image":
          return "Describe the image you want me to create...";
        case "canvas":
          return "What would you like to design or create?";
      }
    }
    return "Type your message...";
  };

  const handleSend = async () => {
    interface Chat {
      _id: string;
      userId: string;
      title: string;
      createdAt: string;
      updatedAt: string;
    }

    const fileNames = uploadedFiles.map((file) => file.name).filter(Boolean);

    const userMessage: Message = {
      _id: new Date().toISOString(),
      chatId: chatId ?? "",
      role: "user",
      content: inputValue,
      createdAt: new Date().toISOString(),
      tool: selectedTool?.id,
      ...(fileNames.length > 0 && { fileNames }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setUploadedFiles([]);
    setIsTyping(true);

    try {
      let endpoint = "";
      interface Payload {
        question: string;
        chatId: string;
        firstMessage: boolean;
        files?: { name: string; size: number; type: string }[];
        tool?: string;
      }

      const payload: Payload = {
        question: inputValue,
        chatId: chatId ?? "",
        firstMessage: !chatId,
      };

      if (uploadedFiles.length > 0) {
        endpoint = `${BASE_URL}/ask-file-question`;
        payload.files = uploadedFiles.map((file) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
        }));
        payload.tool = "LLM";

       const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify(payload),
});

for (const [key, value] of response.headers.entries()) {
  console.log(`${key}: ${value}`);
}

const backendChatId = response.headers.get("x-chat-id");
if (!chatId && !backendChatId) {
  throw new Error("Chat ID not received from backend for new chat");
}

const finalChatId = chatId || backendChatId;
if (!response.body) throw new Error("No response body for streaming");
if (!finalChatId) throw new Error("Final chat ID is null or undefined");

const reader = response.body.getReader();
const decoder = new TextDecoder();

const assistantMessage: Message = {
  _id: new Date().toISOString(),
  chatId: finalChatId,
  createdAt: new Date().toISOString(),
  role: "assistant",
  content: "",
};

setMessages((prev) => [...prev, assistantMessage]);

let assistantContent = "";

try {
  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    assistantContent += chunk;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === assistantMessage._id
          ? { ...msg, content: assistantContent }
          : msg
      )
    );
  }
} catch (err) {
  setMessages((prevMessages) =>
    prevMessages.map((msg) =>
      msg._id === assistantMessage._id
        ? {
            ...msg,
            content: assistantContent || "⚠️ Error occurred while streaming response",
          }
        : msg
    )
  );
} finally {
  reader.releaseLock();
}

if (!chatId && finalChatId) {
  const newChat: Chat = {
    _id: finalChatId,
    userId: "",
    createdAt: new Date().toISOString(),
    title: inputValue || "New Chat",
    updatedAt: new Date().toISOString(),
  };
  dispatch(setChats([newChat, ...chats]));
  router.push(`/chat/${finalChatId}`);
}

      } else if (selectedTool?.id === "search") {
        endpoint = `${BASE_URL}/search-web`;
        payload.tool = "WEB SEARCH";

        const response = await axios.post(endpoint, payload, {
          withCredentials: true,
        });

        const assistantMessage: Message = {
          _id: new Date().toISOString(),
          chatId: response.data.chatId,
          createdAt: new Date().toISOString(),
          role: "assistant",
          content: response.data.answer,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (!chatId) {
          const newChat: Chat = {
            _id: response.data.chatId,
            userId: "",
            title: inputValue || "New Chat",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          dispatch(setChats([newChat, ...chats]));
          router.push(`/chat/${response.data.chatId}`);
        }
      } else {
        // STREAMING version
        endpoint = `${BASE_URL}/ask-question`;
        payload.tool = "LLM";

        console.log("Sending payload:", payload);

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        for (const [key, value] of response.headers.entries()) {
          console.log(`${key}: ${value}`);
        }

        const backendChatId = response.headers.get("x-chat-id");

        if (!chatId && !backendChatId) {
          throw new Error("Chat ID not received from backend for new chat");
        }

        const finalChatId = chatId || backendChatId;

        if (!response.body) throw new Error("No response body for streaming");
        if (!finalChatId) throw new Error("Final chat ID is null or undefined");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const assistantMessage: Message = {
          _id: new Date().toISOString(),
          chatId: finalChatId,
          createdAt: new Date().toISOString(),
          role: "assistant",
          content: "",
        };

        setMessages((prev) => [...prev, assistantMessage]);

        let assistantContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });

            assistantContent += chunk;

            setMessages((prevMessages) => {
              return prevMessages.map((msg) =>
                msg._id === assistantMessage._id
                  ? { ...msg, content: assistantContent }
                  : msg
              );
            });
          }
        } catch (streamError) {
          setMessages((prevMessages) => {
            return prevMessages.map((msg) =>
              msg._id === assistantMessage._id
                ? {
                    ...msg,
                    content:
                      assistantContent ||
                      "⚠️ Error occurred while streaming response",
                  }
                : msg
            );
          });
        } finally {
          reader.releaseLock();
        }

        if (!chatId && finalChatId) {
          setFirstMessage(true);
          const newChat: Chat = {
            _id: finalChatId,
            userId: "",
            createdAt: new Date().toISOString(),
            title: inputValue || "New Chat",
            updatedAt: new Date().toISOString(),
          };
          dispatch(setChats([newChat, ...chats]));
          router.push(`/chat/${finalChatId}`);
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        _id: new Date().toISOString(),
        chatId: chatId ?? "",
        createdAt: new Date().toISOString(),
        role: "assistant",
        content: "⚠️ Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-2">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 backdrop-blur-sm relative">
        {/* Uploaded Files */}
        {hasMounted && uploadedFiles.length > 0 && (
          <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {file.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    ({formatFileSize(file.size)})
                  </span>

                  {/* Upload status icon */}
                  {file.status === "uploading" && (
                    <span className="text-yellow-500 text-xs animate-pulse">
                      Uploading...
                    </span>
                  )}
                  {file.status === "done" && (
                    <span className="text-green-500 text-xs">Uploaded</span>
                  )}
                  {file.status === "error" && (
                    <span className="text-red-500 text-xs">Failed</span>
                  )}

                  {file.status !== "uploading" && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Box */}
        <div className="flex flex-col gap-3 mt-4">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getPlaceholderText()}
            rows={1}
            className="w-full resize-none custom-scroll overflow-y-auto bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base font-normal border-b border-gray-200 dark:border-gray-700 pb-2 max-h-48"
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim() !== "") {
                  handleSend();
                }
              }
            }}
          />

          {/* Bottom Buttons */}
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlusClick}
                className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-gray-100 flex items-center justify-center shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5 text-white dark:text-gray-900" />
              </button>
              <button
                onClick={handleToolsClick}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute bottom-12 left-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 w-72">
                {activeTab === "tools" &&
                  tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className="w-full flex items-start gap-3 text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <tool.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                          {tool.name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                          {tool.description}
                        </div>
                      </div>
                    </button>
                  ))}

                {activeTab === "files" && (
                  <button
                    onClick={handleFileButtonClick}
                    className="flex items-center w-full text-gray-900 dark:text-gray-100 text-sm px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="font-medium">Upload Files</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-700">
                <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={handleSend}
                disabled={inputValue.trim() === "" || isTyping}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                  inputValue.trim() === ""
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200"
                }`}
              >
                <Send className="w-5 h-5 text-white dark:text-gray-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Tool Badge */}
        {selectedTool && (
          <div className="flex items-center mt-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-sm shadow-sm">
              <selectedTool.icon
                className={`${selectedTool.textColor} w-4 h-4 mr-2`}
              />
              <span className={`${selectedTool.textColor} font-medium`}>
                {selectedTool.name}
              </span>
              <button
                onClick={clearSelectedTool}
                className="ml-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};

export default SearchInputComponent;
