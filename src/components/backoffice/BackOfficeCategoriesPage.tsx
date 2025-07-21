import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Tabs,
  Tab,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Pagination,
  Modal,
} from "react-bootstrap";
import type {
  CategoryDto,
  CreateAndUpdateCategoryRequestDto,
} from "../../type/backoffice/CategoryDto";
import { AuthContext } from "../../context/AuthContext";
import "../../style/backoffice/backOfficeDashboard.scss";
import { PencilSquare, TrashFill, ArrowLeft } from "react-bootstrap-icons";
import { Navigate, useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;
const API = "http://localhost:8080";

const BackOfficeCategoriesPage: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [filtered, setFiltered] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<CategoryDto | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<"BOOK" | "MAGAZINE" | "OTHER">("BOOK");

  const navigate = useNavigate();

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/categories`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(await res.text());
      const data: CategoryDto[] = await res.json();
      setCategories(data);
      setFiltered(data);
      setPage(0);
    } catch {
      setError("Impossibile caricare le categorie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const clearForm = () => {
    setName("");
    setType("BOOK");
    setSelected(null);
  };

  const openCreate = () => {
    clearForm();
    setFormMode("create");
    setShowForm(true);
  };

  const openEdit = (c: CategoryDto) => {
    setSelected(c);
    setName(c.name);
    setType(c.productCategoryType as any);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Confermi eliminazione?")) return;
    setError(null);
    try {
      const res = await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error();
      loadCategories();
    } catch {
      setError("Errore durante l'eliminazione");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: CreateAndUpdateCategoryRequestDto = {
      name,
      productCategoryType: type,
    };
    const url =
      formMode === "create"
        ? `${API}/categories`
        : `${API}/categories/${selected?.id}`;
    const method = formMode === "create" ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setShowForm(false);
      loadCategories();
    } catch {
      setError(
        formMode === "create" ? "Errore creazione" : "Errore aggiornamento"
      );
    }
  };

  const handleSearch = () => {
    const q = query.toLowerCase();
    const f = categories.filter(
      (c) =>
        c.id.toString().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.productCategoryType.toLowerCase().includes(q)
    );
    setFiltered(f);
    setPage(0);
  };

  const pageItems = filtered.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-5 mt-5 fs-1 arsenica bg-a-secondary text-a-primary rounded-pill border border-2 border-a-quaternary p-2">
        Gestione Categorie
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs
        activeKey="view"
        onSelect={() => {}}
        className="mb-3 border-bottom border-2 border-a-secondary customTubs"
      >
        <Tab eventKey="view" title="Vedi Categorie">
          <Row className="mb-3">
            <Col xs="auto">
              <Button
                className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-2 border-a-secondary"
                onClick={openCreate}
              >
                Aggiungi Categoria
              </Button>
            </Col>
            <Col>
              <Form
                className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <Form.Control
                  placeholder="Cerca per ID, nome o tipo…"
                  className="formLabel"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
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
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Tipo Prodotto</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.productCategoryType}</td>
                      <td>
                        <PencilSquare
                          size={22}
                          className="text-a-quaternary pointer me-1 productBtn"
                          onClick={() => openEdit(c)}
                        />
                        <TrashFill
                          size={22}
                          className="text-a-danger pointer ms-1 productBtn"
                          onClick={() => handleDelete(c.id)}
                        />
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
          <p>INSERIRE INFO</p>
        </Tab>
      </Tabs>

      {/* Modal crea / modifica */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Form onSubmit={handleSubmit} className="bg-a-secondary text-a-primary">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              {formMode === "create" ? "Nuova Categoria" : "Modifica Categoria"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                className="bg-a-primary"
                required
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tipo Prodotto</Form.Label>
              <Form.Select
                className="bg-a-primary pointer"
                value={type}
                onChange={(e) => setType(e.currentTarget.value as any)}
              >
                <option className="pointer" value="BOOK">
                  BOOK
                </option>
                <option className="pointer" value="MANGA">
                  MANGA
                </option>
                <option className="pointer" value="COMIX">
                  COMIX
                </option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Annulla
            </Button>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary border border-1 border-a-quaternary text-a-primary customBtn"
            >
              Salva
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default BackOfficeCategoriesPage;
