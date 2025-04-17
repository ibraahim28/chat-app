import { create } from "zustand";
import { axiosInstance, BASE_URL } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("No user found in localStorage");

      const decodedUser = JSON.parse(user);
      if (!decodedUser.token) throw new Error("Invalid user token");

      const res = await axiosInstance.get("/auth/check", {
        headers: { Authorization: `Bearer ${decodedUser.token}` },
      });

      set({ authUser: res.data }, false); // Second argument prevents re-render issues
      console.log("Auth check successful, user:", res.data);

      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("Error in checking Auth:", error?.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Account created successfully");
    } catch (error) {
      console.log("error in signup", error?.message);
      toast.error(error?.message || "Error in Signing up");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      const user = res.data;

      set({ authUser: user });
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Signed in successfully");

      get().connectSocket();
    } catch (error) {
      console.log("error in signin", error?.message);
      toast.error(error?.message || "Error in Signing in");
    } finally {
      set({ isSigningIn: false });
    }
  },

  logoutUser: async () => {
    try {
      localStorage.clear();
      set({ authUser: null });
      toast.success("Logged out!");

      get().disconnectSocket();
    } catch (error) {
      console.log("error in Logout", error?.message);
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const localStorageUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(localStorageUser);

      const res = await axiosInstance.put("/users/update", data, {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
