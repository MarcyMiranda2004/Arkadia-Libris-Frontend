import { Container } from "react-bootstrap";
import logo from "../assets/png/logos/logo-no-bg.svg";

const HomePageComponent = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <div className="Banner bg-a-secondary w-100 d-flex flex-column align-items-center justify-content-center p-5 rounded-4">
        <img src={logo} alt="logo" className="rounded-5 w-25" />
      </div>

      <section className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary">
          NOVITÀ
        </h2>
      </section>

      <section className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary">
          POPOLARI
        </h2>
      </section>

      <section className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary">
          OFFERTE
        </h2>
      </section>

      <section className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary ">
          LIBRI
        </h2>
      </section>

      <section className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary ">
          MANGA
        </h2>
      </section>

      <section className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="arsenica bg-a-secondary text-a-primary p-2 px-4 fs-5 rounded-pill border border-2 border-a-quaternary ">
          COMIX
        </h2>
      </section>
    </Container>
  );
};

export default HomePageComponent;
