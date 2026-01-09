"use client";
import React from 'react'
import SearchUser from '@/components/search/SearchUser'
import { Flex, Text, Avatar, Box, Menu, Button, Portal } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { removeToken } from '@/utils/helper';
import Link from 'next/link';
import { LuBell } from 'react-icons/lu';


const Header = () => {
  const router = useRouter();
  return (
  <div>
  <Box bg="white" w="100%" p={4} borderColor="gray.200" borderWidth="1px" justifyContent="space-between" alignItems="center">
    <Flex alignItems="center" justifyContent="space-between" gap={4} flexWrap="wrap">

    <Flex>
      <SearchUser />
    </Flex>

    <Text fontSize="2xl" fontWeight="bold">
      <Link href="/">Chats</Link>
    </Text>

    <Menu.Root>
      <Menu.Trigger asChild>
        <div className="flex items-center gap-[15px]">
          <LuBell size={20} className="cursor-pointer text-red-500 rounded-md p-2" />
        <Avatar.Root size="md" name="Random User" src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" cursor="pointer" >
          <Avatar.Fallback name="Random User" />
          <Avatar.Image src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" />
        </Avatar.Root>
        </div>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="my-profile" onClick={() => router.push("/my-profile")}>My Profile</Menu.Item>
            <Menu.Item value="logout" onClick={() => {
              removeToken();
              router.push("/");
            }}>Logout</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  </Flex>
</Box>
  </div>
);
};

export default Header;