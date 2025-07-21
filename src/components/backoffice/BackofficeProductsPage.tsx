import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Tabs,
  Tab,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import type {
  BackOfficeProductDto as ProductDto,
  BackOfficeCreateProductRequestDto as CreateProductRequestDto,
  BackOfficeUpdateProductRequestDto as UpdateProductRequestDto,
} from "../../type/backoffice/BackofficeProductDto";
import { AuthContext } from "../../context/AuthContext";
import "../../style/backoffice/backOfficeDashboard.scss";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080";
const PAGE_SIZE = 20;

const BackOfficeProductsPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [key, setKey] = useState<"view" | "functions">("view");
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<ProductDto | null>(null);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [productType, setProductType] = useState("");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [initialStock, setInitialStock] = useState(0);

  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    const bearer = token ? `Bearer ${token}` : "";
    try {
      let url: string;
      if (searchTerm.trim()) {
        const term = encodeURIComponent(searchTerm.trim());
        if (/^\d+$/.test(searchTerm.trim())) {
          url = `${API_BASE}/products/${term}`;
          const res = await fetch(url, { headers: { Authorization: bearer } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const prod = (await res.json()) as ProductDto;
          setProducts([prod]);
          setTotalPages(1);
          setLoading(false);
          return;
        } else {
          url = `${API_BASE}/products/search?title=${term}&isbn=${term}&author=${term}&page=${pageNumber}&size=${PAGE_SIZE}`;
        }
      } else {
        url = `${API_BASE}/products/search?title=&isbn=&author=&page=${pageNumber}&size=${PAGE_SIZE}`;
      }
      const res = await fetch(url, { headers: { Authorization: bearer } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        content: ProductDto[];
        totalPages: number;
      };
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare i prodotti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key === "view") fetchProducts(page);
  }, [key, page]);

  const handleSearch = () => {
    setPage(0);
    fetchProducts(0);
  };

  const clearForm = () => {
    setTitle("");
    setIsbn("");
    setAuthor("");
    setPublisher("");
    setDescription("");
    setPrice(0);
    setProductType("");
    setCategoriesInput("");
    setImagesInput("");
    setInitialStock(0);
    setSelected(null);
  };

  const openCreate = () => {
    setFormMode("create");
    clearForm();
    setShowForm(true);
  };

  const openEdit = (p: ProductDto) => {
    setFormMode("edit");
    setSelected(p);
    setTitle(p.title);
    setIsbn(p.isbn || "");
    setAuthor(p.author);
    setPublisher(p.publisher || "");
    setDescription(p.description || "");
    setPrice(p.price);
    setCategoriesInput(p.categories?.join(", ") || "");
    setImagesInput(p.images?.join(", ") || "");
    setInitialStock(0);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Confermi eliminazione?")) return;
    const bearer = token ? `Bearer ${token}` : "";
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: bearer },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchProducts(page);
    } catch (err) {
      console.error(err);
      setError("Spiacenti, non è possibile eliminare questo prodotto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const bearer = token ? `Bearer ${token}` : "";
    const categories = categoriesInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const images = imagesInput
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    let url = `${API_BASE}/products`;
    let method: "POST" | "PUT" = "POST";
    let payload: any;

    if (formMode === "create") {
      payload = {
        title,
        isbn,
        author,
        publisher,
        description,
        price,
        productType,
        categories,
        images,
        initialStock,
      } as CreateProductRequestDto;
    } else if (selected) {
      url = `${API_BASE}/products/${selected.id}`;
      method = "PUT";
      payload = {
        title,
        isbn,
        author,
        publisher,
        description,
        price,
        categories,
        images,
      } as UpdateProductRequestDto;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: bearer },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setShowForm(false);
      fetchProducts(page);
    } catch (err) {
      console.error(err);
      setError(
        formMode === "create"
          ? "Errore durante la creazione"
          : "Errore durante l'aggiornamento"
      );
    }
  };

  const paginationItems = [];
  for (let i = 0; i < totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() => setPage(i)}
        className="paginationCustom"
      >
        {i + 1}
      </Pagination.Item>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-5 mt-5 fs-1 arsenica bg-a-secondary text-a-primary rounded-pill border border-2 border-a-quaternary p-2">
        Gestione Prodotti
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k || "view")}
        className="mb-3 border-bottom border-2 border-a-secondary customTubs"
      >
        <Tab eventKey="view" title="Vedi Articoli">
          <Row className="mb-3">
            <Col xs="auto">
              <Button
                className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-2 border-a-secondary me-1"
                onClick={openCreate}
              >
                Aggiungi Prodotto
              </Button>
              <Button
                className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-2 border-a-secondary ms-1"
                onClick={() => navigate("/backoffice/stock")}
              >
                Controlla Stock
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
                  type="search"
                  placeholder="Cerca con id/nome/isbn"
                  value={searchTerm}
                  className="formLabel"
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
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
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.title}</td>
                      <td>{p.author}</td>
                      <td>€{p.price.toFixed(2)}</td>
                      <td>
                        <PencilSquare
                          size={22}
                          onClick={() => openEdit(p)}
                          className="text-a-quaternary pointer me-1 productBtn"
                        >
                          Modifica
                        </PencilSquare>
                        <TrashFill
                          size={22}
                          className="text-a-danger pointer ms-1 productBtn"
                          onClick={() => handleDelete(p.id)}
                        >
                          Elimina
                        </TrashFill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="mt-2 ">{paginationItems}</Pagination>
            </>
          )}
        </Tab>
        <Tab eventKey="functions" title="Funzioni">
          <p>AGGIUNGERE INFO</p>
        </Tab>
      </Tabs>

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Form onSubmit={handleSubmit} className="bg-a-secondary text-a-primary">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              {formMode === "create" ? "Nuovo Prodotto" : "Modifica Prodotto"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Autore</Form.Label>
              <Form.Control
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Editore</Form.Label>
              <Form.Control
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Prezzo (€)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="bg-a-primary"
              />
            </Form.Group>

            {formMode === "create" && (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Tipo Prodotto</Form.Label>
                  <Form.Select
                    required
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="bg-a-primary"
                  >
                    <option value="">Seleziona un tipo...</option>
                    <option value="BOOK">BOOK</option>
                    <option value="MANGA">MANGA</option>
                    <option value="COMIX">COMIX</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Quantità Iniziale</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={initialStock}
                    onChange={(e) =>
                      setInitialStock(parseInt(e.target.value, 10))
                    }
                    className="bg-a-primary"
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-2">
              <Form.Label>Categorie (usa la virgola per separare)</Form.Label>
              <Form.Control
                required
                value={categoriesInput}
                onChange={(e) => setCategoriesInput(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                Immagini URL (usa la virgola per separare)
              </Form.Label>
              <Form.Control
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                className="bg-a-primary"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
              className="customBtn"
            >
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

export default BackOfficeProductsPage;
