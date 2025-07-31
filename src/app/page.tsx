"use client";

import { useState, useEffect, useRef } from "react";
import ChatInbox from "@/components/ChatInbox";
import WelcomeScreen from "@/components/NewChat";
import Layout from "./LayoutPage";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingAnimation } from "@/components/TypingAnimation";
import WebSearchLoading from "@/components/WebSearchLoading";

export default function ChatPage() {
  interface Message {
    _id: string;
    chatId: string;
    role: string;
    content: string;
    createdAt: string;
    tool?: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [firstMessage, setFirstMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex h-screen w-full overflow-hidden justify-center ">
      <Layout>
        <div className="flex bg-gradient-to-br from-white via-white to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 transition-colors">
          <div className="w-full max-w-4xl mx-auto min-h-screen ">
            <div className="flex flex-col flex-1 relative">
              {/* Main chat container */}
              <div className="flex flex-col flex-1 justify-between relative z-20 min-h-0">
                {/* Message Area */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
                  {messages.length === 0 ? (
                    <WelcomeScreen />
                  ) : (
                    <div className="space-y-2">
                      {messages.map((msg) => (
                        <MessageBubble
                          key={msg._id}
                          message={msg}
                          firstMessage={firstMessage}
                        />
                      ))}

                      {/* Typing bubble */}
                      {isTyping &&
                        messages.length > 0 &&
                        messages[messages.length - 1]?.tool !== "search" && (
                          <div className="flex justify-start mb-2">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 w-fit max-w-xs px-4 py-2">
                              <TypingAnimation />
                            </div>
                          </div>
                        )}

                      {/* Web Search loading*/}
                      {isTyping &&
                        messages[messages.length - 1]?.tool === "search" && (
                          <div className="flex justify-start mb-2">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 w-fit max-w-sm px-4 py-3">
                              <WebSearchLoading
                                searchQuery={
                                  messages[messages.length - 1].content
                                }
                              />
                            </div>
                          </div>
                        )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input box  */}
                <div className="z-30 relative flex-shrink-0 pb-4">
                  <div className="relative">
                    <ChatInbox
                      chatId=""
                      setMessages={setMessages}
                      isTyping={isTyping}
                      setIsTyping={setIsTyping}
                      setFirstMessage={setFirstMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
