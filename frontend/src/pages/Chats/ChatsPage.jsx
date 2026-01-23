"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getToken } from "@/utils/helper";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";
import Header from "@/pages/Header";
import {
  setChats,
  setSelectedChat,
  setLoading,
  clearLoading,
  setError,
} from "@/redux/slices/chatSlice";
import { Spinner } from "@/components/ui/spinner";

const ChatsPage = () => {
  const dispatch = useDispatch();
  const { chats, loading, selectedChat } = useSelector((state) => state.chat);
  const { userDetails } = useSelector((state) => state.auth);
  const [activeChatId, setActiveChatId] = useState(null);
  const [originalChats, setOriginalChats] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user if not in Redux
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (userDetails?.id || userDetails?._id) {
        setCurrentUserId(String(userDetails.id || userDetails._id));
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (res.data.user?.id || res.data.user?._id) {
          setCurrentUserId(String(res.data.user.id || res.data.user._id));
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, [userDetails]);

  const transformChat = (chat) => {
    if (!chat || !currentUserId) return null;

    // Get the other user (not the current user) for one-on-one chat
    const otherUser =
      chat.users?.find((user) => String(user._id) !== String(currentUserId)) ||
      chat.users?.[0];

    if (!otherUser) return null;

    return {
      id: chat._id,
      name: otherUser?.name,
      avatar: otherUser?.pic,
      lastMessage: chat.latestMessage?.content || "No messages yet",
      users: chat.users,
      latestMessage: chat.latestMessage,
    };
  };

  // Fetch all chats for the user
  useEffect(() => {
    if (!currentUserId) return;

    const fetchChats = async () => {
      try {
        dispatch(setLoading());
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/chat`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        setOriginalChats(res.data);

        const transformedChats = res.data
          .map(transformChat)
          .filter((chat) => chat !== null);

        dispatch(setChats(transformedChats));

        if (transformedChats.length > 0 && !activeChatId) {
          setActiveChatId(transformedChats[0].id);
          dispatch(setSelectedChat(res.data[0]));
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        dispatch(
          setError(error.response?.data?.message || "Failed to fetch chats")
        );
      } finally {
        dispatch(clearLoading());
      }
    };

    fetchChats();
  }, [dispatch, currentUserId]);

  // Handle chat selection
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    // Find and set the original backend chat data
    const originalChat = originalChats.find((c) => c._id === chatId);
    if (originalChat) {
      dispatch(setSelectedChat(originalChat));
    }
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  if (loading && chats.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Header at the top */}
      <Header />

      {/* Main content area: Sidebar on left, ChatBox on right */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar on the left */}
        <div className="w-[250px] shrink-0 border-r border-gray-200 bg-gray-50 overflow-hidden">
          <ChatSidebar
            conversations={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* ChatBox on the right */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <ChatBox activeChat={activeChat} selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
