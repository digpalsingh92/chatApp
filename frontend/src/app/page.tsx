"use client";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

export default function Home() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="white"
      >
        <Text fontSize="4xl" alignItems={"center"} color="black">
          Chat
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderColor={"white"}
        borderWidth="1px"
      >
        <Tabs.Root
          defaultValue="login"
          variant="plain"
          css={{
            "--tabs-indicator-bg": "colors.teal.50",
            "--tabs-indicator-shadow": "shadows.sm",
            "--tabs-trigger-radius": "radii.full",
          }}
        >
          <Tabs.List
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Tabs.Trigger
              width={"50%"}
              value="login"
              textAlign="center"
              justifyContent="center"
              color={"black"}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              width={"50%"}
              value="signup"
              textAlign="center"
              justifyContent="center"
              color={"black"}
            >
              Signup
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="login">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="signup">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
}
