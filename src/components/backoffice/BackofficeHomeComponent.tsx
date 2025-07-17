import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../style/backoffice/backOfficeDashboard.scss";

const BackofficeHome: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, token } = useContext(AuthContext);
  const isBackofficeUser =
    token && (userRole === "ADMIN" || userRole === "STAFF");

  useEffect(() => {
    if (!isBackofficeUser) {
      navigate("/unauthorized");
    }
  }, [isBackofficeUser, navigate]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center bg-a-secondary text-a-primary arsenica fs-1 border border-3 border-a-quaternary rounded-pill p-2">
        Backoffice Dashboard
      </h2>
      <Row xs={1} md={3} className="g-4">
        <Col>
          <Card
            className="h-100 text-center tab pointer"
            onClick={() => navigate("/backoffice/products")}
          >
            <Card.Body>
              <Card.Title>"Vedi e gestisci Prodotti"</Card.Title>
              <Card.Text>
                Clicca qui per Vedere, Aggiungere, Modificare o Eliminare dei
                Prodotti
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card
            className="h-100 text-center tab pointer"
            onClick={() => navigate("/backoffice/users")}
          >
            <Card.Body>
              <Card.Title>"Vedi e gestisci Utenti"</Card.Title>
              <Card.Text>
                Clicca qui per visualizzare tutti gli utenti, assegna ruoli e
                gestisci account.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card
            className="h-100 text-center tab pointer"
            onClick={() => navigate("/backoffice/stock")}
          >
            <Card.Body>
              <Card.Title>"Vedi e gestisci Stock"</Card.Title>
              <Card.Text>
                Clicca qui per controllare le quantità disponibili e aggiorna le
                scorte del magazzino.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BackofficeHome;
