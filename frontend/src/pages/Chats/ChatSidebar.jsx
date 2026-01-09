"use client";
import { Box, Flex, Text, Avatar, Badge } from "@chakra-ui/react";

const ChatSidebar = ({ conversations, activeChatId, onSelectChat }) => {
  return (
    <Box p={4} h="100%" overflowY="auto">
      <Text fontWeight="bold" mb={3} fontSize="lg">
        Conversations
      </Text>

      {conversations?.length === 0 && (
        <Text fontSize="sm" color="gray.500">
          No conversations yet. Start a new chat from the search above.
        </Text>
      )}

      {conversations?.map((conversation) => {
        const isActive = conversation.id === activeChatId;

        return (
          <Flex
            key={conversation.id}
            p={3}
            mb={2}
            alignItems="center"
            borderRadius="md"
            cursor="pointer"
            bg={isActive ? "teal.50" : "transparent"}
            borderWidth={isActive ? "1px" : "0"}
            borderColor={isActive ? "teal.200" : "transparent"}
            _hover={{ bg: isActive ? "teal.100" : "gray.100" }}
            gap={3}
            onClick={() => onSelectChat(conversation.id)}
          >
            <Avatar.Root
                size="sm"
                flexShrink={0}
              >
                <Avatar.Fallback name={conversation.name} />
                <Avatar.Image src={conversation.avatar} />
              </Avatar.Root>
            <Box flex="1" minW={0}>
              <Flex justify="space-between" align="center" mb={1}>
                <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                  {conversation.name}
                </Text>
                {conversation.unreadCount ? (
                  <Badge colorScheme="teal" borderRadius="full" fontSize="0.7rem">
                    {conversation.unreadCount}
                  </Badge>
                ) : null}
              </Flex>
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {conversation.lastMessage || "No messages yet"}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
};

export default ChatSidebar;


