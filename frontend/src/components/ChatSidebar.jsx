import { Loader, Search } from "lucide-react";
import React, { useEffect } from "react";
import ChatListItem from "./ChatListItem";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatSidebar = () => {
  const { users, isUsersLoading, getUsers, searchText, setSearchText, setFilterOnlineOnly, filterOnlineOnly } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  // const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const isOnline = !filterOnlineOnly || onlineUsers.includes(user._id);
    const matchesSearch =
      !searchText ||
      user.username.toLowerCase().includes(searchText.toLowerCase());
    return isOnline && matchesSearch;
  });


  return (
    <div className="bg-base-100 text-base-content w-1/4 h-screen border-r-2 border-base-300 flex flex-col overflow-y-auto">
      <div className="px-2 py-6 flex items-center relative border-b-2 border-base-300">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchText(e.target.value)}
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
            checked={filterOnlineOnly}
            onChange={() => setFilterOnlineOnly()}
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
          {filteredUsers.length === 0 ? (
            searchText ? (
              <div className="p-4 text-center text-base-content/60">
                No users found
              </div>
            ) : filterOnlineOnly ? (
              <div className="p-4 text-center text-base-content/60">
                No users online
              </div>
            ) : (
              <div className="p-4 text-center text-base-content/60">
                No users available
              </div>
            )
          ) : (
            filteredUsers.map((user) => (
              <ChatListItem key={user._id} user={user} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
