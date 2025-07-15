import React, { useState, useContext, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  Google,
  Facebook,
  Instagram,
  Apple,
  Eye,
  EyeSlash,
} from "react-bootstrap-icons";
import { AuthContext } from "../../context/AuthContext";
import "../../style/login.scss";

interface LoginResponse {
  token: string;
  userId: number;
}

const API = "http://localhost:8080";

const LoginPageComponent: React.FC = () => {
  const { login: contextLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError(null);

    const formData = new FormData(ev.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      // 1) autenticazione
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        setError(errorBody.message || "Login fallito");
        return;
      }

      const { token, userId } = (await res.json()) as LoginResponse;

      // 2) recupero ruolo
      const profileRes = await fetch(`${API}/users/dto/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = (await profileRes.json()) as { role: string };

      // 3) aggiorno context
      contextLogin(token, userId, profile.role);

      // 4) redirect
      navigate(`/user-profile/${userId}`);
    } catch {
      setError("Errore di rete durante il login");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      <div className="d-flex flex-column align-items-center mb-3">
        <img
          src="https://i.pinimg.com/originals/29/cd/bd/29cdbdcc53da3e3c988ca9544fbfa03e.gif"
          alt="book_animation"
          className="w-50 rounded-5 border border-2 border-a-quaternary"
        />
        <p className="arsenica fst-italic">
          "tell me who you are, oh great seeker"
        </p>
      </div>
      <h1 className="arsenica text-a-secondary">Accedi al tuo account</h1>
      <form
        onSubmit={handleLogin}
        className="w-100 d-flex flex-column align-items-center mt-5"
      >
        <FloatingLabel
          controlId="floatingInput"
          label="Email"
          className="mb-2 w-50 formLabel rounded-pill"
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
          className="mt-2 w-50 formLabel position-relative rounded-pill"
        >
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="rounded-pill"
            required
          />
          <InputGroup.Text
            onClick={() => setShowPassword((v) => !v)}
            className="bg-transparent border-0 position-absolute top-50 translate-middle-y end-0 me-3 pointer"
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </InputGroup.Text>
        </FloatingLabel>

        {error && <div className="text-danger mt-2 mb-3">{error}</div>}

        <div className="d-flex justify-content-between align-items-center mt-2 w-50">
          <Link
            to="/auth/forgot-password"
            className="ms-4 text-decoration-none text-a-tertiary border-bottom border-a-tertiary small"
          >
            Hai dimenticato la Password?
          </Link>
          <Link
            to="/auth/register"
            className="me-4 text-a-quaternary fw-semibold pointer text-decoration-none border-bottom border-a-tertiary small"
          >
            Crea un account
          </Link>
        </div>

        <Button
          type="submit"
          className="mt-5 rounded-pill px-5 bg-a-quaternary border border-2 border-a-tertiary loginBtn"
        >
          Accedi
        </Button>
      </form>

      <div className="w-25 border-top border-2 border-a-tertiary mt-4 pt-4 d-flex flex-column align-items-center">
        <Button
          className="w-50 my-2 rounded-pill otherLoginBtn d-flex align-items-center justify-content-center"
          style={{ background: "#677DF9" }}
        >
          <Google size={16} className="me-2" />
          Accedi con Google
        </Button>
        <Button
          className="w-50 my-2 rounded-pill otherLoginBtn d-flex align-items-center justify-content-center"
          style={{ background: "#013475" }}
        >
          <Facebook size={16} className="me-2" />
          Accedi con Facebook
        </Button>
        <Button
          className="w-50 my-2 rounded-pill otherLoginBtn d-flex align-items-center justify-content-center"
          style={{ background: "#EB508D" }}
        >
          <Instagram size={16} className="me-2" />
          Accedi con Instagram
        </Button>
        <Button
          className="w-50 my-2 rounded-pill otherLoginBtn d-flex align-items-center justify-content-center"
          style={{ background: "#080808" }}
        >
          <Apple size={16} className="me-2" />
          Accedi con Apple
        </Button>
      </div>
    </div>
  );
};

export default LoginPageComponent;
