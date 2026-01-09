"use client";
import { Box, Flex, Text } from "@chakra-ui/react";

const SingleChat = ({ messages, currentUserId, emptyStateText }) => {
  if (!messages || messages.length === 0) {
    return (
      <Flex h="100%" align="center" justify="center">
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {emptyStateText || "No messages in this chat yet."}
        </Text>
      </Flex>
    );
  }

  return (
    <Box>
      {messages.map((message) => {
        const isOwn = message.senderId === currentUserId;

        return (
          <Box key={message.id} mb={3} textAlign={isOwn ? "right" : "left"}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              {isOwn ? "You" : message.senderName}
            </Text>
            <Box
              display="inline-block"
              maxW="80%"
              bg={isOwn ? "teal.500" : "gray.100"}
              color={isOwn ? "white" : "gray.800"}
              px={3}
              py={2}
              borderRadius="lg"
              borderBottomRightRadius={isOwn ? "sm" : "lg"}
              borderBottomLeftRadius={isOwn ? "lg" : "sm"}
              boxShadow="sm"
            >
              <Text fontSize="sm">{message.content}</Text>
              {message.createdAt && (
                <Text
                  fontSize="xs"
                  color={isOwn ? "teal.100" : "gray.500"}
                  mt={1}
                >
                  {message.createdAt}
                </Text>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default SingleChat;

