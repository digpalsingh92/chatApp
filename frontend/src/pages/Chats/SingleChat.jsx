"use client";
import { useEffect, useRef } from "react";

const SingleChat = ({ messages, currentUserId, emptyStateText }) => {
  const bottomRef = useRef(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500 text-center">
          {emptyStateText || "No messages in this chat yet."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full overflow-y-auto overflow-x-hidden px-4 py-2"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
      {messages.map((message) => {
        const isOwn = message.senderId === currentUserId;

        return (
          <div key={message.id} className="mb-3" style={{ textAlign: isOwn ? "right" : "left" }}>
            <p className="text-xs text-gray-500 mb-1">
              {isOwn ? "You" : message.senderName}
            </p>

            <div
              className={`inline-block max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
                isOwn
                  ? "bg-teal-500 text-white rounded-br-sm rounded-bl-lg"
                  : "bg-gray-100 text-gray-800 rounded-br-lg rounded-bl-sm"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.createdAt && (
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? "text-teal-100" : "text-gray-500"
                  }`}
                >
                  {message.createdAt}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default SingleChat;
