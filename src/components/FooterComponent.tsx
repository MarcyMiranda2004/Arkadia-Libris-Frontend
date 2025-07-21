import { Container, Row, Col, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  EnvelopeAtFill,
  Facebook,
  Instagram,
  TwitterX,
  Whatsapp,
} from "react-bootstrap-icons";
import logo from "../assets/png/logos/logo-no-bg.svg";

const FooterComponent = () => {
  return (
    <Container fluid className="p-4">
      <Container>
        {/* DESKTOP */}
        <Row className="d-none d-md-flex">
          <Col md={3} className="d-flex flex-column">
            <h5 className="arsenica text-a-primary fs-4">Su di Noi:</h5>
            <address className="arsenica text-a-primary mb-1">
              Arkadia Libris
            </address>
            <address className="arsenica text-a-primary mb-1">
              Via Roma, 12
            </address>
            <address className="arsenica text-a-primary mb-3">
              00045 Roma – Italia
            </address>
            <Link to="/chi-siamo" className="arsenica text-a-primary my-1">
              Chi siamo
            </Link>
            <Link
              to="/termini-e-condizion"
              className="arsenica text-a-primary my-1"
            >
              Termini e Condizioni
            </Link>
            <Link to="/contatti" className="arsenica text-a-primary my-1">
              Contatti
            </Link>
            <p className="arsenica text-a-primary mt-2">
              &copy; Arkadia Libris - 2025
            </p>
          </Col>

          <Col md={3} className="d-flex flex-column">
            <h5 className="arsenica text-a-primary fs-4">Social e Contatti</h5>
            <p className="text-a-primary">
              <Instagram className="me-2" />
              arkadia_libris
            </p>
            <p className="text-a-primary">
              <Facebook className="me-2" />
              Arkadia-Libris
            </p>
            <p className="text-a-primary">
              <TwitterX className="me-2" />
              Arkadia.Libris
            </p>
            <p className="text-a-primary">
              <EnvelopeAtFill className="me-2" />
              arkadialibris@gmail.com
            </p>
            <p className="text-a-primary">
              <Whatsapp className="me-2" />
              (+39) 000 000 0000
            </p>
          </Col>

          <Col md={3} className="d-flex flex-column">
            <h5 className="arsenica text-a-primary fs-4">Informazioni</h5>
            <Link to="/spedizioni" className="arsenica text-a-primary my-1">
              Spedizioni
            </Link>
            <Link to="/resi" className="arsenica text-a-primary my-1">
              Resi
            </Link>
            <Link to="/pagamenti" className="arsenica text-a-primary my-1">
              Pagamenti
            </Link>
            <Link to="/assistenza" className="arsenica text-a-primary my-1">
              Assistenza
            </Link>
            <Link to="/segnalazioni" className="arsenica text-a-primary my-1">
              Segnalazioni
            </Link>
          </Col>

          <Col md={3} className="d-flex flex-column">
            <h5 className="arsenica text-a-primary fs-4">Prodotti</h5>
            <Link to="/home/#novita" className="arsenica text-a-primary my-1">
              Novità
            </Link>
            <Link to="/home/#popolari" className="arsenica text-a-primary my-1">
              Popolari
            </Link>
            <Link to="/home/#offerte" className="arsenica text-a-primary my-1">
              Offerte
            </Link>
            <Link to="/home/#libri" className="arsenica text-a-primary my-1">
              Libri
            </Link>
            <Link to="/home/#comix" className="arsenica text-a-primary my-1">
              Comix
            </Link>
            <Link to="/home/#manga" className="arsenica text-a-primary my-1">
              Manga
            </Link>
          </Col>
        </Row>
      </Container>

      <Container>
        {/* MOBILE */}
        <Row className="d-flex d-md-none">
          <Col xs={12}>
            <Accordion flush>
              <Accordion.Item eventKey="0" className="bg-a-secondary my-1">
                <Accordion.Header>Su di Noi</Accordion.Header>
                <Accordion.Body className="p-0">
                  <address className="arsenica text-a-primary mb-1">
                    Arkadia Libris
                  </address>
                  <address className="arsenica text-a-primary mb-1">
                    Via Roma, 12
                  </address>
                  <address className="arsenica text-a-primary mb-2">
                    00045 Roma – Italia
                  </address>
                  <Link
                    to="/chi-siamo"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Chi siamo
                  </Link>
                  <Link
                    to="/termini-e-condizion"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Termini e Condizioni
                  </Link>
                  <Link
                    to="/contatti"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Contatti
                  </Link>
                  <p className="arsenica text-a-primary py-1 mb-0">
                    &copy; Arkadia Libris - 2025
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1" className="bg-a-secondary my-1">
                <Accordion.Header>Social e Contatti</Accordion.Header>
                <Accordion.Body className="p-0">
                  <p className="text-a-primary py-1">
                    <Instagram className="me-2" />
                    arkadia_libris
                  </p>
                  <p className="text-a-primary py-1">
                    <Facebook className="me-2" />
                    Arkadia-Libris
                  </p>
                  <p className="text-a-primary py-1">
                    <TwitterX className="me-2" />
                    Arkadia.Libris
                  </p>
                  <p className="text-a-primary py-1">
                    <EnvelopeAtFill className="me-2" />
                    arkadialibris@gmail.com
                  </p>
                  <p className="text-a-primary py-1 mb-0">
                    <Whatsapp className="me-2" />
                    (+39) 000 000 0000
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2" className="bg-a-secondary my-1">
                <Accordion.Header>Informazioni</Accordion.Header>
                <Accordion.Body className="p-0">
                  <Link
                    to="/spedizioni"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Spedizioni
                  </Link>
                  <Link
                    to="/resi"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Resi
                  </Link>
                  <Link
                    to="/pagamenti"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Pagamenti
                  </Link>
                  <Link
                    to="/assistenza"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Assistenza
                  </Link>
                  <Link
                    to="/segnalazioni"
                    className="arsenica text-a-primary d-block py-1 mb-0"
                  >
                    Segnalazioni
                  </Link>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3" className="bg-a-secondary my-1">
                <Accordion.Header>Prodotti</Accordion.Header>
                <Accordion.Body className="p-0">
                  <Link
                    to="/novita"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Novità
                  </Link>
                  <Link
                    to="/popolari"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Popolari
                  </Link>
                  <Link
                    to="/offerte"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Offerte
                  </Link>
                  <Link
                    to="/libri"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Libri
                  </Link>
                  <Link
                    to="/comix"
                    className="arsenica text-a-primary d-block py-1"
                  >
                    Comix
                  </Link>
                  <Link
                    to="/manga"
                    className="arsenica text-a-primary d-block py-1 mb-0"
                  >
                    Manga
                  </Link>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default FooterComponent;
