"use client";

import {
  Button,
  Popover,
  Portal,
  Input,
  Flex,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/utils/helper";
import { LuSearch } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import UserListItem from "../Users/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, clearLoading, setSelectedChat } from "@/redux/slices/chatSlice";


const SearchUser = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chat.loading);

  const handleClose = () => {
    dispatch(clearLoading());
    setUsers([]);
    setSearch("");
    setIsOpen(false);
  }; 

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Enter something to search",
        type: "warning",
        duration: 4000,
        closable: true,
      });
      setSearch("");
      return;
    }

    dispatch(setLoading());
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      dispatch(clearLoading());
    }
  };



  const accessChat = async (userId) => {
    dispatch(setLoading());
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEB_URL}/api/chat`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      dispatch(setSelectedChat(res.data));
      dispatch(clearLoading());
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
    }
  }, [search]);

  return (
    <Popover.Root 
      open={isOpen} 
      onOpenChange={(e) => setIsOpen(e.open)}
      positioning={{ offset: { mainAxis: 8 } }}
    >
      <Popover.Trigger asChild>
        <div className="cursor-pointer px-[10px] py-[10px] bg-gray-200 rounded-md">
       <LuSearch size={20} color="gray.700" />
        </div>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w="320px"
            bg="#d9d9d9"           
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            boxShadow="lg"
          >
            <Popover.Body>
              <Flex direction="column" gap={3}>
                <Text fontWeight="medium" color="gray.700">
                  Search Users
                </Text>

                <Input
                  size="sm"
                  placeholder="Search by name or email"
                  bg="white"
                  borderColor="#ffffff"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={handleSearch}
                  isLoading={loading}
                >
                  Search User
                </Button>

                <Box maxH="200px" overflowY="auto">
                  {loading ? (
                    <Flex justify="center" py={4}>
                      <Spinner size="sm" />
                    </Flex>
                  ) : users.length ? (
                    users.map((user) => (
                      <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                    ))
                  ) : (
                    search && (
                      <Text fontSize="sm" color="gray.600" mt={2}>
                        No users found
                      </Text>
                    )
                  )}
                </Box>
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default SearchUser;
