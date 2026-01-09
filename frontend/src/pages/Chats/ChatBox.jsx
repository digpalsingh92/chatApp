"use client";
import { Box, Flex, Text, Input, Button, Avatar, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getToken } from "@/utils/helper";
import SingleChat from "./SingleChat";
import { LuLoader, LuSend } from "react-icons/lu";
import {
  setMessages,
  setMessagesLoading,
  addMessage,
  setSelectedChat,
} from "@/redux/slices/chatSlice";

const ChatBox = ({ activeChat, selectedChat }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const { messages, messagesLoading } = useSelector((state) => state.chat);
  const { userDetails } = useSelector((state) => state.auth);

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
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/chat/${activeChat.id}/messages`,
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
      <Flex h="100%" align="center" justify="center" bg="white">
        <Text color="gray.500">Select a conversation to start chatting.</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100%" bg="white">
      <Flex
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        alignItems="center"
        gap={3}
      >
        <Avatar.Root size="sm">
          <Avatar.Fallback name={activeChat.name} />
          <Avatar.Image src={activeChat.avatar} />
        </Avatar.Root>
        <Box>
          <Text fontWeight="bold">{activeChat.name}</Text>
          <Text fontSize="xs" color="green.500">
            Online
          </Text>
        </Box>
      </Flex>

      <Box flex="1" p={4} overflowY="auto" bg="gray.50">
        {messagesLoading ? (
          <Flex h="100%" align="center" justify="center">
            <Spinner size="md" color="teal.500" />
          </Flex>
        ) : (
          <SingleChat
            messages={messages}
            currentUserId={userDetails?._id}
            emptyStateText="Say hi to start the conversation."
          />
        )}
      </Box>

      <Flex
        p={3}
        gap={2}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="white"
      >
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
        />
        <Button
          backgroundColor="teal.600"
          color="white"
          px={3}
          py={2}
          onClick={handleSend}
          disabled={!message.trim() || sending}
          isLoading={sending}
        >
          Send
          <span className="ml-2">
            {sending ? <LuLoader size={20} /> : <LuSend size={20} />}
          </span>
        </Button>
      </Flex>
    </Flex>
  );
};

export default ChatBox;


