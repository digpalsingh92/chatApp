"use client";
import { Avatar } from "@/components/ui/avatar";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-[#E8E8E8] hover:bg-teal-500 hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg transition-colors"
    >
      <Avatar
        size="sm"
        src={user.pic}
        alt={user.name}
        className="mr-2 shrink-0"
      />
      <div>
        <p>{user.name}</p>
        <p className="text-xs">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
