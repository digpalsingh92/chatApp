"use client";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
const ChatsPage = () => {
  const router = useRouter();
  return (
    <Box
      bg="white"
      w="100%"
      h="100vh"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Flex
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="2xl" fontWeight="bold">
          Chats
        </Text>

        <Flex maxW="400px" w="100%" gap={2}>
          <Input placeholder="Search chats..." />
          <Button colorScheme="teal">Search</Button>
        </Flex>

        <Avatar.Root shape="full" size="lg" onClick={() => router.push("/my-profile")}>
          <Avatar.Fallback name="Random User" />
          <Avatar.Image src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" />
        </Avatar.Root>
      </Flex>

      <Grid h="calc(100vh - 80px)" templateColumns="300px 1fr">
        <GridItem borderRight="1px solid" borderColor="gray.200">
          <Box p={4}>
            <Text fontWeight="bold" mb={3}>
              Conversations
            </Text>

            {["User A", "User B", "User C"].map((user) => (
              <Flex
                key={user}
                p={3}
                mb={2}
                alignItems="center"
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
              >
                <Avatar.Root shape="full" size="sm">
                  <Avatar.Fallback name="Random User" />
                  <Avatar.Image src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" />
                </Avatar.Root>
                <Text>{user}</Text>
              </Flex>
            ))}
          </Box>
        </GridItem>

        <GridItem>
          <Flex direction="column" h="100%">
            <Box p={4} borderBottom="1px solid" borderColor="gray.200">
              <Text fontWeight="bold">User A</Text>
            </Box>

            <Box flex="1" p={4} overflowY="auto">
              <Box mb={3}>
                <Text fontSize="sm" color="gray.600">
                  User A
                </Text>
                <Box bg="gray.100" p={3} borderRadius="md">
                  Hello 👋
                </Box>
              </Box>

              <Box mb={3} textAlign="right">
                <Text fontSize="sm" color="gray.600">
                  You
                </Text>
                <Box
                  bg="teal.500"
                  color="white"
                  p={3}
                  borderRadius="md"
                  display="inline-block"
                >
                  Hi! How are you?
                </Box>
              </Box>
            </Box>

            <Flex p={4} gap={2} borderTop="1px solid" borderColor="gray.200">
              <Input placeholder="Type a message..." />
              <Button colorScheme="teal">Send</Button>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ChatsPage;
