import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedChat: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSideMenuOpen: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const user = localStorage.getItem("user");

      const parsedUser = user ? JSON.parse(user) : null;
      const res = await axiosInstance.get("users/fetch", {
        headers: { Authorization: `Bearer ${parsedUser?.token}` },
      });
      if (res.data.success) {
        const filteredUsers = res.data.data.filter(
          (u) => u._id !== parsedUser?.data?._id
        );
        set({ users: filteredUsers });
      } else {
        set({ users: [] });
      }

      console.log("Users====================", res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      console.log("getUserserror===================", error);
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      const res = await axiosInstance.get(`messages/fetch/${userId}`, {
        headers: { Authorization: `Bearer ${parsedUser?.token}` },
      });
      if (res.data.success) {
        set({ messages: res.data.data });
      } else {
        set({ messages: [] });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      set({ messages: [] });
      console.log("getMessagesError=================", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedChat, messages } = get();
    try {
      console.log("sendMessageData===================", messageData);
      const user = localStorage.getItem("user");

      const parsedUser = user ? JSON.parse(user) : null;
      const res = await axiosInstance.post(
        `messages/send/${selectedChat._id}`,
        messageData,
        {
          headers: { Authorization: `Bearer ${parsedUser?.token}` },
        }
      );
      console.log(res.data);
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      console.log("sendMessageError--------------------", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedChat } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedChat || !socket) return;

    socket.on("newMessage", ({ newMessage }) => {
      if (newMessage.senderId !== selectedChat._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedChat: (user) => {
    set({ selectedChat: user });
  },

  setSideMenu: (isSideMenuOpen) => {
    set({ isSideMenuOpen: !isSideMenuOpen });
  },
}));
