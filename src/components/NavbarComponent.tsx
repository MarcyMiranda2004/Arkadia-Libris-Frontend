import "../style/navbar.scss";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Search, Heart, Cart, PersonCircle } from "react-bootstrap-icons";
import logo from "../assets/png/logos/logo-no-write-no-bg.svg";

const NavbarComponent = () => {
  const [activeLink, setActiveLink] = useState<string>("");

  return (
    <Navbar expand="lg" className="bg-a-secondary">
      <Container className="p-0">
        <Navbar.Brand
          href="#home"
          className="text-a-primary d-flex justify-content-center align-items-center"
        >
          <img
            src={logo}
            alt="arkadia_libris_logo"
            style={{ width: "100px" }}
            className="pointer"
          />
          <p className="h1 arsenica">Arkadia Libris</p>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mx-3">
            <Nav.Link
              href="#novita"
              onClick={() => setActiveLink("novita")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer ${
                activeLink === "novita" ? "active-link" : ""
              }`}
            >
              Novità
            </Nav.Link>

            <Nav.Link
              href="#popolari"
              onClick={() => setActiveLink("popolari")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer ${
                activeLink === "popolari" ? "active-link" : ""
              }`}
            >
              Popolari
            </Nav.Link>

            <Nav.Link
              href="#offerta"
              onClick={() => setActiveLink("offerta")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer ${
                activeLink === "offerta" ? "active-link" : ""
              }`}
            >
              Offerte
            </Nav.Link>

            <Nav.Link
              href="#libri"
              onClick={() => setActiveLink("libri")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer ${
                activeLink === "libri" ? "active-link" : ""
              }`}
            >
              Libri
            </Nav.Link>

            <Nav.Link
              href="#comix"
              onClick={() => setActiveLink("comix")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer ${
                activeLink === "comix" ? "active-link" : ""
              }`}
            >
              Comix
            </Nav.Link>

            <Nav.Link
              href="#manga"
              onClick={() => setActiveLink("manga")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer ${
                activeLink === "manga" ? "active-link" : ""
              }`}
            >
              Manga
            </Nav.Link>

            {/* Search Tab */}
            <Container className="bg-a-primary rounded-pill d-flex justify-content-center align-items-center mx-5 fw-semibold pointer">
              <Search /> <p className="m-0 ms-2">Search</p>
            </Container>

            {/* User Tab */}
            <Container className="bg-a-primary rounded-pill d-flex justify-content-center align-items-center fw-semibold">
              <Heart className="mx-2 h4 m-0 pointer" />
              <Cart className="mx-2 h4 m-0 pointer" />
              <NavDropdown
                title={<PersonCircle className="h4 m-0 pointer" />}
                id="person-dropdown"
                align="end"
                className="person-dropdown"
              >
                <NavDropdown.Item href="#profile">Profilo</NavDropdown.Item>
                <NavDropdown.Item href="#orders">Ordini</NavDropdown.Item>
                <NavDropdown.Item href="#orders">Libreria</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Container>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
