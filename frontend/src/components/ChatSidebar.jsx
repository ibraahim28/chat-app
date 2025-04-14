import { Loader, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChatListItem from "./ChatListItem";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatSidebar = () => {
  const { users, isUsersLoading, getUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  console.log(filteredUsers);

  return (
    <div className="bg-base-100 text-base-content w-1/4 h-screen border-r-2 border-base-300 flex flex-col overflow-y-auto">
      <div className="px-2 py-6 flex items-center relative border-b-2 border-base-300">
        <input
          type="text"
          placeholder="Search..."
          className="relative w-full p-2 border border-accent-content rounded-xl bg-base-300"
        />
        <div className="absolute right-8">
          <Search
            size={22}
            className="text-base-content/70 hover:text-accent hover:cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-2 px-3 pb-2 border-b-2 border-base-300">
        <label className="flex items-center gap-2 text-sm text-base-content/80">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={() => setShowOnlineOnly((prev) => !prev)}
            className="checkbox checkbox-sm checkbox-accent"
          />
          Show Online Only
        </label>
      </div>

      {isUsersLoading || !users ? (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin z-10" />
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredUsers.length === 0 && setShowOnlineOnly
            ? "No users Online"
            : filteredUsers.length === 0 && !setShowOnlineOnly
            ? "No users available"
            : filteredUsers.map((user) => (
                <ChatListItem key={user._id} user={user} />
              ))}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
