import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:4000";

export const useSocket = (userId, chatId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    socketRef.current = io(ENDPOINT, {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    // Setup user
    socket.emit("setup", userId);

    // Join chat room if chatId is provided
    if (chatId) {
      socket.emit("join chat", chatId);
    }

    // Cleanup on unmount
    return () => {
      if (chatId) {
        socket.emit("leave chat", chatId);
      }
      socket.disconnect();
    };
  }, [userId, chatId]);

  return socketRef.current;
};
