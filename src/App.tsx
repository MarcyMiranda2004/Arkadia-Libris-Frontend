import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavbarComponent from "./components/NavbarComponent";
import LoginPageComponent from "./components/login-registration/LoginPageComponent";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <header className="bg-a-secondary">
          <NavbarComponent />
        </header>

        <main className="bg-a-primary">
          <Routes>
            <Route path="/auth/login" element={<LoginPageComponent />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
