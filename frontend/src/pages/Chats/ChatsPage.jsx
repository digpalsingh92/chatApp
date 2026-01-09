"use client";
import { useState, useEffect } from "react";
import { Box, Grid, GridItem, Spinner, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getToken } from "@/utils/helper";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";
import { setChats, setSelectedChat, setLoading, clearLoading, setError } from "@/redux/slices/chatSlice";

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

  // Transform backend chat data to frontend format
  const transformChat = (chat) => {
    if (!chat || !currentUserId) return null;

    const otherUser = chat.users?.find(
      (user) => String(user._id) !== String(currentUserId)
    ) || chat.users?.[0];

    if (!otherUser) return null;

    return {
      id: chat._id,
      name: chat.isGroupChat ? chat.chatName : otherUser?.name || "Unknown",
      avatar: chat.isGroupChat
        ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        : otherUser?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
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
        dispatch(setError(error.response?.data?.message || "Failed to fetch chats"));
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
      <Flex h="100vh" align="center" justify="center" bg="white">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box
      bg="white"
      w="100%"
      h={{ base: "100%", md: "100vh" }}
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      <Grid
        h={{ base: "calc(100vh - 88px)", md: "calc(100vh - 80px)" }}
        templateColumns={{ base: "1fr", md: "320px 1fr" }}
      >
        <GridItem
          borderRight={{ base: "none", md: "1px solid" }}
          borderBottom={{ base: "1px solid", md: "none" }}
          borderColor="gray.200"
          bg="gray.50"
        >
          <ChatSidebar
            conversations={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
          />
        </GridItem>

        <GridItem>
          <ChatBox activeChat={activeChat} selectedChat={selectedChat} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ChatsPage;
