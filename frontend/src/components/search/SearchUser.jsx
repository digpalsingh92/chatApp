"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/utils/helper";
import { LuSearch } from "react-icons/lu";
import { toaster } from "@/components/ui/toast";
import UserListItem from "../Users/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, clearLoading, setSelectedChat } from "@/redux/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer px-[10px] py-[10px] bg-gray-200 rounded-md">
          <LuSearch size={20} color="gray.700" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-3">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-700">Search Users</p>

          <div className="p-2">
            <Input
              placeholder="Search by name or email"
              className="bg-white border-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            size="sm"
            className="bg-teal-200 hover:bg-teal-300 p-2 w-[40%]"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Search User"}
          </Button>

          <div className="max-h-[200px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            ) : users.length ? (
              users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              search && (
                <p className="text-sm text-gray-600 mt-2">No users found</p>
              )
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchUser;
