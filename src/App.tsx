import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import NotFoundPage from "./components/NotFoundPageComponent";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import LoginPageComponent from "./components/login-registration/LoginPageComponent";
import RegisterPageComponent from "./components/login-registration/RegistrationPageComponent";
import UserPageComponent from "./components/UserProfilePageComponent";
import HomePageComponent from "./components/HomePageComponent";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <header className="bg-a-secondary">
            <NavbarComponent />
          </header>

          <main className="bg-a-primary p-1">
            <Routes>
              <Route path="/auth/login" element={<LoginPageComponent />} />
              <Route
                path="/auth/register"
                element={<RegisterPageComponent />}
              />
              <Route
                path="/user-profile/:userId"
                element={<UserPageComponent />}
              />
              <Route path="/home" element={<HomePageComponent />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <footer className="bg-a-secondary vw-100">
            <FooterComponent />
          </footer>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
