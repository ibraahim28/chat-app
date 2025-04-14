import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useAuthStore } from "./store/useAuthStore";
import {Loader} from 'lucide-react'
import AppLayout from "./layouts/AppLayout";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);


  useEffect(() => {
    console.log("AuthUser updated:", authUser);
  console.log("onlineUsers", onlineUsers);

  }, [authUser, onlineUsers]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div data-theme={theme}>
      <Routes>
      <Route path="/" element={authUser ? <AppLayout Children={<Home />} /> : <Navigate to="/signin" />} />
        <Route path="settings" element={ authUser ?  <AppLayout Children={<Settings />} />  : <Navigate to={"/signin"} />} />
        <Route path="profile" element={ authUser ?  <AppLayout Children={<Profile />} />  : <Navigate to={"/signin"} />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path="/signin" element={!authUser ? <SignIn /> : <Navigate to={"/"}/> } />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;