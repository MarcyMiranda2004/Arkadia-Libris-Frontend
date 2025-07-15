import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Search, Heart, Cart, PersonCircle } from "react-bootstrap-icons";
import logo from "../assets/png/logos/logo-no-write-no-bg.svg";
import "../style/navbar.scss";

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>("");
  const { token, userId, userRole, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const isBackofficeUser = userRole === "ADMIN" || userRole === "STAFF";

  return (
    <Navbar expand="lg" className="bg-a-secondary">
      <Container className="p-0">
        <Navbar.Brand
          onClick={() => navigate("/home")}
          className="text-a-primary d-flex align-items-center pointer"
        >
          <Image
            src={logo}
            alt="arkadia_libris_logo"
            style={{ width: "100px" }}
            className="rounded-circle logo"
          />
          <p className="h1 arsenica mb-0">Arkadia Libris</p>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="bg-a-primary me-5"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mx-3">
            {["novita", "popolari", "offerta", "libri", "comix", "manga"].map(
              (section) => (
                <Nav.Link
                  key={section}
                  href={`#${section}`}
                  onClick={() => setActiveLink(section)}
                  className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                    activeLink === section ? "active-link" : ""
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Nav.Link>
              )
            )}

            <Form className="d-flex mx-5">
              <Form.Control
                type="search"
                placeholder="Cerca..."
                className="rounded-pill rounded-end"
                aria-label="Search"
              />
              <Button
                variant="outline-success"
                className="d-flex align-items-center justify-content-center bg-a-primary border-0 text-black rounded-pill rounded-start"
              >
                <Search size={20} />
              </Button>
            </Form>

            <div className="bg-a-primary rounded-pill d-flex align-items-center fw-semibold">
              <Heart
                className="mx-2 pointer ms-3 wishlist"
                size={25}
                onClick={() => navigate("/users/wishlist")}
              />
              <Cart
                className="mx-2 pointer"
                size={25}
                onClick={() => navigate("/users/cart")}
              />

              <NavDropdown
                title={<PersonCircle size={25} className="pointer user" />}
                id="person-dropdown"
                align="end"
                className="person-dropdown"
              >
                {isLoggedIn ? (
                  <>
                    <NavDropdown.Item
                      as="button"
                      onClick={() => navigate(`/user-profile/${userId}`)}
                    >
                      Profilo
                    </NavDropdown.Item>
                    {isBackofficeUser && (
                      <NavDropdown.Item
                        as="button"
                        onClick={() => navigate("/backoffice")}
                      >
                        Backoffice
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item
                      as="button"
                      onClick={() => navigate(`/user-library/${userId}`)}
                    >
                      Libreria
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        logout();
                        navigate("/auth/login");
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
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
