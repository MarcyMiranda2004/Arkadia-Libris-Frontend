import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Tabs,
  Tab,
  Table,
  Button,
  Spinner,
  Alert,
  Pagination,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import type { InventoryItemDto } from "../../type/backoffice/InventoryItemDto ";
import { AuthContext } from "../../context/AuthContext";
import "../../style/backoffice/backOfficeDashboard.scss";
import { useNavigate } from "react-router-dom";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";

const API = "http://localhost:8080";
const PAGE_SIZE = 20;

const BackOfficeStockPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, setItems] = useState<InventoryItemDto[]>([]);
  const [filtered, setFiltered] = useState<InventoryItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"increase" | "decrease">(
    "increase"
  );
  const [selected, setSelected] = useState<InventoryItemDto | null>(null);
  const [qtyInput, setQtyInput] = useState<number>(0);

  const [key, setKey] = useState<"view" | "functions">("view");

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/products/stock`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(await res.text());
      const data: InventoryItemDto[] = await res.json();
      setItems(data);
      setFiltered(data);
      setPage(0);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare gli stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key === "view") loadItems();
  }, [key]);

  useEffect(() => {
    const q = query.toLowerCase();
    const f = items.filter(
      (it) =>
        it.productId.toString().includes(q) ||
        it.title.toLowerCase().includes(q)
    );
    setFiltered(f);
    setPage(0);
  }, [query, items]);

  const openModal = (mode: "increase" | "decrease", item: InventoryItemDto) => {
    setModalMode(mode);
    setSelected(item);
    setQtyInput(0);
    setShowModal(true);
  };

  const handleModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError(null);
    const path = modalMode === "increase" ? "increase" : "decrease";
    try {
      const res = await fetch(
        `${API}/products/${selected.productId}/stock/${path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ quantity: qtyInput }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setShowModal(false);
      loadItems();
    } catch (err) {
      console.error(err);
      setError("Errore durante l'operazione di stock");
    }
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-5 mt-5 fs-1 arsenica bg-a-secondary text-a-primary rounded-pill border border-2 border-a-quaternary p-2">
        Gestione Stock
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k || "view")}
        className="mb-3 border-bottom border-2 border-a-secondary customTubs"
      >
        <Tab eventKey="view" title="Vedi Stock">
          <Row className="mb-3">
            <Col xs="auto">
              <Button
                className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-2 border-a-secondary"
                onClick={() => navigate("/backoffice/products")}
              >
                Aggiungi Prodotto
              </Button>
            </Col>
            <Col>
              <Form
                className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Form.Control
                  placeholder="Cerca per ID o titolo…"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  className="formLabel w-100"
                />
                <Button
                  type="submit"
                  className="ms-2 customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-2 border-a-secondary"
                >
                  Cerca
                </Button>
              </Form>
            </Col>
          </Row>

          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Prodotto</th>
                    <th>Quantità</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((it) => (
                    <tr key={it.productId}>
                      <td>
                        #{it.productId} – {it.title}
                      </td>
                      <td>{it.quantity}</td>
                      <td>
                        <PlusCircle
                          size={22}
                          onClick={() => openModal("increase", it)}
                          className="me-2 text-a-quaternary productBtn pointer"
                        ></PlusCircle>
                        <DashCircle
                          size={22}
                          className="productBtn text-a-danger pointer"
                          onClick={() => openModal("decrease", it)}
                        ></DashCircle>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Pagination>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => setPage(i)}
                    className="paginationCustom"
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Tab>

        <Tab eventKey="functions" title="Funzioni">
          <p>AGGIUNGERE INFO</p>
        </Tab>
      </Tabs>

      {/* Modale Aumenta/Diminuisci */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleModal} className="bg-a-secondary text-a-primary">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              {modalMode === "increase" ? "Aumenta" : "Diminuisci"} stock di:
              {selected?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Quantità</Form.Label>
              <Form.Control
                className="formLabel bg-a-primary"
                type="number"
                min={1}
                required
                value={qtyInput}
                onChange={(e) =>
                  setQtyInput(Math.max(1, parseInt(e.currentTarget.value)))
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annulla
            </Button>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary border border-1 border-a-quaternary text-a-primary customBtn"
            >
              Conferma
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default BackOfficeStockPage;
