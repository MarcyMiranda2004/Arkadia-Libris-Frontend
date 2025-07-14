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
  Image,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { parseISO, format } from "date-fns";
import type { User } from "../type/UserObject";
import type { Address } from "../type/AddressObject";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

const UserPageComponent: React.FC = () => {
  const { token, userId: ctxId } = useContext(AuthContext);
  const { userId: paramId } = useParams<{ userId: string }>();
  const uid = paramId ?? ctxId?.toString();

  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stati per le varie modali
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
    if (!uid) {
      setError("User ID non disponibile");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [uRes, aRes] = await Promise.all([
          fetch(`${API}/users/${uid}`, { headers: authHeader }),
          fetch(`${API}/users/${uid}/addresses`, { headers: authHeader }),
        ]);
        if (!uRes.ok || !aRes.ok) throw new Error("Errore caricamento dati");
        setUser(await uRes.json());
        setAddresses(await aRes.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  const handleEditSubmit = async () => {
    /* … PUT /users/:uid … */
  };
  const handleEmailSubmit = async () => {
    /* … PUT /users/:uid/email … */
  };
  const handlePhoneSubmit = async () => {
    /* … PUT /users/:uid … */
  };
  const handleAvatarSubmit = async () => {
    /* … PATCH /users/:uid/avatar … */
  };
  const handleAddrSave = async () => {
    /* … POST|PUT /users/:uid/addresses … */
  };
  const handleAddrDelete = async (id: number) => {
    /* … DELETE /users/:uid/addresses/:id … */
  };

  if (loading) return <Container>Caricamento in corso…</Container>;
  if (error) return <Container className="text-danger">{error}</Container>;
  if (!user) return null;

  return (
    <Container className="mt-4">
      <Row>
        {/* Colonna avatar + dati personali */}
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <Image
                src={user.avatarUrl || "/default-avatar.png"}
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
                Nato il:{" "}
                {user.bornDate
                  ? format(parseISO(user.bornDate), "dd/MM/yyyy")
                  : "—"}
                <br />
                Username: {user.username}
                <br />
                Email: {user.email}{" "}
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setShowEmail(true)}
                >
                  Cambia
                </Button>
                <br />
                Telefono: {user.phoneNumber || "—"}{" "}
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setShowPhone(true)}
                >
                  {user.phoneNumber ? "Modifica" : "Aggiungi"}
                </Button>
              </Card.Text>
              <Button
                onClick={() => {
                  setFormUser({
                    name: user.name,
                    surname: user.surname,
                    bornDate: user.bornDate,
                    username: user.username,
                  });
                  setShowEdit(true);
                }}
              >
                Modifica profilo
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Colonna indirizzi */}
        <Col md={8}>
          <Card>
            <Card.Header>
              Indirizzi
              <Button
                className="float-end"
                size="sm"
                onClick={() => {
                  setAddrForm({});
                  setEditingAddr(null);
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

      {/* → Inserisci qui tutti i <Modal> per edit/profile/email/phone/avatar/address ← */}
    </Container>
  );
};

export default UserPageComponent;
