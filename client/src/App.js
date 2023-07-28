import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Post from './components/modals/Post.js'
import Navbar from "./components/Navbar.js"
import eruda from 'eruda'

function App() {
  // Console di android
  if (process.env.NODE_ENV !== "production") eruda.init()

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
    
      <Navbar handleShow={handleShow} />
      <Post show={show} handleClose={handleClose} />
      <Outlet />
    </>
  )
}

export default App
