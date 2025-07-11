import "../style/navbar.scss";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Search, Heart, Cart, PersonCircle } from "react-bootstrap-icons";
import logo from "../assets/png/logos/logo-no-write-no-bg.svg";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>("");
  const { token, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
    <Navbar expand="lg" className="bg-a-secondary">
      <Container className="p-0">
        <Navbar.Brand
          onClick={() => navigate("/home")}
          className="text-a-primary d-flex justify-content-center align-items-center"
        >
          <img
            src={logo}
            alt="arkadia_libris_logo"
            style={{ width: "100px" }}
            className="pointer rounded-circle logo"
          />
          <p className="h1 arsenica">Arkadia Libris</p>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="bg-a-primary me-5"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mx-3">
            <Nav.Link
              href="#novita"
              onClick={() => setActiveLink("novita")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                activeLink === "novita" ? "active-link" : ""
              }`}
            >
              Novità
            </Nav.Link>

            <Nav.Link
              href="#popolari"
              onClick={() => setActiveLink("popolari")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                activeLink === "popolari" ? "active-link" : ""
              }`}
            >
              Popolari
            </Nav.Link>

            <Nav.Link
              href="#offerta"
              onClick={() => setActiveLink("offerta")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                activeLink === "offerta" ? "active-link" : ""
              }`}
            >
              Offerte
            </Nav.Link>

            <Nav.Link
              href="#libri"
              onClick={() => setActiveLink("libri")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                activeLink === "libri" ? "active-link" : ""
              }`}
            >
              Libri
            </Nav.Link>

            <Nav.Link
              href="#comix"
              onClick={() => setActiveLink("comix")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                activeLink === "comix" ? "active-link" : ""
              }`}
            >
              Comix
            </Nav.Link>

            <Nav.Link
              href="#manga"
              onClick={() => setActiveLink("manga")}
              className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                activeLink === "manga" ? "active-link" : ""
              }`}
            >
              Manga
            </Nav.Link>

            {/* Search Tab */}
            <Form className="d-flex mx-5">
              <Form.Control
                type="search"
                placeholder="Cerca..."
                className="rounded-pill rounded-end"
                aria-label="Search"
              />
              <Button
                variant="outline-success"
                className="d-flex justify-content-center align-items-center bg-a-primary border-0 text-black rounded-pill rounded-start"
              >
                <Search size={20} className="searchBtn"></Search>
              </Button>
            </Form>

            {/* User Tab */}
            <div className="bg-a-primary rounded-pill d-flex justify-content-center align-items-center fw-semibold">
              <Heart className="mx-2 pointer ms-3 wishlist" size={25} />
              <Cart className="mx-2 pointer cart" size={25} />

              {/* User Dropdown */}
              <NavDropdown
                title={<PersonCircle className="m-0 pointer user" size={25} />}
                id="person-dropdown"
                align="end"
                className="person-dropdown"
              >
                {isLoggedIn ? (
                  <>
                    <NavDropdown.Item href="#profile">Profilo</NavDropdown.Item>
                    <NavDropdown.Item href="#orders">Ordini</NavDropdown.Item>
                    <NavDropdown.Item href="#library">
                      Libreria
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item
                      as="button"
                      onClick={() => navigate("/auth/login")}
                    >
                      Accedi
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as="button"
                      onClick={() => navigate("/auth/register")}
                    >
                      Registrati
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
