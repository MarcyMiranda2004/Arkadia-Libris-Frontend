import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import NotFoundPage from "./components/NotFoundPageComponent";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import LoginPageComponent from "./components/login-registration/LoginPageComponent";
import RegisterPageComponent from "./components/login-registration/RegistrationPageComponent";
import UserPageComponent from "./components/UserProfilePageComponent";
import HomePageComponent from "./components/HomePageComponent";
import CheckoutPageComponent from "./components/CheckoutPageComponent";
import WishlistPageComponent from "./components/WishlistPageComponent";
import SearchPage from "./components/SearchPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import ProductDetailPage from "./components/ProductDetailPage";
import OrderDetailPage from "./components/OrderDetailPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
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
                <Route
                  path="/users/:userId/orders/:orderId"
                  element={<OrderDetailPage />}
                />

                <Route
                  path="/users/:userId/wishlist"
                  element={<WishlistPageComponent />}
                />
                <Route path="/home" element={<HomePageComponent />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPageComponent />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/auth/reset-password"
                  element={<ResetPasswordPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <footer className="bg-a-secondary vw-100">
              <FooterComponent />
            </footer>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
