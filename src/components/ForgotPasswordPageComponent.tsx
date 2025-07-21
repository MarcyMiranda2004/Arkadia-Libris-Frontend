import React, { useState } from "react";
import FormEvent from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/password.scss";

const API = "http://localhost:8080";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || res.statusText);
      }
      setStatus("sent");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="d-flex justify-content-center ">
      <div
        className="mt-5 bg-a-secondary border border-2 border-a-quaternary rounded-3 d-flex flex-column p-3 text-a-primary arsenica w-100"
        style={{ maxWidth: 400 }}
      >
        <h2>Recupera Password</h2>
        {status === "sent" ? (
          <Alert variant="success">
            Se l’email esiste, hai ricevuto un link per resettare la password.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="forgotEmail" className="mb-3">
              <Form.Label className="formLabel">Indirizzo Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button
              type="submit"
              disabled={status === "sending"}
              className="w-100 sendBtn bg-a-quaternary btn-outline-a-secondary text-a-primary border border-1 border-a-primary"
            >
              {status === "sending" ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Invia link di reset"
              )}
            </Button>
            <Button
              variant="link"
              className="mt-2 p-0 text-a-quaternary text-decoration-none"
              onClick={() => navigate(-1)}
            >
              ← Torna indietro
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
