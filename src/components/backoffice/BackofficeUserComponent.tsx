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
  BackOfficeUserDto as UserDto,
  BackOfficeCreateStaffRequestDto as CreateStaffDto,
  BackOfficeAssignRoleRequestDto as AssignRoleDto,
} from "../../type/backoffice/BackOfficeUserDto";
import { AuthContext } from "../../context/AuthContext";
import "../../style/backoffice/backOfficeDashboard.scss";
import { PencilSquare } from "react-bootstrap-icons";

const API = "http://localhost:8080";

const BackOfficeUsersPage: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [key, setKey] = useState<"view" | "functions">("view");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const [newStaff, setNewStaff] = useState<CreateStaffDto>({
    name: "",
    surname: "",
    bornDate: "",
    username: "",
    email: "",
    password: "",
    role: "STAFF",
  });

  const clearCreateForm = () => {
    setNewStaff({
      name: "",
      surname: "",
      bornDate: "",
      username: "",
      email: "",
      password: "",
      role: "STAFF",
    });
  };

  const [assignRole, setAssignRole] = useState<AssignRoleDto>({ role: "USER" });

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadUsers = async (pageNumber = 0, q = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API}/users/dto/search?query=${encodeURIComponent(
          q
        )}&page=${pageNumber}&size=20`,
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as {
        content: UserDto[];
        totalPages: number;
        number: number;
      };
      setUsers(json.content);
      setPage(json.number);
      setTotalPages(json.totalPages);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare gli utenti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    clearCreateForm();
    setShowCreate(true);
  };

  const openAssign = (u: UserDto) => {
    setSelectedUser(u);
    setAssignRole({ role: u.role });
    setShowAssign(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newStaff),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowCreate(false);
      loadUsers(page, query);
    } catch (err) {
      console.error(err);
      setError("Errore durante la creazione dello staff");
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || selectedUser.id == null) {
      setError("Utente non selezionato correttamente");
      return;
    }
    const userId = selectedUser.id;
    setError(null);

    try {
      const res = await fetch(`${API}/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(assignRole),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowAssign(false);
      loadUsers(page, query);
    } catch (err) {
      console.error(err);
      setError("Errore durante l'assegnazione del ruolo");
    }
  };

  const paginationItems = [];
  for (let i = 0; i < totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() => loadUsers(i, query)}
        className="paginationCustom"
      >
        {i + 1}
      </Pagination.Item>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-5 mt-5 fs-1 arsenica bg-a-secondary text-a-primary rounded-pill border border-2 border-a-quaternary p-2">
        Gestione Utenti
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey((k as "view" | "functions") || "view")}
        className="mb-3 border-bottom border-2 border-a-secondary customTubs"
      >
        <Tab eventKey="view" title="Vedi Utenti">
          <Row className="mb-3">
            <Col xs="auto">
              <Button
                onClick={openCreate}
                className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-2 border-a-secondary"
              >
                Crea Utente
              </Button>
            </Col>
            <Col>
              <Form
                className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  loadUsers(0, query);
                }}
              >
                <Form.Control
                  placeholder="Cerca per ID / username / email…"
                  value={query}
                  className="formLabel"
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>Ruolo</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <PencilSquare
                          size={22}
                          className="text-a-quaternary productBtn pointer"
                          onClick={() => openAssign(u)}
                        >
                          Modifica Ruolo
                        </PencilSquare>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Pagination>{paginationItems}</Pagination>
            </>
          )}
        </Tab>

        <Tab eventKey="functions" title="Funzioni">
          <p>INSERIRE ISTRUZIONI</p>
        </Tab>
      </Tabs>

      {/* Modal Crea Utente */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Form onSubmit={handleCreate} className="bg-a-secondary text-a-primary">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Nuovo Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {[
              "name",
              "surname",
              "bornDate",
              "username",
              "email",
              "password",
            ].map((field) => (
              <Form.Group key={field} className="mb-2">
                <Form.Label>
                  {field === "bornDate"
                    ? "Data di nascita"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  className="bg-a-primary"
                  type={
                    field === "bornDate"
                      ? "date"
                      : field === "password"
                      ? "password"
                      : "text"
                  }
                  required
                  value={(newStaff as any)[field]}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      [field]: e.currentTarget.value,
                    })
                  }
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-2">
              <Form.Label>Ruolo</Form.Label>
              <Form.Select
                className="bg-a-primary pointer"
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, role: e.currentTarget.value })
                }
              >
                <option className="pointer" value="STAFF">
                  STAFF
                </option>
                <option className="pointer" value="ADMIN">
                  ADMIN
                </option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="customBtn"
              variant="secondary"
              onClick={() => setShowCreate(false)}
            >
              Annulla
            </Button>
            <Button
              className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-1 border-a-primary"
              variant="primary"
            >
              Salva
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Modifica Ruolo */}
      <Modal show={showAssign} onHide={() => setShowAssign(false)}>
        <Form onSubmit={handleAssign} className="bg-a-secondary text-a-primary">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Modifica Ruolo a {selectedUser?.username}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Ruolo</Form.Label>
              <Form.Select
                className="bg-a-primary pointer"
                value={assignRole.role}
                onChange={(e) => setAssignRole({ role: e.currentTarget.value })}
              >
                <option className="pointer" value="USER">
                  USER
                </option>
                <option className="pointer" value="STAFF">
                  STAFF
                </option>
                <option className="pointer" value="ADMIN">
                  ADMIN
                </option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="customBtn"
              variant="secondary"
              onClick={() => setShowAssign(false)}
            >
              Annulla
            </Button>
            <Button
              className="customBtn bg-a-quaternary btn-outline-a-primary text-a-primary border border-1 border-a-primary"
              type="submit"
              disabled={!selectedUser || selectedUser.id == null}
            >
              Assegna
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default BackOfficeUsersPage;
