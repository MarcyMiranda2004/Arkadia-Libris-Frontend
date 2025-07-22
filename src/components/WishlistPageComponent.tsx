import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TrashFill } from "react-bootstrap-icons";
import "../style/wishlist.scss";

const WishlistPageComponent: React.FC = () => {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (loading)
    return (
      <Container className="text-center">
        <Spinner />
      </Container>
    );
  if (error)
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5 arsenica">
      <h2 className="border border-3 border-a-quaternary text-center fs-1 bg-a-secondary text-a-primary p-2 rounded-pill ">
        ✨ La tua Wishlist ✨
      </h2>
      {wishlist?.items.length ? (
        <>
          <Row className="mt-4">
            {wishlist.items.map((item) => (
              <Col xs={12} md={4} lg={3} key={item.productId} className="mb-4">
                <Card className="h-100">
                  <div style={{ height: 400, overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={
                        item.imageUrls && item.imageUrls.length > 0
                          ? item.imageUrls[0]
                          : "https://i.pinimg.com/736x/5d/9e/c5/5d9ec5890c8e5cf8185e4bc96e9fc015.jpg"
                      }
                      className="pointer"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column bg-a-secondary text-a-primary">
                    <Card.Title className="fs-6 text-truncate">
                      {item.productName}
                    </Card.Title>
                    <Card.Text className="fw-bold mt-auto">
                      €{(item.price ?? 0).toFixed(2)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        className="bg-a-quaternary btn-outline-secondary text-a-primary border-0 wishlistBtn border border-1 border-a-primary"
                        onClick={() => addToCart(item.productId)}
                      >
                        Aggiungi al carrello
                      </Button>
                      <TrashFill
                        size={22}
                        className="text-danger removeBtn pointer"
                        onClick={() => removeFromWishlist(item.productId)}
                      ></TrashFill>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <h3>La tua wishlist è vuota.</h3>
      )}
    </Container>
  );
};

export default WishlistPageComponent;
