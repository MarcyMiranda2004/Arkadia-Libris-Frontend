import React, { useState, useEffect, useContext } from "react";
import { Container, Carousel, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { Product } from "../type/ProductObject";
import "../style/homePage.scss";

const API = "http://localhost:8080";

const HomePageComponent: React.FC = () => {
  const { token } = useContext(AuthContext);
  const authHeader = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const shuffle = (arr: Product[]) => [...arr].sort(() => Math.random() - 0.5);

  const novita = shuffle(products).slice(0, 8);
  const popolari = shuffle(products).slice(0, 8);
  const offerte = shuffle(products).slice(0, 8);
  const libri = shuffle(
    products.filter((p) => p.category?.toLowerCase() === "libri")
  ).slice(0, 8);
  const manga = shuffle(
    products.filter((p) => p.category?.toLowerCase() === "manga")
  ).slice(0, 8);
  const comix = shuffle(
    products.filter((p) => p.category?.toLowerCase() === "comix")
  ).slice(0, 8);

  const banners = [
    "https://i.pinimg.com/736x/59/a0/f6/59a0f69a9e03f8e391e74729c97dfc3e.jpg",
    "https://i.pinimg.com/736x/59/a0/f6/59a0f69a9e03f8e391e74729c97dfc3e.jpg",
    "https://i.pinimg.com/736x/59/a0/f6/59a0f69a9e03f8e391e74729c97dfc3e.jpg",
  ];

  const sections = [
    { id: "novita", title: "Novità", items: novita },
    { id: "popolari", title: "Popolari", items: popolari },
    { id: "offerte", title: "Offerte", items: offerte },
    { id: "libri", title: "Libri", items: libri },
    { id: "manga", title: "Manga", items: manga },
    { id: "comix", title: "Comix", items: comix },
  ];

  const renderSection = (id: string, title: string, items: Product[]) => (
    <section id={id} className="mt-5">
      <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary text-center">
        {title}
      </h2>
      <Row className="mt-3">
        {items.map((p) => (
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
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onClick={() => navigate(`/product/${p.id}`)}
                />
              </div>
              <Card.Body className="d-flex flex-column bg-a-secondary">
                <Card.Title className="fs-6 text-truncate text-a-primary">
                  {p.title}
                </Card.Title>
                <Card.Text className="fw-bold mt-auto text-a-primary">
                  €{p.price.toFixed(2)}
                </Card.Text>
                <Button
                  className="bg-a-quaternary btn-outline-a-secondary text-a-primary addCartBtn"
                  onClick={() => {}}
                >
                  Aggiungi al carrello
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
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
