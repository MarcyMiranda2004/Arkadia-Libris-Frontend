import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import LoginPageComponent from "./components/login/LoginPageComponent";

function App() {
  return (
    <BrowserRouter>
      <header className="bg-a-secondary">
        <NavbarComponent />
      </header>

      <main className="bg-a-primary">
        <Routes>
          <Route path="/auth/login" element={<LoginPageComponent />} />
        </Routes>
      </main>

      <footer></footer>
    </BrowserRouter>
  );
}

export default App;
