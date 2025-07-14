// src/components/UserPageComponent.tsx
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

  // Stub handlers; implement as needed
  const handleEditSubmit = async () => {
    /* … */
  };
  const handleEmailSubmit = async () => {
    /* … */
  };
  const handlePhoneSubmit = async () => {
    /* … */
  };
  const handleAvatarSubmit = async () => {
    /* … */
  };
  const handleAddrSave = async () => {
    /* … */
  };
  const handleAddrDelete = async (id: number) => {
    /* … */
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
              md={3}
              className="text-center text-md-start mb-4 mb-md-0"
            >
              <Image
                src={user.avatarUrl}
                width={200}
                className="rounded-4 pointer userImg"
                onClick={() => setShowAvatar(true)}
              />
            </Col>

            <Col
              xs={12}
              md={8}
              className="justify-content-start align-items-start text-start position-relative"
            >
              <div>
                <h3 className="arsenica-bold">
                  {user.name} {user.surname}
                  <Button
                    className="btn-a-quaternary p-0 mx-5"
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
                    <PencilSquare size={14} className="m-2" />
                  </Button>
                </h3>

                <p>
                  <span className="arsenica-bold">Data Di Nascita:</span>
                  {(() => {
                    if (!user.bornDate) return "dd/mm/yyyy";
                    const date = parseISO(user.bornDate);
                    return isValid(date)
                      ? format(date, "dd/MM/yyyy")
                      : user.bornDate;
                  })()}
                </p>

                <p>
                  <span className="arsenica-bold">Username:</span>{" "}
                  {user.username}
                </p>

                <p>
                  <span className="arsenica-bold">Email:</span> {user.email}
                  <PencilFill
                    size={12}
                    className="pointer mx-2"
                    onClick={() => setShowEmail(true)}
                  />
                </p>

                <p>
                  <span className="arsenica-bold">Telefono:</span>
                  {user.phoneNumber || " ---"}
                  <PencilFill
                    size={12}
                    className="pointer mx-2"
                    onClick={() => setShowEmail(true)}
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
                className="float-end p-0 bg-a-quaternary"
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
                      {a.street}, {a.city} ({a.province})
                      <br />
                      {a.country} – {a.postalCode}
                    </div>

                    <div className="d-flex flex-column mx-3">
                      <PencilSquare
                        size={16}
                        className="m-2 text-a-quaternary pointer"
                        onClick={() => {
                          setEditingAddr(a);
                          setAddrForm(a);
                          setShowAddrModal(true);
                        }}
                      />

                      <Trash3Fill
                        size={16}
                        className="m-2 text-a-danger pointer"
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

      {/* TODO: insert Modal components here (Edit profile, Change email, Change phone, Change avatar, Address form) */}
    </Container>
  );
};

export default UserPageComponent;
