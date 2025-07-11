import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  Eye,
  EyeSlash,
  Google,
  Facebook,
  Instagram,
  Apple,
} from "react-bootstrap-icons";
import "../../style/registratio.scss";

const RegisterPageComponent: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError(null);

    const formData = new FormData(ev.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    // trasforma la data
    if (payload.bornDate) {
      const [year, month, day] = payload.bornDate.split("-");
      payload.bornDate = `${day}/${month}/${year}`;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Registrazione fallita");
        return;
      }

      navigate("/auth/login");
    } catch {
      setError("Errore di rete durante la registrazione");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <div className="d-flex flex-column justify-content-center align-items-center mb-3">
        <img
          src="https://i.pinimg.com/originals/29/cd/bd/29cdbdcc53da3e3c988ca9544fbfa03e.gif"
          alt="book_animation"
          className="w-50 rounded-5 border border-2 border-a-quaternary"
        />
        <p className="arsenica fst-italic">
          "tell me who you are, oh great seeker"
        </p>
      </div>
      <h1 className="arsenica text-a-secondary">Crea il tuo account</h1>
      <Form
        onSubmit={register}
        className="w-100 d-flex flex-column align-items-center mt-4"
      >
        <FloatingLabel
          controlId="floatingName"
          label="Nome"
          className="mb-3 w-50 formLabel rounded-pill"
        >
          <Form.Control
            type="text"
            name="name"
            placeholder="Nome"
            className="rounded-pill"
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingSurname"
          label="Cognome"
          className="mb-3 w-50 formLabel rounded-pill"
        >
          <Form.Control
            type="text"
            name="surname"
            placeholder="Cognome"
            className="rounded-pill"
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingBornDate"
          label="Data di nascita"
          className="mb-3 w-50 formLabel rounded-pill"
        >
          <Form.Control
            type="date"
            name="bornDate"
            placeholder="Data di nascita"
            className="rounded-pill"
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingUsername"
          label="Username"
          className="mb-3 w-50 formLabel rounded-pill"
        >
          <Form.Control
            type="text"
            name="username"
            placeholder="Username"
            className="rounded-pill"
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingEmail"
          label="Email"
          className="mb-3 w-50 formLabel rounded-pill"
        >
          <Form.Control
            type="email"
            name="email"
            placeholder="name@example.com"
            className="rounded-pill"
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="mb-3 w-50 position-relative formLabel rounded-pill"
        >
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="rounded-pill pe-5"
            required
          />
          <InputGroup.Text
            onClick={() => setShowPassword((v) => !v)}
            className="position-absolute top-50 end-0 me-3 bg-transparent border-0 pointer"
            style={{ transform: "translateY(-50%)" }}
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </InputGroup.Text>
        </FloatingLabel>

        {error && <p className="text-danger mb-3">{error}</p>}

        <Button
          type="submit"
          className="mt-3 rounded-pill px-5 bg-a-quaternary border-2 loginBtn"
        >
          Registrati
        </Button>

        <p className="mt-3">
          Hai già un account?{" "}
          <Link to="/auth/login" className="text-a-tertiary">
            Accedi
          </Link>
        </p>
      </Form>
    </Container>
  );
};

export default RegisterPageComponent;
