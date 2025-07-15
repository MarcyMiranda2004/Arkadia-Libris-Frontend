import React, { useState, useEffect, useContext, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Modal,
  Form,
  FloatingLabel,
  Image,
} from "react-bootstrap";
import { parseISO, format, isValid } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../type/UserObject";
import type { Address } from "../type/AddressObject";
import "../style/userProfilePage.scss";
import {
  PencilFill,
  PencilSquare,
  Trash3Fill,
  Plus,
} from "react-bootstrap-icons";

const API = "http://localhost:8080";

const UserPageComponent: React.FC = () => {
  const { token, userId: ctxId } = useContext(AuthContext);
  const { userId: paramId } = useParams<{ userId: string }>();
  const uid = paramId ?? ctxId?.toString();

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
    if (!uid) {
      setError("User ID non disponibile");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API}/users/dto/${uid}`, {
          headers: authHeader,
        });
        if (!res.ok) {
          throw new Error(`Errore caricamento dati: ${res.status}`);
        }
        const userData: User = await res.json();
        setUser(userData);

        const aRes = await fetch(`${API}/users/${uid}/addresses`, {
          headers: authHeader,
        });
        if (!aRes.ok) {
          throw new Error(`Errore caricamento indirizzi: ${aRes.status}`);
        }
        const addrs = await aRes.json();
        setAddresses(addrs);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  const handleEditSubmit = async () => {
    try {
      let formattedDate: string | undefined = undefined;
      if (formUser.bornDate) {
        const [year, month, day] = formUser.bornDate.split("-");
        formattedDate = `${day}/${month}/${year}`;
      }

      const payload = {
        name: formUser.name,
        surname: formUser.surname,
        username: formUser.username,
        bornDate: formattedDate,
      };

      const res = await fetch(`${API}/users/${uid}`, {
        method: "PUT",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Errore ${res.status}`);
      }

      const updatedUser: User = await res.json();
      setUser(updatedUser);

      setShowEdit(false);
    } catch (err: any) {
      alert(`Impossibile salvare le modifiche: ${err.message}`);
      console.error(err);
    }
  };

  const handleEmailSubmit = async () => {
    if (emailDto.newEmail !== emailDto.confirmNewEmail) {
      alert("Le email non corrispondono");
      return;
    }

    try {
      const payload = {
        password: emailDto.password,
        currentEmail: emailDto.currentEmail,
        newEmail: emailDto.newEmail,
        confirmNewEmail: emailDto.confirmNewEmail,
      };

      const res = await fetch(`${API}/users/${uid}/email`, {
        method: "PUT",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Errore ${res.status}`);
      }

      setUser((u) => u && { ...u, email: emailDto.newEmail });
      setShowEmail(false);
      setEmailDto({
        currentEmail: "",
        newEmail: "",
        confirmNewEmail: "",
        password: "",
      });
    } catch (err: any) {
      alert(`Impossibile aggiornare l’email: ${err.message}`);
      console.error(err);
    }
  };

  const handlePhoneSubmit = async () => {
    try {
      const payload = { phoneNumber: phoneValue };
      const res = await fetch(`${API}/users/${uid}/phone`, {
        method: "PATCH",
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Errore ${res.status}`);
      }

      setUser((u) => u && { ...u, phoneNumber: phoneValue });
      setShowPhone(false);
      setPhoneValue("");
    } catch (err: any) {
      alert(`Impossibile aggiornare il telefono: ${err.message}`);
      console.error(err);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) return;

    try {
      const formData = new FormData();
      formData.append("file", avatarFile);

      const res = await fetch(`${API}/users/${uid}/avatar`, {
        method: "PATCH",
        headers: {
          ...authHeader,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Errore ${res.status}`);
      }

      const newUrl = await res.text();
      setUser((u) => u && { ...u, avatarUrl: newUrl });
      setShowAvatar(false);
      setAvatarFile(null);
    } catch (err: any) {
      alert(`Impossibile aggiornare l'avatar: ${err.message}`);
      console.error(err);
    }
  };

  const handleAddrSave = async () => {
    try {
      const method = editingAddr ? "PUT" : "POST";
      const url = editingAddr
        ? `${API}/users/${uid}/addresses/${editingAddr.id}`
        : `${API}/users/${uid}/addresses`;

      const res = await fetch(url, {
        method,
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addrForm),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Errore ${res.status}`);
      }

      const listRes = await fetch(`${API}/users/${uid}/addresses`, {
        headers: authHeader,
      });
      if (!listRes.ok) {
        throw new Error(`Errore caricamento indirizzi: ${listRes.status}`);
      }
      const updatedAddrs: Address[] = await listRes.json();
      setAddresses(updatedAddrs);

      setShowAddrModal(false);
      setAddrForm({});
      setEditingAddr(null);
    } catch (err: any) {
      alert(`Impossibile salvare l'indirizzo: ${err.message}`);
      console.error(err);
    }
  };

  const handleAddrDelete = async (id: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo indirizzo?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/users/${uid}/addresses/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Errore ${res.status}`);
      }

      setAddresses((addrs) => addrs.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Impossibile eliminare l'indirizzo: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) return <Container>Caricamento in corso…</Container>;
  if (error) return <Container className="text-danger">{error}</Container>;
  if (!user) return null;

  return (
    <Container className="mt-4">
      <Row>
        {/* Avatar & personal info */}
        <Container className="bg-white p-4 rounded-3 mb-4 border border-1 border-a-tertiary userInfoTab">
          <Row>
            <Col
              xs={12}
              md={4}
              lg={3}
              className="text-center text-md-start mb-4 mb-md-0"
            >
              <Image
                src={user.avatarUrl}
                width={200}
                className="rounded-4 pointer userImg"
                onClick={() => setShowAvatar(true)}
              />
            </Col>

            <Col xs={12} md={8} lg={9} className="text-start">
              <div className="d-flex flex-column align-items-center align-items-md-start">
                <div className="border-bottom border-1 border-a-secondary w-38 mb-3 text-center text-md-start">
                  <h3 className="arsenica-bold">
                    {user.name} {user.surname}
                    <PencilFill
                      size={14}
                      className="pointer m-2 icon"
                      onClick={() => {
                        setFormUser({
                          name: user.name,
                          surname: user.surname,
                          bornDate: user.bornDate,
                          username: user.username,
                        });
                        setShowEdit(true);
                      }}
                    />
                  </h3>
                  <p>
                    <strong>Data Di Nascita:</strong>{" "}
                    {user.bornDate
                      ? isValid(parseISO(user.bornDate))
                        ? format(parseISO(user.bornDate), "dd/MM/yyyy")
                        : user.bornDate
                      : "dd/mm/yyyy"}
                  </p>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                </div>
                <p>
                  <strong>Email:</strong> {user.email}{" "}
                  <PencilFill
                    size={12}
                    className="pointer mx-2 icon"
                    onClick={() => setShowEmail(true)}
                  />
                </p>
                <p>
                  <strong>Telefono:</strong> {user.phoneNumber || " ---"}{" "}
                  <PencilFill
                    size={12}
                    className="pointer mx-2 icon"
                    onClick={() => setShowPhone(true)}
                  />
                </p>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Addresses */}
        <Container className="p-0 mb-3">
          <div className="bg-secondary-subtle rounded p-0 userInfoTab border border-1 border-a-tertiary">
            <h3 className="arsenica-bold p-3 border-bottom border-2 border-a-tertiary m-0">
              Indirizzi
              <Button
                className="float-end p-0 bg-a-quaternary customBtn"
                onClick={() => {
                  setAddrForm({});
                  setEditingAddr(null);
                  setShowAddrModal(true);
                }}
              >
                <Plus size={30} />
              </Button>
            </h3>
            <ListGroup variant="flush">
              {addresses.map((a) => (
                <ListGroup.Item key={a.id}>
                  <div className="d-flex align-items-center border-bottom border-a-tertiary py-2">
                    <div>
                      <strong>{a.name}</strong>
                      <br />
                      {a.street}, {a.city} ({a.province})<br />
                      {a.country} – {a.postalCode}
                    </div>
                    <div className="d-flex flex-column mx-3">
                      <PencilSquare
                        size={16}
                        className="m-2 text-a-quaternary pointer icon"
                        onClick={() => {
                          setEditingAddr(a);
                          setAddrForm(a);
                          setShowAddrModal(true);
                        }}
                      />
                      <Trash3Fill
                        size={16}
                        className="m-2 text-a-danger pointer icon"
                        onClick={() => handleAddrDelete(a.id)}
                      />
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Container>
      </Row>

      {/* ——— MODALI ——— */}

      {/* Modifica Profilo */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-a-secondary text-a-primary arsenica"
        >
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-a-secondary text-a-primary arsenica">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit();
            }}
          >
            <FloatingLabel label="Nome" className="mb-3">
              <Form.Control
                value={formUser.name || ""}
                onChange={(e) =>
                  setFormUser((f) => ({ ...f, name: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Cognome" className="mb-3">
              <Form.Control
                value={formUser.surname || ""}
                onChange={(e) =>
                  setFormUser((f) => ({ ...f, surname: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Username" className="mb-3">
              <Form.Control
                value={formUser.username || ""}
                onChange={(e) =>
                  setFormUser((f) => ({ ...f, username: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel
              label="Data di Nascita (YYYY-MM-DD)"
              className="mb-3"
            >
              <Form.Control
                type="date"
                value={formUser.bornDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setFormUser((f) => ({ ...f, bornDate: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary text-a-primary customBtn"
            >
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Cambia Email */}
      <Modal show={showEmail} onHide={() => setShowEmail(false)}>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-a-secondary text-a-primary arsenica"
        >
          <Modal.Title>Cambia Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-a-secondary text-a-primary arsenica">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailSubmit();
            }}
          >
            <FloatingLabel label="Email Attuale" className="mb-3">
              <Form.Control
                type="email"
                value={emailDto.currentEmail}
                onChange={(e) =>
                  setEmailDto((d) => ({ ...d, currentEmail: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Nuova Email" className="mb-3">
              <Form.Control
                type="email"
                value={emailDto.newEmail}
                onChange={(e) =>
                  setEmailDto((d) => ({ ...d, newEmail: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Conferma Nuova Email" className="mb-3">
              <Form.Control
                type="email"
                value={emailDto.confirmNewEmail}
                onChange={(e) =>
                  setEmailDto((d) => ({
                    ...d,
                    confirmNewEmail: e.target.value,
                  }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                value={emailDto.password}
                onChange={(e) =>
                  setEmailDto((d) => ({ ...d, password: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary text-a-primary customBtn"
            >
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Cambia Phone */}
      <Modal show={showPhone} onHide={() => setShowPhone(false)}>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-a-secondary text-a-primary arsenica"
        >
          <Modal.Title>Cambia Telefono</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-a-secondary text-a-primary arsenica">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handlePhoneSubmit();
            }}
          >
            <FloatingLabel label="Nuovo Telefono" className="mb-3">
              <Form.Control
                type="tel"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary text-a-primary customBtn"
            >
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Cambia Avatar */}
      <Modal show={showAvatar} onHide={() => setShowAvatar(false)}>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-a-secondary text-a-primary arsenica"
        >
          <Modal.Title>Cambia Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-a-secondary text-a-primary arsenica">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleAvatarSubmit();
            }}
          >
            <Form.Group controlId="avatarFile" className="mb-3">
              <Form.Label>Seleziona un file</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="bg-a-primary formLabel"
              />
            </Form.Group>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary text-a-primary customBtn"
            >
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Aggiungi / Modifica Address */}
      <Modal show={showAddrModal} onHide={() => setShowAddrModal(false)}>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-a-secondary text-a-primary arsenica"
        >
          <Modal.Title>
            {editingAddr ? "Modifica Indirizzo" : "Aggiungi Indirizzo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-a-secondary text-a-primary arsenica">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddrSave();
            }}
          >
            <FloatingLabel label="Nome indirizzo" className="mb-3">
              <Form.Control
                value={addrForm.name || ""}
                onChange={(e) =>
                  setAddrForm((a) => ({ ...a, name: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Via / Piazza" className="mb-3">
              <Form.Control
                value={addrForm.street || ""}
                onChange={(e) =>
                  setAddrForm((a) => ({ ...a, street: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Città" className="mb-3">
              <Form.Control
                value={addrForm.city || ""}
                onChange={(e) =>
                  setAddrForm((a) => ({ ...a, city: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Provincia" className="mb-3">
              <Form.Control
                value={addrForm.province || ""}
                onChange={(e) =>
                  setAddrForm((a) => ({ ...a, province: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="CAP" className="mb-3">
              <Form.Control
                value={addrForm.postalCode || ""}
                onChange={(e) =>
                  setAddrForm((a) => ({ ...a, postalCode: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <FloatingLabel label="Nazione" className="mb-3">
              <Form.Control
                value={addrForm.country || ""}
                onChange={(e) =>
                  setAddrForm((a) => ({ ...a, country: e.target.value }))
                }
                className="bg-a-primary formLabel"
              />
            </FloatingLabel>
            <Button
              type="submit"
              className="bg-a-quaternary btn-outline-a-secondary text-a-primary customBtn"
            >
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserPageComponent;
