import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./MessagesSkeleton";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formateTime } from "../lib/utils";
import { axiosInstance } from "../lib/axios";

const ChatContainer = () => {
  const {
    messages,
    isMessagesLoading,
    getMessages,
    selectedChat,
    subscribeToMessages,
    unSubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const localStorageUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(localStorageUser);

        const res = await axiosInstance.get(`users/${authUser._id}`, {
          headers: {
            Authorization: `Bearer ${parsedUser.token}`,
          },
        });

        console.log(res.data);

        setUserData(res.data.data);
      } catch (error) {
        console.log("Error fetching user Data", error);
      }
    };

    getUserData();
  }, [authUser?._id]);

  useEffect(() => {
    if (selectedChat?._id) {
      getMessages(selectedChat._id);
      subscribeToMessages();
    }

    return () => {
      unSubscribeToMessages();
    };
  }, [
    getMessages,
    selectedChat?._id,
    subscribeToMessages,
    unSubscribeToMessages,
  ]);

  useEffect(() => {
    if (messages && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-auto flex-1 text-base-content">
      <ChatHeader />
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.sender === authUser._id;
          const profilePic = isSender
            ? userData.profilePicture || "/images/avatar-icon.png"
            : selectedChat.profilePicture || "/images/avatar-icon.png";

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={profilePic} alt="Profile" />
                </div>
              </div>
              <div className="mb-1 chat-header">
                <time className="text-xs opacity-50 ml-1">
                  {formateTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`chat-bubble flex flex-col items-start ${
                  isSender ? "chat-bubble-primary" : ""
                }`}
              >
                {message.media && (
                  <img
                    src={message.media}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
        {/* Scroll to last message */}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
