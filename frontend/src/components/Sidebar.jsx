import {
  BotMessageSquare,
  LogOut,
  MessagesSquare,
  Settings,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Sidebar = () => {
  const { logoutUser, authUser } = useAuthStore();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localStorageUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(localStorageUser);

        const res = await axiosInstance.get(`users/${authUser._id}`, {
          headers: {
            Authorization: `Bearer ${parsedUser.token}`,
          },
        });

        const userData = res.data.data;

        setUser(userData);

        console.log(userData);
      } catch (error) {
        console.error("Error fetching join date", error);
      }
    };
    fetchUser();

  }, [authUser._id]);

  const navLinkStyle = ({ isActive }) =>
    `flex flex-col justify-center items-center gap-2 font-semibold text-xs group transition-colors ${
      isActive
        ? "text-base-content"
        : "text-base-content/50 hover:text-base-content"
    }`;

  const iconStyle = (isActive) =>
    `transition-colors duration-200 ${
      isActive ? "text-base-content" : "text-base-content/50"
    } group-hover:text-base-content`;

  return (
    <div className="bg-base-100 border-r-2 border-base-300 h-screen w-24 flex flex-col justify-between items-center px-2 py-4 text-accent-content">
      {/* Top: Avatar + Nav */}
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-center items-center">
          <img
            src={user.profilePicture || "/images/avatar-icon.png"}
            alt="user-logo"
            className="w-12 rounded-full"
          />
        </div>

        <nav>
          <ul className="flex flex-col justify-center items-center py-4 gap-6">
            <NavLink to="/" className={navLinkStyle}>
              {({ isActive }) => (
                <>
                  <MessagesSquare size={22} className={iconStyle(isActive)} />
                  <span>All Chats</span>
                </>
              )}
            </NavLink>

            <NavLink to="/profile" className={navLinkStyle}>
              {({ isActive }) => (
                <>
                  <User size={22} className={iconStyle(isActive)} />
                  <span>Profile</span>
                </>
              )}
            </NavLink>

            <NavLink to="/settings" className={navLinkStyle}>
              {({ isActive }) => (
                <>
                  <Settings size={22} className={iconStyle(isActive)} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </ul>
        </nav>
      </div>

      {/* Bottom: AI + Logout */}
      <div className="border-t-2 border-accent pt-4 w-full">
        <nav>
          <ul className="w-full  flex flex-col gap-6 items-center">
            <NavLink to="/ai" className={navLinkStyle}>
              {({ isActive }) => (
                <>
                  <BotMessageSquare size={22} className={iconStyle(isActive)} />
                  <span>AI</span>
                </>
              )}
            </NavLink>

            <li
              onClick={logoutUser}
              className="flex flex-col justify-center items-center gap-2 font-semibold text-base-content/50 hover:text-base-content cursor-pointer text-xs transition-colors"
            >
              <LogOut
                size={22}
                className="text-base-content/70 group-hover:text-base-content "
              />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
