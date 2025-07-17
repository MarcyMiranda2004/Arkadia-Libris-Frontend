import React, { useState, useEffect } from "react";
import FormEvent from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:8080";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage: React.FC = () => {
  const query = useQuery();
  const token = query.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) navigate("/auth/forgot-password");
  }, [token, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || res.statusText);
      }
      setStatus("success");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h2>Reset Password</h2>
      {status === "success" ? (
        <>
          <Alert variant="success">Password aggiornata con successo!</Alert>
          <Button onClick={() => navigate("/auth/login")}>
            Torna al Login
          </Button>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>Nuova Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Min 8 caratteri, 1 maiusc, 1 num, 1 simbolo"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Conferma Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ripeti la password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button
            type="submit"
            disabled={status === "submitting"}
            className="w-100"
          >
            {status === "submitting" ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Aggiorna Password"
            )}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default ResetPasswordPage;
