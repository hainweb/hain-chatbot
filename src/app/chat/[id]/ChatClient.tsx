"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingAnimation } from "@/components/TypingAnimation";
import WebSearchLoading from "@/components/WebSearchLoading";
import ChatInbox from "@/components/ChatInbox";

interface Message {
  _id: string;
  chatId: string;
  role: string;
  content: string;
  tool?: string;
  createdAt: string;
  fileNames?: string[];
}

interface Props {
  chatId: string;
  initialMessages: Message[];
}

export default function ChatClient({ chatId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    return () => clearTimeout(timeout);
  }, [messages, isTyping]);
  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSetMessages = (
    newMessages: Message[] | ((prev: Message[]) => Message[])
  ) => {
    if (typeof newMessages === "function") {
      setMessages((prev) => {
        const updated = newMessages(prev);
        const currentIds = new Set(prev.map((m) => m._id));
        updated.forEach((msg) => {
          if (msg.role !== "user" && !currentIds.has(msg._id)) {
            setNewMessageIds((prevIds) => new Set([...prevIds, msg._id]));
          }
        });
        return updated;
      });
    } else {
      const currentIds = new Set(messages.map((m) => m._id));
      newMessages.forEach((msg) => {
        if (msg.role !== "user" && !currentIds.has(msg._id)) {
          setNewMessageIds((prev) => new Set([...prev, msg._id]));
        }
      });
      setMessages(newMessages);
    }
  };

  return (
    <>
      {/* background with light sophisticated gradients */}
      <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 via-slate-50/50 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-100/20 to-indigo-100/20 dark:from-violet-900/10 dark:to-indigo-900/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-100/20 to-blue-100/20 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-24 space-y-8">
              {/* welcome section */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-transform">
                  <span className="text-white text-3xl font-bold">AI</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-3xl blur-xl -z-10"></div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
                  Welcome to Hain AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">
                  Your intelligent assistant is ready to provide exceptional
                  support. Start your conversation to experience premium AI
                  interaction.
                </p>

                {/* feature highlights */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {[
                    "🚀 Lightning Fast",
                    "🎯 Precise Answers",
                    "💎 Premium Quality",
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg border border-black/5 dark:border-white/10 backdrop-blur-sm"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isNewMessage={newMessageIds.has(msg._id)}
                  firstMessage={index === 1 ? true : false}
                />
              ))}
              {isTyping &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "user" &&
                messages[messages.length - 1].tool != "search" && (
                  <div className="flex justify-start mb-8">
                    <div className="max-w-[85%] lg:max-w-[75%]">
                      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <TypingAnimation />
                      </div>
                    </div>
                  </div>
                )}
              {isTyping &&
                messages.length > 0 &&
                messages[messages.length - 1].tool === "search" && (
                  <div className="flex justify-start mb-8">
                    <div className="max-w-[85%] lg:max-w-[75%]">
                      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <WebSearchLoading
                          searchQuery={messages[messages.length - 1].content}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/*  chat input section */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-gray-800 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInbox
            chatId={chatId}
            setMessages={handleSetMessages}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
            setFirstMessage={() => false}
          />
        </div>
        <div className="text-center text-xs text-white dark:text-gray-200 pb-2">
          Hain is an AI by Ajin. It can make mistakes. Check key info carefully.
        </div>
      </div>
    </>
  );
}
