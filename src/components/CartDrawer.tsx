import React from "react";
import { Offcanvas, Button, Spinner, Alert, Image } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { XLg } from "react-bootstrap-icons";
import "../style/cart.scss";

interface CartDrawerProps {
  show: boolean;
  onHide: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ show, onHide }) => {
  const { cart, loading, error, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const hasItems = cart?.items?.length > 0;
  const total =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className="bg-a-tertiary text-a-primary border-2 border-a-quaternary"
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title> 🛒 Il tuo carrello 🛒</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !hasItems && <p>Il carrello è vuoto.</p>}

        {!loading && hasItems && (
          <>
            {cart!.items.map((item) => (
              <div
                key={item.productId}
                className="d-flex align-items-center mb-3"
              >
                <Image
                  src={
                    item.imageUrl ||
                    "https://i.pinimg.com/736x/5d/9e/c5/5d9ec5890c8e5cf8185e4bc96e9fc015.jpg"
                  }
                  alt={item.productName}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    marginRight: 10,
                  }}
                  className="pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                />
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">{item.productName}</div>
                  <div className="d-flex justify-content-between">
                    <span>Prezzo:</span>
                    <span>€{item.price.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Quantità:</span>
                    <span>{item.quantity}</span>
                  </div>
                </div>
                <XLg
                  className="text-a-danger pointer ms-2"
                  size={20}
                  onClick={() => removeItem(item.productId)}
                />
              </div>
            ))}
            <hr />

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Totale:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div className="d-flex">
              <Button
                className="me-2 bg-danger btn-outline-a-tertiary text-a-primary cartBtn"
                onClick={clearCart}
              >
                Svuota Carrello
              </Button>
              <Button
                className="bg-a-quaternary btn-outline-a-tertiary text-a-primary cartBtn"
                onClick={() => {
                  onHide();
                  navigate("/checkout");
                }}
              >
                Vai al checkout
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;
