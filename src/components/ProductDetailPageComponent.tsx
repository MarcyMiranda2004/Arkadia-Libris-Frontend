import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Carousel,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { Heart, HeartFill } from "react-bootstrap-icons";
import "../style/homePage.scss";
import type { Product } from "../type/ProductObject";

const API = "http://localhost:8080";

type ApiProduct = Product & {
  images: string[];
  author: string;
  stock: number;
  categories: string[];
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const prodId = Number(id);
  const navigate = useNavigate();
  const { token, userId } = useContext(AuthContext);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const { addToCart } = useCart();
  const { wishlist, viewWishlist, addToWishlist, removeFromWishlist } =
    useWishlist();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (userId) viewWishlist();
  }, [userId]);

  const isFavorite = useCallback(
    () => !!wishlist?.items.find((i) => i.productId === prodId),
    [wishlist, prodId]
  );

  const toggleWishlist = async () => {
    if (!userId) return;
    if (isFavorite()) {
      await removeFromWishlist(prodId);
    } else {
      await addToWishlist(prodId);
    }
  };

  useEffect(() => {
    if (!prodId) return;
    setLoading(true);
    fetch(`${API}/products/${prodId}`, { headers: authHeader })
      .then((res) => {
        if (!res.ok) throw new Error(`Errore: ${res.status}`);
        return res.json();
      })
      .then((data: Product) => setProduct(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [prodId, token]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(prodId, 1);
    setAdding(false);
  };

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
  if (!product)
    return (
      <Container className="mt-5">
        <Alert variant="warning">Prodotto non trovato.</Alert>
      </Container>
    );

  return (
    <Container className="my-5">
      <Button
        onClick={() => navigate(-1)}
        className="addCartBtn bg-a-quaternary btn-outline-a-quaternary text-a-primary border border-1 border-a-secondary"
      >
        ← Torna indietro
      </Button>

      <Row className="mt-3 bg-a-secondary text-a-primary p-4 rounded-3 border border-2 border-a-quaternary">
        <Col md={6}>
          <Carousel>
            {product.images.map((src, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={src}
                  alt={`Immagine ${idx + 1}`}
                  style={{ maxHeight: 500, objectFit: "contain" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col md={6} className="bg-a-secondary p-2 ">
          <h2>{product.title}</h2>
          <p className="text-a-primary">di: {product.author}</p>
          <h4 className="text-success">€{product.price.toFixed(2)}</h4>
          <p>{product.description}</p>

          <div className="mb-3">
            {product.categories.map((c) => (
              <Badge bg="secondary" key={c} className="me-1">
                {c}
              </Badge>
            ))}
          </div>

          <p>
            <strong>Disponibilità:</strong>{" "}
            {product.stock > 0 ? `${product.stock} in magazzino` : "Esaurito"}
          </p>

          <div className="d-flex align-items-center">
            <Button
              disabled={product.stock === 0 || adding}
              onClick={handleAddToCart}
              className="bg-a-quaternary btn-outline-a-secondary text-a-primary addCartBtn border border-1 border-a-primary  me-5"
            >
              Aggiungi al Carrello
            </Button>

            {isFavorite() ? (
              <HeartFill
                size={24}
                className="text-danger pointer addWishlistBtn"
                onClick={toggleWishlist}
              />
            ) : (
              <Heart
                size={24}
                className="text-a-primary pointer addWishlistBtn"
                onClick={toggleWishlist}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
