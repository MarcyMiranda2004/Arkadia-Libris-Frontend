import React, { useState, useContext } from "react";
import { useCart } from "../context/CartContext";
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
import CartDrawer from "./CartDrawer";

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();
  const { cart, viewCart } = useCart();
  const [activeLink, setActiveLink] = useState<string>("");
  const { token, userId, userRole, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const isBackofficeUser = userRole === "ADMIN" || userRole === "STAFF";

  const [showCart, setShowCart] = useState(false);
  const totalItems = cart?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const handleShow = () => {
    viewCart();
    setShowCart(true);
  };

  const handleClose = () => setShowCart(false);
  const handleReload = () => {
    window.location.reload();
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?title=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
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
                    href={`/home/#${section}`}
                    onClick={() => setActiveLink(section)}
                    className={`text-a-primary h2 mx-2 fw-semibold pointer navLink ${
                      activeLink === section ? "active-link" : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Nav.Link>
                )
              )}

              {/* Search Tab */}
              <Form className="d-flex mx-5" onSubmit={handleSubmitSearch}>
                <Form.Control
                  type="search"
                  placeholder="Cerca..."
                  className="rounded-pill rounded-end"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                />
                <Button
                  type="submit"
                  variant="outline-success"
                  className="d-flex align-items-center justify-content-center bg-a-primary border-0 text-black rounded-pill rounded-start"
                >
                  <Search size={20} />
                </Button>
              </Form>

              <div className="bg-a-primary rounded-pill d-flex align-items-center fw-semibold">
                <Heart
                  className="mx-2 pointer ms-3 wishlist"
                  size={26}
                  onClick={() => navigate(`/users/${userId}/wishlist`)}
                />
                <div
                  className="position-relative mx-2 pointer cart"
                  onClick={() => setShowCart(true)}
                >
                  <Cart size={28} className="cart" />
                  {totalItems > 0 && (
                    <span
                      className="position-absolute top-50 start-50 translate-middle text-a-quaternary fs-6 rounded-pill fw-bold cart no-select pointer-none"
                      style={{ paddingBottom: "3px" }}
                    >
                      {totalItems}
                    </span>
                  )}
                </div>

                <CartDrawer show={showCart} onHide={() => setShowCart(false)} />

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
                          handleReload();
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
    </>
  );
};

export default NavbarComponent;
