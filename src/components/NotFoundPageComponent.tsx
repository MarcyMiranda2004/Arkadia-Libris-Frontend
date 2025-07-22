import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <img
        src="https://i.pinimg.com/originals/85/4b/fb/854bfb7944dbe195d85a44631eb77dbe.gif"
        alt="404"
        className="rounded-4 border border-3 border-a-quaternary"
        style={{ width: "300px" }}
      />
      <p className="arsenica fst-italic mb-4">Hello Seeker, are you lost ?</p>
      <div className="d-flex flex-column align-items-center justify-content-center arsenica-bold">
        <h1>404 - Not Found</h1>
        <h2>Ci dispiace ma questa pagina non è stata trovata</h2>
        <p>
          La pagina potrebbe essere stata spostata, sospesa o eliminata,
          controlla l'indirizzo della pagina e riprova
        </p>
      </div>
      <Link to="/home" className="text-a-quaternary">
        Torna alla home
      </Link>
    </Container>
  );
};

export default NotFoundPage;
