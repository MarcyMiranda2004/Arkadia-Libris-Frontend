import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import "../style/checkout.scss";

const stripePromise = loadStripe(
  "pk_test_51RiccBClz26JU3VakakUIEs1GCKIp106eFwCPxufoiDS9aN6saYUX9lvqLBEBIqpZJ0AnSjVjodNf1ZZz6OouCjC008q9UVJKq"
);

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const { token, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(
    null
  );
  const [billingAddressId, setBillingAddressId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch(
          `http://localhost:8080/users/${userId}/addresses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok)
          throw new Error(`Errore fetching addresses: ${res.status}`);
        const data: Address[] = await res.json();
        setAddresses(data);
        if (data.length > 0) {
          setShippingAddressId(data[0].id);
          setBillingAddressId(data[0].id);
        }
      } catch (e: any) {
        console.error(e);
      }
    }
    if (userId && token) fetchAddresses();
  }, [userId, token]);

  const total =
    cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!shippingAddressId) {
      setError("Seleziona un indirizzo di spedizione");
      return;
    }
    setLoadingOrder(true);
    setError(null);

    try {
      const orderRes = await fetch(
        `http://localhost:8080/users/${userId}/orders/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddressId,
            billingAddressId,
          }),
        }
      );
      if (!orderRes.ok)
        throw new Error(`Errore creazione ordine: ${orderRes.status}`);
      const orderData = await orderRes.json();

      const intentRes = await fetch(
        `http://localhost:8080/payments/create-intent`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            currency: "EUR",
            orderId: orderData.orderId,
          }),
        }
      );
      if (!intentRes.ok)
        throw new Error(`Errore Payment Intent: ${intentRes.status}`);
      const { clientSecret } = await intentRes.json();

      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Elemento carta non disponibile");
      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card },
        }
      );
      if (stripeError) throw stripeError;

      clearCart();
      navigate(`/user-profile/${userId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <>
      <Container className="p-0 mb-0 mt-5 rounded-top-3 checkoutTab border border-top-2 border-a-quaternary">
        <h2 className="bg-a-secondary text-a-primary arsenica p-2 rounded-top-3 mb-0">
          Checkout
        </h2>
      </Container>
      <Container className="bg-white p-4 rounded-bottom-3 checkoutTab border border-bottom-2 border-a-quaternary">
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          <Col md={6} className="border-end border-2 border-a-secondary">
            <h4>Riepilogo</h4>
            {cart?.items.map((item) => (
              <div
                key={item.productId}
                className="d-flex justify-content-between"
              >
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Totale:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <Form>
              <Form.Group className="mb-3 pointer">
                <Form.Label>Indirizzo di spedizione</Form.Label>
                <Form.Select
                  className="pointer"
                  value={shippingAddressId ?? ""}
                  onChange={(e) =>
                    setShippingAddressId(Number(e.currentTarget.value))
                  }
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name}: {addr.street}, {addr.city}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 pointer">
                <Form.Label>Indirizzo di fatturazione</Form.Label>
                <Form.Select
                  className="pointer"
                  value={billingAddressId ?? ""}
                  onChange={(e) =>
                    setBillingAddressId(Number(e.currentTarget.value))
                  }
                >
                  <option value="">Come spedizione</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name}: {addr.street}, {addr.city}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Pagamento</Form.Label>
                <div className="border p-2">
                  <CardElement options={{ hidePostalCode: true }} />
                </div>
              </Form.Group>
              <Button
                type="submit"
                disabled={!stripe || loadingOrder}
                className="mt-3 bg-a-quaternary btn-outline-light text-a-primary payBtn"
              >
                {loadingOrder ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Paga ora"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const CheckoutPageComponent: React.FC = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPageComponent;
