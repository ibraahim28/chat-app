import React from 'react'
import ChatSidebar from '../components/ChatSidebar'
import ChatContainer from '../components/ChatContainer'
import { useChatStore } from '../store/useChatStore'
import NoChatSelected from '../components/NoChatSelected'
import ChatSideMenu from '../components/ChatSideMenu'

const Home = () => {
  const {selectedChat, isSideMenuOpen} = useChatStore()
  console.log("Home is rendering=======================")
  return (
    <div className='flex h-screen bg-base-200'>
      <ChatSidebar />
      
      {!selectedChat ? <NoChatSelected /> : <ChatContainer />}

     {isSideMenuOpen ? <ChatSideMenu /> : '' }
    </div>
  )
}

export default Home
