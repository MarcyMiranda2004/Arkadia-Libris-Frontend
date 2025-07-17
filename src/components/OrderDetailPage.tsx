import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import type { OrderDetailDto } from "../type/OrderDetailDto";
import "../style/userProfilePage.scss";

const API = "http://localhost:8080";

const OrderDetailPage: React.FC = () => {
  const { token, userId } = useContext(AuthContext);
  const { userId: paramUid, orderId } = useParams<{
    userId: string;
    orderId: string;
  }>();
  const uid = paramUid ?? userId?.toString();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !orderId || !token) return;

    setLoading(true);
    fetch(`${API}/users/${uid}/orders/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          throw new Error("Non autorizzato");
        }
        if (!res.ok) {
          throw new Error(`Errore ${res.status}`);
        }
        return res.json();
      })
      .then((dto: OrderDetailDto) => {
        setOrder(dto);
      })
      .catch((e) => {
        setError(e.message);
        if (e.message === "Non autorizzato") {
          navigate("/auth/login");
        }
      })
      .finally(() => setLoading(false));
  }, [uid, orderId, token, navigate]);

  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  if (!order)
    return (
      <Container className="mt-5">
        <Alert>Nessun dettaglio disponibile</Alert>
      </Container>
    );

  const total = typeof order.totalAmmount === "number" ? order.totalAmmount : 0;

  return (
    <Container className="mt-5">
      <Button
        className="customBtn bg-a-quaternary btn-outline-a-primary border border-2 border-a-secondary text-a-primary"
        onClick={() => navigate(-1)}
      >
        ← Torna indietro
      </Button>

      <Card className="mt-3 p-4 userInfoTab border border-1 border-a-secondary">
        <h3>Ordine #{order.orderId}</h3>
        <p>Data: {new Date(order.orderDate).toLocaleDateString()}</p>
        <p>Stato: {order.orderStatus}</p>

        <h5>Indirizzo di spedizione</h5>
        <p>
          {order.shippingAddress?.name || "N/D"}
          <br />
          {order.shippingAddress?.street || ""}
          {order.shippingAddress ? `, ${order.shippingAddress.city}` : ""} (
          {order.shippingAddress?.province})<br />
          {order.shippingAddress?.country} – {order.shippingAddress?.postalCode}
        </p>

        {order.billingAddress && (
          <>
            <h5>Indirizzo di fatturazione</h5>
            <p>
              {order.billingAddress.name}
              <br />
              {order.billingAddress.street}, {order.billingAddress.city} (
              {order.billingAddress.province})<br />
              {order.billingAddress.country} – {order.billingAddress.postalCode}
            </p>
          </>
        )}

        <h5>Articoli Ordinati</h5>
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Prodotto</th>
              <th className="text-center">Quantità</th>
              <th className="text-end">Prezzo unitario</th>
              <th className="text-end">Subtotale</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => {
              const quantity = it.quantity;
              const price = it.price ?? "---";
              return (
                <tr key={it.productId}>
                  <td>{it.productName || "—"}</td>
                  <td className="text-center">{quantity}</td>
                  <td className="text-end">€{price.toFixed(2)}</td>
                  <td className="text-end">€{(quantity * price).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Totale
              </td>
              <td className="text-end fw-bold">€{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </Table>
      </Card>
    </Container>
  );
};

export default OrderDetailPage;
