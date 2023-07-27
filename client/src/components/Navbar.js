import React, { useState } from "react"
import "../styles/navbar.css"
import { Navbar as BsNavbar, Nav, Form, Button } from "react-bootstrap"
import { NavLink, useNavigate } from "react-router-dom"

function Navbar({ handleShow }) {
  const navigate = useNavigate()

  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    let type = window.location.href.split("/")[3]
    if (type != "memes" && type != "anime") type = "main"
    navigate(`${type !== "main" ? `/${type}` : ""}/search?q=${query}`)
  }

  return (
    <BsNavbar bg="light" sticky="top" expand="lg">
      <BsNavbar.Brand as={NavLink} to="/">Menfess</BsNavbar.Brand>
      <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BsNavbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/">Home</Nav.Link>
          <Nav.Link as={NavLink} to="/memes">Memes</Nav.Link>
          <Nav.Link as={NavLink} to="/anime">Anime</Nav.Link>
        </Nav>
        <Form inline="true" onSubmit={handleSubmit}>
          <Form.Control required type="text" onChange={(e) => setQuery(e.target.value)} value={query} placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success" type="submit">Search</Button>
        </Form>
      <Button onClick={handleShow}>New Post</Button>
      </BsNavbar.Collapse>
    </BsNavbar>
  )
}

export default Navbar
