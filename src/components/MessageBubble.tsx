import { FileText, ClipboardCopy, Check } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import "prismjs/themes/prism-tomorrow.css";

import Prism from "prismjs";
import "prismjs/components/prism-javascript";

interface Message {
  _id: string;
  chatId: string;
  role: string;
  content: string;
  tool?: string;
  createdAt: string;
  fileNames?: string[];
}

export const MessageBubble = ({
  message,
  isNewMessage = false,
  firstMessage,
}: {
  message: Message;
  isNewMessage?: boolean;
  firstMessage: boolean;
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const isAIMessage = message.role !== "user";

    if (isAIMessage && (isNewMessage || firstMessage)) {
      setShouldAnimate(true);
      setDisplayedContent("");
      setIsComplete(false);
    } else {
      setShouldAnimate(false);
      setDisplayedContent(message.content);
      setIsComplete(true);
    }
  }, [firstMessage, isNewMessage, message.content, message.role]);

  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    let index = 0;
    const content = message.content;
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;

        timeoutId = setTimeout(typeWriter, 2);
      } else {
        setIsComplete(true);
      }
    };

    timeoutId = setTimeout(typeWriter, 10);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message.content, shouldAnimate]);

  const isUser = message.role === "user";
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let listBuffer: string[] = [];

    const flushCodeBlock = (index: number) => {
      if (codeBuffer.length > 0) {
        const codeText = codeBuffer.join("\n");
        const highlighted = Prism.highlight(
          codeText,
          Prism.languages.javascript,
          "javascript"
        );

        elements.push(
          <div
            key={`code-block-${index}`}
            className="relative bg-[#040404] rounded-md my-4"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(codeText);
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
              className="absolute top-2 right-2 flex items-center gap-1 text-white text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded z-10"
            >
              {copiedIndex === index ? (
                <>
                  <Check size={14} className="text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardCopy size={14} />
                  Copy
                </>
              )}
            </button>
            <pre className="overflow-auto text-sm text-white font-mono p-4">
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
          </div>
        );
        codeBuffer = [];
      }
    };

    const flushList = (index: number) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-6 my-2 space-y-1">
            {listBuffer.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: formatInline(item.trim().slice(1).trim()),
                }}
              />
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    const formatInline = (text: string) => {
      return text
        .replace(
          /`([^`]+)`/g,
          `<code class="bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md text-sm font-mono border border-gray-200 dark:border-gray-600">$1</code>`
        )
        .replace(/\*\*([^*]+)\*\*/g, `<strong>$1</strong>`)
        .replace(/\*([^*]+)\*/g, `<em>$1</em>`)
        .replace(/__([^_]+)__/g, `<u>$1</u>`)
        .replace(/~~([^~]+)~~/g, `<del>$1</del>`)
        .replace(
          /(https?:\/\/[^\s]+)/g,
          `<a href="$1" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>`
        );
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock(index);
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (trimmed.startsWith("* ")) {
        listBuffer.push(line);
        return;
      } else {
        flushList(index);
      }

      if (trimmed !== "") {
        elements.push(
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: formatInline(line) }}
          />
        );
      } else {
        elements.push(<br key={`br-${index}`} />);
      }
    });

    flushCodeBlock(lines.length);
    flushList(lines.length);

    return elements;
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

    return <span>{formattedTime}</span>;
  }

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-8 group`}
    >
      <div
        className={`max-w-[85%] lg:max-w-[75%] ${
          isUser ? "order-2" : "order-1"
        }`}
      >
        {/* Enhanced role indicator */}
        <div
          className={`text-xs font-bold mb-3 tracking-wider uppercase ${
            isUser
              ? "text-right text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
              : "text-left text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400"
          }`}
        >
          {message.role === "user" ? "You" : "Hain AI"}
        </div>

        {!isUser && message.tool && (
          <div className="text-xs font-semibold mb-1 text-blue-600 dark:text-blue-400">
            {message.tool === "WEB SEARCH" ? "Searched from Web" : ""}
          </div>
        )}
        {isUser && (message.fileNames?.length ?? 0) > 0 && (
          <div className="mb-2">
            <div className="relative p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white/10 dark:bg-gray-900 text-white ml-8 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white/90 dark:text-gray-200">
                  Attachments
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                {(message.fileNames ?? []).map((fileName, index) => (
                  <a
                    key={index}
                    href={`/downloads/${encodeURIComponent(fileName)}`}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/20 transition-colors duration-200"
                    title={fileName}
                    download
                  >
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="truncate text-sm font-medium text-white dark:text-gray-100 max-w-[220px]">
                      {fileName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Premium message bubble */}
        <div
          className={`relative p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${
            isUser
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white ml-8 border border-white/10"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 mr-8 border border-gray-100 dark:border-gray-700 shadow-sm"
          } group-hover:scale-[1.01] transform`}
        >
          {/* Subtle overlay for AI messages */}
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-transparent dark:from-violet-900/10 rounded-3xl pointer-events-none"></div>
          )}

          {/* Content */}
          <div className="relative font-medium leading-relaxed text-[15px]">
            {formatContent(displayedContent)}
          </div>

          {/* Enhanced message bubble tail */}
          <div
            className={`absolute top-5 w-4 h-4 ${
              isUser
                ? ""
                : "-left-2 bg-white dark:bg-gray-800 transform rotate-45 border-l border-b border-gray-100 dark:border-gray-700"
            }`}
          ></div>
        </div>

        {/* Enhanced timestamp */}
        <div
          className={`text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {isComplete && (
              <div
                className={`text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium ${
                  isUser ? "text-right" : "text-left"
                }`}
              >
                <MessageTime createdAt={message.createdAt} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
