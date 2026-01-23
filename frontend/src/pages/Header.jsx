"use client";
import React from "react";
import SearchUser from "@/components/search/SearchUser";
import { useRouter } from "next/navigation";
import { removeToken } from "@/utils/helper";
import Link from "next/link";
import { LuBell } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white w-full p-4 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex">
          <SearchUser />
        </div>

        <h2 className="text-2xl font-bold">
          <Link href="/">Chats</Link>
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-[15px] cursor-pointer">
              <LuBell
                size={40}
                className="text-red-500 rounded-md p-2"
              />
              <Avatar
                size="md"
                src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                alt="Random User"
                className="cursor-pointer"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push("/my-profile")}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                removeToken();
                router.push("/");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
