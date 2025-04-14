import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./MessagesSkeleton";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formateTime } from "../lib/utils";

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
  useEffect(() => {
    getMessages(selectedChat._id);

    subscribeToMessages();

    return () => {
      unSubscribeToMessages();
    };
  }, [
    getMessages,
    selectedChat._id,
    subscribeToMessages,
    unSubscribeToMessages,
  ]);

  useEffect(() => {
    if (messages && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  isMessagesLoading ?? (
    <div className="flex items-center justify-center h-screen">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-auto flex-1 text-base-content ">
      <ChatHeader />
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.sender.toString() === authUser._id.toString()
                ? "chat-end"
                : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender.toString() === authUser._id.toString()
                      ? authUser.profilePicture || "/images/avatar-icon.png"
                      : selectedChat.profilePicture || "/images/avatar-icon.png"
                  }
                  alt="Profile"
                />
              </div>
            </div>
            <div className="mb-1 chat-header">
              <time className="text-xs opacity-50 ml-1">
                {formateTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col items-start ${message.sender.toString() === authUser._id.toString() ? 'chat-bubble-primary' : '' }`}>
              {message.media && (
                <img
                  src={message.media}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className="">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
