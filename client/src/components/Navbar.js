import React, { useState } from "react";
import { Navbar as BsNavbar, Nav, Form, Button, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ handleShow }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let type = window.location.href.split("/")[3];
    if (type !== "memes" && type !== "anime") type = "main";
    navigate(`${type !== "main" ? `/${type}` : ""}/search?q=${query}`);
  };

  return (
    <BsNavbar
      className="text-light"
      variant="dark"
      style={{
        /* From https://css.glass */
        background: "rgba(68, 68, 68, 0.47)",
        borderBottomRightRadius: "15px",
        borderBottomLeftRadius: "15px",

        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
      sticky="top"
      expand="lg">
      <BsNavbar.Brand as={NavLink} to="/" className="m-1 text-light">
        <Image
          className="m-2 text-light"
          src="https://play-lh.googleusercontent.com/ctZv22_YORB0adQB_V4eOo4pgm4Js744yB4wOPhTVbPSOm_Lg0opMsIjC9xTc2EdwQ=w240-h480"
          alt="Navbar Image"
          style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
        Menfess
      </BsNavbar.Brand>
      <BsNavbar.Toggle
        aria-controls="basic-navbar-nav"
        className="m-2 text-light"
      />
      <BsNavbar.Collapse
        id="basic-navbar-nav"
        style={{ borderColor: "purple", color: "red" }} // Change the color here
      >
        <Nav className="mr-auto">
          <Nav.Link className="m-1 text-light" as={NavLink} to="/">
            Home
          </Nav.Link>
          <Nav.Link className="m-1 text-light" as={NavLink} to="/memes">
            Memes
          </Nav.Link>
          <Nav.Link className="m-1 text-light" as={NavLink} to="/anime">
            Anime
          </Nav.Link>
        </Nav>
        <Form inline="true" onSubmit={handleSubmit} className="m-1 text-light">
          <Form.Control
            required
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            placeholder="Search"
            className="mr-sm-1 text-light"
          />
        </Form>
        <Button className="m-1 text-light" onClick={handleShow}>
          New Post
        </Button>
      </BsNavbar.Collapse>
    </BsNavbar>
  );
}

export default Navbar;
