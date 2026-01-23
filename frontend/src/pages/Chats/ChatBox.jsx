"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getToken } from "@/utils/helper";
import SingleChat from "./SingleChat";
import { LuLoader, LuSend } from "react-icons/lu";
import { io } from "socket.io-client";
import {
  setMessages,
  setMessagesLoading,
  addMessage,
  setSelectedChat,
} from "@/redux/slices/chatSlice";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ENDPOINT = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:4000";

const ChatBox = ({ activeChat, selectedChat }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, messagesLoading } = useSelector((state) => state.chat);
  const { userDetails } = useSelector((state) => state.auth);
  const currentUserId = userDetails?._id || userDetails?.id;

  // Keep ref updated with current chat ID
  useEffect(() => {
    activeChatIdRef.current = activeChat?.id;
  }, [activeChat?.id]);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId) return;

    // Initialize socket if not already connected
    if (!socketRef.current) {
      socketRef.current = io(ENDPOINT, {
        transports: ["websocket", "polling"],
      });

      const socket = socketRef.current;

      // Connection event handlers
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        // Setup user after connection
        if (currentUserId) {
          socket.emit("setup", currentUserId);
        }
      });

      socket.on("connected", () => {
        console.log("Socket setup complete for user:", currentUserId);
        // Join current chat if one is active
        if (activeChat?.id) {
          console.log("Joining chat room after connection:", activeChat.id);
          socket.emit("join chat", activeChat.id);
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Listen for new messages (set up once)
      socket.on("message received", (newMessage) => {
        console.log("Message received via socket:", newMessage);
        
        // Transform message to frontend format
        const transformedMessage = {
          id: newMessage._id,
          senderId: newMessage.sender._id,
          senderName: newMessage.sender.name,
          content: newMessage.content,
          createdAt: new Date(newMessage.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // Get chat ID - handle both populated object and string ID
        const chatId = newMessage.chat?._id || newMessage.chat;
        const currentChatId = activeChatIdRef.current;
        
        console.log("Comparing chat IDs - received:", chatId, "current:", currentChatId);
        
        // Only add if it's for the current chat (use ref to get latest value)
        if (String(chatId) === String(currentChatId)) {
          console.log("Adding message to Redux");
          dispatch(addMessage(transformedMessage));
        } else {
          console.log("Message is for a different chat, ignoring");
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("message received");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUserId, dispatch]);

  // Separate effect to handle joining/leaving chat rooms when activeChat changes
  useEffect(() => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.log("Socket not connected, cannot join chat room");
      return;
    }

    if (!activeChat?.id) {
      return;
    }

    console.log("Joining chat room:", activeChat.id);
    socketRef.current.emit("join chat", activeChat.id);

    // Cleanup: leave chat room when activeChat changes or component unmounts
    return () => {
      if (socketRef.current && socketRef.current.connected && activeChat?.id) {
        console.log("Leaving chat room:", activeChat.id);
        socketRef.current.emit("leave chat", activeChat.id);
      }
    };
  }, [activeChat?.id]);


  // Fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat?.id) {
      dispatch(setMessages([]));
      return;
    }

    const fetchMessages = async () => {
      try {
        dispatch(setMessagesLoading(true));
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/message/${activeChat.id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        // Transform messages to frontend format
        const transformedMessages = res.data.map((msg) => ({
          id: msg._id,
          senderId: msg.sender._id,
          senderName: msg.sender.name,
          content: msg.content,
          createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        dispatch(setMessages(transformedMessages));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        dispatch(setMessages([]));
      } finally {
        dispatch(setMessagesLoading(false));
      }
    };

    fetchMessages();
  }, [activeChat?.id, dispatch]);

  const handleSend = async () => {
    if (!message.trim() || !activeChat?.id) return;

    const messageContent = message.trim();
    setMessage("");
    setSending(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/message`,
        {
          content: messageContent,
          chatId: activeChat.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Add the new message to Redux
      const newMessage = {
        id: res.data._id,
        senderId: res.data.sender._id,
        senderName: res.data.sender.name,
        content: res.data.content,
        createdAt: new Date(res.data.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      dispatch(addMessage(newMessage));

      // Emit message via socket for real-time delivery
      if (socketRef.current && socketRef.current.connected && res.data) {
        console.log("Emitting new message via socket:", res.data);
        socketRef.current.emit("new message", res.data);
      } else {
        console.warn("Socket not connected, message sent but not broadcasted");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore message on error
      setMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-gray-500">Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="flex p-4 border-b border-gray-200 items-center gap-3 shrink-0">
        <Avatar
          size="sm"
          src={activeChat.avatar}
          alt={activeChat.name}
          className="shrink-0"
        />
        <div>
          <p className="font-bold">{activeChat.name}</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 overflow-hidden min-h-0">
        {messagesLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <SingleChat
              messages={messages}
              currentUserId={userDetails?._id || userDetails?.id}
              emptyStateText="Say hi to start the conversation."
            />
          </div>
        )}
      </div>

      <div className="flex p-3 gap-2 border-t border-gray-200 bg-white shrink-0">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="px-3 py-2"
        >
          {sending ? <LuLoader size={20} className="animate-spin" /> : <LuSend size={20} />}
          <span className="ml-2">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
