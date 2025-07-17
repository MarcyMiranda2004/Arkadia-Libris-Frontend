import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { Heart, HeartFill } from "react-bootstrap-icons";
import type { Product } from "../type/ProductObject";

const API = "http://localhost:8080";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage: React.FC = () => {
  const query = useQuery();
  const title = query.get("title") || "";
  const { token, userId } = useContext(AuthContext);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, viewWishlist, addToWishlist, removeFromWishlist } =
    useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) viewWishlist();
  }, [userId, viewWishlist]);

  const isInWishlist = useCallback(
    (productId: number) =>
      !!wishlist?.items.find((i) => i.productId === productId),
    [wishlist]
  );

  const toggleWishlist = async (productId: number) => {
    if (!userId) return;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  useEffect(() => {
    if (!title) return;
    setLoading(true);
    fetch(
      `${API}/products/search?title=${encodeURIComponent(
        title
      )}&page=0&size=50`,
      { headers: authHeader }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Errore: ${res.status}`);
        return res.json();
      })
      .then((page) => {
        const q = title.toLowerCase().trim();
        const filtered = (page.content as Product[])
          .filter((p) => p.title.toLowerCase().includes(q))
          .sort((a, b) =>
            a.title.localeCompare(b.title, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          );
        setProducts(filtered);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [title, token]);

  if (!title) {
    return (
      <Container className="mt-5">
        <Alert>Inserisci qualcosa da cercare.</Alert>
      </Container>
    );
  }
  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5">
      <h2>Risultati per “{title}”</h2>
      {products.length === 0 && (
        <Alert variant="warning">Nessun prodotto trovato.</Alert>
      )}
      <Row className="mt-3">
        {products.map((p) => {
          const favorite = isInWishlist(p.id);
          return (
            <Col xs={6} md={3} key={p.id} className="mb-4">
              <Card className="h-100">
                <div style={{ height: 400, overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={
                      p.images && p.images.length > 0
                        ? p.images[0]
                        : "https://i.pinimg.com/736x/5d/9e/c5/5d9ec5890c8e5cf8185e4bc96e9fc015.jpg"
                    }
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    className="pointer"
                    onClick={() => navigate(`/product/${p.id}`)}
                  />
                </div>
                <Card.Body className="d-flex flex-column bg-a-secondary text-a-primary">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <Card.Title className="fs-6 text-truncate">
                        {p.title}
                      </Card.Title>
                      <Card.Text className="fw-bold mt-auto">
                        €{p.price.toFixed(2)}
                      </Card.Text>
                    </div>
                    <div
                      onClick={() => toggleWishlist(p.id)}
                      className="pointer"
                    >
                      {favorite ? (
                        <HeartFill size={24} className="text-danger" />
                      ) : (
                        <Heart size={24} className="text-a-primary" />
                      )}
                    </div>
                  </div>
                  <Button
                    className="mt-auto bg-a-quaternary btn-outline-a-secondary text-a-primary addCartBtn"
                    onClick={() => addToCart(p.id, 1)}
                  >
                    Aggiungi al carrello
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default SearchPage;
