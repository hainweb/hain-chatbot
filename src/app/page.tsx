"use client";

import { useState, useEffect, useRef } from "react";
import ChatInbox from "@/components/ChatInbox";
import WelcomeScreen from "@/components/NewChat";
import Layout from "./LayoutPage";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingAnimation } from "@/components/TypingAnimation";
import WebSearchLoading from "@/components/WebSearchLoading";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/app/store/slices/userSlice";
import axios from "axios";

import { BASE_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/store/store";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    const getUser = async () => {
      try {
        axios.post(process.env.ANALYTICS_URL!, { platform: "hainchat" });
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
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [dispatch, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (loading) {
    return <LoadingSpinner />;
  }

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
