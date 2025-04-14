import React from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatListItem = ({ user }) => {

  const { _id, username, lastMessage } = user;

  const {setSelectedChat, selectedChat} = useChatStore();
  const {onlineUsers} = useAuthStore();

  return (
    <div
      onClick={() => setSelectedChat(user)}
      className={`flex px-2 py-4 gap-4 items-center border-b-2 border-base-300 cursor-pointer 
        ${selectedChat === user ? "bg-base-300 ring-1 ring-base-300" : "hover:bg-base-200"}`}
    >
      {/* Profile Image */}
      <div className="relative">
        <img src={user.profilePicture || "/images/Untitled.jpg"} alt="User Profile" className="size-10 rounded-full" />
        {onlineUsers.includes(user._id?.toString()) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />)}
      </div>

      {/* Chat Info */}
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="text-md font-semibold">{username}</h2>
        <p className="text-xs text-base-content/60">{lastMessage}</p>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-base-content/50 font-thin">12:02</div>
    </div>
  );
};

export default ChatListItem;
