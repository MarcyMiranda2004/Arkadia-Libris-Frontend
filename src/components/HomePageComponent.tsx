import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Container, Carousel, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import type { Product } from "../type/ProductObject";
import "../style/homePage.scss";
import { Heart, HeartFill } from "react-bootstrap-icons";

const API = "http://localhost:8080";

const HomePageComponent: React.FC = () => {
  const { token, userId } = useContext(AuthContext);
  const authHeader = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { wishlist, viewWishlist, addToWishlist, removeFromWishlist } =
    useWishlist();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/products/search?page=0&size=50`, {
          headers: authHeader,
        });
        if (!res.ok) throw new Error(`Errore fetching prodotti: ${res.status}`);
        const page = await res.json();
        setProducts(page.content as Product[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (userId) viewWishlist();
  }, [userId]);

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

  const shuffle = (arr: Product[]) => [...arr].sort(() => Math.random() - 0.5);

  const novita = useMemo(() => shuffle(products).slice(0, 8), [products]);
  const popolari = useMemo(() => shuffle(products).slice(0, 8), [products]);
  const offerte = useMemo(() => shuffle(products).slice(0, 8), [products]);

  const banners = [
    "https://i.pinimg.com/736x/59/a0/f6/59a0f69a9e03f8e391e74729c97dfc3e.jpg",
    "https://i.pinimg.com/736x/59/a0/f6/59a0f69a9e03f8e391e74729c97dfc3e.jpg",
    "https://i.pinimg.com/736x/59/a0/f6/59a0f69a9e03f8e391e74729c97dfc3e.jpg",
  ];

  const sections = [
    { id: "novita", title: "Novità", items: novita },
    { id: "popolari", title: "Popolari", items: popolari },
    { id: "offerte", title: "Offerte", items: offerte },
  ];

  const renderSection = (id: string, title: string, items: Product[]) => (
    <section id={id} className="mt-5" key={id}>
      <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary text-center">
        {title}
      </h2>
      <Row className="mt-3">
        {items.map((p) => {
          const favorite = isInWishlist(p.id);
          return (
            <Col key={p.id} xs={6} md={3} className="mb-4">
              <Card className="h-100">
                <div style={{ height: 400, overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={
                      p.imageUrl && p.imageUrl.length > 0
                        ? p.imageUrl
                        : "https://i.pinimg.com/736x/5d/9e/c5/5d9ec5890c8e5cf8185e4bc96e9fc015.jpg"
                    }
                    className="pointer"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    onClick={() => navigate(`/product/${p.id}`)}
                  />
                </div>
                <Card.Body className="d-flex flex-column bg-a-secondary">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <Card.Title className="fs-6 text-truncate text-a-primary text-wrap">
                        {p.title}
                      </Card.Title>
                      <Card.Text className="fw-bold mt-auto text-a-primary">
                        €{p.price.toFixed(2)}
                      </Card.Text>
                    </div>
                    <div
                      className="pointer"
                      onClick={() => toggleWishlist(p.id)}
                    >
                      {favorite ? (
                        <HeartFill
                          size={24}
                          className="text-danger addWishlistBtn"
                        />
                      ) : (
                        <Heart
                          size={24}
                          className="text-a-primary addWishlistBtn"
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    className="bg-a-quaternary btn-outline-a-secondary text-a-primary addCartBtn border border-1 border-a-primary"
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
    </section>
  );

  if (loading) return <Container>Caricamento...</Container>;
  if (error) return <Container className="text-danger">{error}</Container>;

  return (
    <Container className="mt-5">
      <Carousel>
        {banners.map((src, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={src}
              alt={`Banner ${idx + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {sections.map((s) => renderSection(s.id, s.title, s.items))}
    </Container>
  );
};

export default HomePageComponent;
