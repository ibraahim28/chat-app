import React from "react";
import { useChatStore } from "../store/useChatStore";
import { Menu, Search, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedChat, isSideMenuOpen, setSideMenu } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="py-4 px-4 flex items-center justify-between border-b-2 border-base-300">
      <div className="flex flex-col items-start ">
        <h1 className="font-semibold  text-4xl text-base-content ">
          {selectedChat && selectedChat?.username}
        </h1>
        {/* apply logic for online and last seen later */}
        <p className="mt-1 text-xs text-base-content/70">
          {onlineUsers.includes(selectedChat._id) ? "Online" : "Offline"}
        </p>
      </div>
      <div className="flex gap-6">
        <button className="hover:cursor-pointer hover:text-accent">
          <Search size={18} />
        </button>
        <button
          className="hover:cursor-pointer hover:text-accent"
          onClick={() => {
            setSideMenu(isSideMenuOpen);
          }}
        >
          {isSideMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
