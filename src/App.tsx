import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NotFoundPage from "./components/NotFoundPageComponent";
import NavbarComponent from "./components/NavbarComponent";
import LoginPageComponent from "./components/login-registration/LoginPageComponent";
import RegisterPageComponent from "./components/login-registration/RegistrationPageComponent";
import UserPageComponent from "./components/UserProfilePageComponent";

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
            <Route path="/auth/register" element={<RegisterPageComponent />} />
            {/* <Route
              path="/user-profile/:userId"
              element={<UserPageComponent />}
            /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
