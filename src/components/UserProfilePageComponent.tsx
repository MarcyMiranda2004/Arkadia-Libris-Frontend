import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
  FloatingLabel,
  InputGroup,
  Image,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

interface User {
  id: number;
  name: string;
  surname: string;
  bornDate: string;
  username: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

export const UserPageComponent: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [formUser, setFormUser] = useState<Partial<User>>({});
  const [showEmail, setShowEmail] = useState(false);
  const [emailDto, setEmailDto] = useState({
    currentEmail: "",
    newEmail: "",
    confirmNewEmail: "",
    password: "",
  });
  const [showPhone, setShowPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [addrForm, setAddrForm] = useState<Partial<Address>>({});
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    async function fetchData() {
      try {
        const [uRes, aRes] = await Promise.all([
          fetch(`/users/${userId}`, { headers: authHeader }),
          fetch(`/users/${userId}/addresses`, { headers: authHeader }),
        ]);
        if (!uRes.ok || !aRes.ok)
          throw new Error("Errore nel caricamento dei dati");
        setUser(await uRes.json());
        setAddresses(await aRes.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(formUser),
      });
      if (!res.ok) throw new Error("Aggiornamento profilo fallito");
      setUser(await res.json());
      setShowEdit(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEmailSubmit = async () => {
    try {
      const res = await fetch(`/users/${userId}/email`, {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(emailDto),
      });
      if (!res.ok) throw new Error("Cambio email fallito");
      setShowEmail(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handlePhoneSubmit = async () => {
    try {
      const res = await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneValue }),
      });
      if (!res.ok) throw new Error("Cambio telefono fallito");
      setUser(await res.json());
      setShowPhone(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) return;
    const fd = new FormData();
    fd.append("file", avatarFile);
    try {
      const res = await fetch(`/users/${userId}/avatar`, {
        method: "PATCH",
        headers: authHeader,
        body: fd,
      });
      if (!res.ok) throw new Error("Upload avatar fallito");
      const url = await res.text();
      setUser((u) => u && { ...u, avatarUrl: url });
      setShowAvatar(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAddrSave = async () => {
    try {
      const method = editingAddr ? "PUT" : "POST";
      const url = editingAddr
        ? `/users/${userId}/addresses/${editingAddr.id}`
        : `/users/${userId}/addresses`;
      const res = await fetch(url, {
        method,
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(addrForm),
      });
      if (!res.ok) throw new Error("Salvataggio indirizzo fallito");
      await res.json();
      const aRes = await fetch(`/users/${userId}/addresses`, {
        headers: authHeader,
      });
      setAddresses(await aRes.json());
      setShowAddrModal(false);
      setEditingAddr(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAddrDelete = async (id: number) => {
    if (!window.confirm("Eliminare questo indirizzo?")) return;
    try {
      const res = await fetch(`/users/${userId}/addresses/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });
      if (!res.ok) throw new Error("Eliminazione fallita");
      setAddresses((addrs) => addrs.filter((a) => a.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <Container>Caricamento in corso…</Container>;
  if (error) return <Container className="text-danger">{error}</Container>;
  if (!user) return null;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <Image
                src={user.avatarUrl}
                roundedCircle
                width={120}
                height={120}
              />
              <Button variant="link" onClick={() => setShowAvatar(true)}>
                Cambia avatar
              </Button>
              <Card.Title>
                {user.name} {user.surname}
              </Card.Title>
              <Card.Text>
                Nato il: {user.bornDate}
                <br />
                Username: {user.username}
                <br />
                Email: {user.email}{" "}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowEmail(true)}
                >
                  Cambia
                </Button>
                <br />
                Telefono: {user.phoneNumber || "—"}{" "}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowPhone(true)}
                >
                  {user.phoneNumber ? "Modifica" : "Aggiungi"}
                </Button>
              </Card.Text>
              <Button
                onClick={() => {
                  setFormUser(user);
                  setShowEdit(true);
                }}
              >
                Modifica profilo
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>
              Indirizzi
              <Button
                className="float-end"
                size="sm"
                onClick={() => {
                  setAddrForm({});
                  setShowAddrModal(true);
                }}
              >
                + Nuovo
              </Button>
            </Card.Header>
            <ListGroup variant="flush">
              {addresses.map((a) => (
                <ListGroup.Item key={a.id}>
                  <strong>{a.name}</strong>
                  <br />
                  {a.street}, {a.city} ({a.province})<br />
                  {a.country} – {a.postalCode}
                  <br />
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingAddr(a);
                      setAddrForm(a);
                      setShowAddrModal(true);
                    }}
                  >
                    Modifica
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAddrDelete(a.id)}
                  >
                    Elimina
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Nome" className="mb-2">
            <Form.Control
              value={formUser.name || ""}
              onChange={(e) =>
                setFormUser((f) => ({ ...f, name: e.target.value }))
              }
            />
          </FloatingLabel>
          <FloatingLabel label="Cognome" className="mb-2">
            <Form.Control
              value={formUser.surname || ""}
              onChange={(e) =>
                setFormUser((f) => ({ ...f, surname: e.target.value }))
              }
            />
          </FloatingLabel>
          <FloatingLabel label="Data di nascita" className="mb-2">
            <Form.Control
              type="date"
              value={formUser.bornDate?.split("/").reverse().join("-") || ""}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split("-");
                setFormUser((f) => ({ ...f, bornDate: `${d}/${m}/${y}` }));
              }}
            />
          </FloatingLabel>
          <FloatingLabel label="Username" className="mb-2">
            <Form.Control
              value={formUser.username || ""}
              onChange={(e) =>
                setFormUser((f) => ({ ...f, username: e.target.value }))
              }
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEditSubmit}>Salva</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEmail} onHide={() => setShowEmail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambia email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="email"
            placeholder="Nuova email"
            className="mb-2"
            value={emailDto.newEmail}
            onChange={(e) =>
              setEmailDto((d) => ({ ...d, newEmail: e.target.value }))
            }
          />
          <Form.Control
            type="email"
            placeholder="Conferma nuova email"
            className="mb-2"
            value={emailDto.confirmNewEmail}
            onChange={(e) =>
              setEmailDto((d) => ({ ...d, confirmNewEmail: e.target.value }))
            }
          />
          <Form.Control
            type="password"
            placeholder="Password corrente"
            value={emailDto.password}
            onChange={(e) =>
              setEmailDto((d) => ({ ...d, password: e.target.value }))
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEmailSubmit}>Salva</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPhone} onHide={() => setShowPhone(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Telefono</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="tel"
            placeholder="Numero di telefono"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePhoneSubmit}>Salva</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAvatar} onHide={() => setShowAvatar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Carica avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                setAvatarFile(e.target.files[0]);
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAvatarSubmit}>Carica</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddrModal}
        onHide={() => {
          setShowAddrModal(false);
          setEditingAddr(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAddr ? "Modifica" : "Nuovo"} Indirizzo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(
            [
              "name",
              "street",
              "city",
              "province",
              "country",
              "postalCode",
            ] as const
          ).map((field) => (
            <FloatingLabel
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              className="mb-2"
            >
              <Form.Control
                value={(addrForm as any)[field] || ""}
                onChange={(e) =>
                  setAddrForm((f) => ({ ...f, [field]: e.target.value }))
                }
              />
            </FloatingLabel>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddrSave}>
            {editingAddr ? "Aggiorna" : "Aggiungi"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default UserPageComponent;
