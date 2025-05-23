import React from 'react'
import Sidebar from '../components/Sidebar'
const AppLayout = ({Children}) => {
  return (
    <div className='flex w-screen'>
    <aside className='w-24 '>
    <Sidebar />
    </aside>
    <main className='flex-1'>
        {Children}
    </main>
    </div>
  )
}

export default AppLayout
