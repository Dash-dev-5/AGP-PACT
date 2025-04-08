import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import logoAGPPACT from 'assets/images/landing/Logo_AGP_PACT_COULEUR.png';
import styles from './header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { handleScroll } from 'utils/someUtils';
import useAuth from 'hooks/useAuth';
import ProfilePage from 'layout/Dashboard/Header/HeaderContent/Profile';

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className={styles['blurry-navbar']}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logoAGPPACT} height="60" className="d-inline-block align-top" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2">
            {user && (
              <Nav.Link to="dashboard" as={Link}>
                Dashboard
              </Nav.Link>
            )}
            <Nav.Link onClick={(e) => handleScroll(e, 'stats')}>Statistiques</Nav.Link>
            <Nav.Link onClick={(e) => handleScroll(e, 'about')}>À Propos</Nav.Link>
            <Nav.Link onClick={(e) => handleScroll(e, 'contact')}>Contact</Nav.Link>
            <Nav.Link onClick={(e) => handleScroll(e, 'faq')}>FAQ</Nav.Link>
          </Nav>
          {user ? (
            <ProfilePage />
          ) : (
            <Nav className="d-flex gap-2 flex-column flex-md-row">
              <Button variant="outline-primary" className="w-100" onClick={goToLoginPage}>
                Connexion
              </Button>
              <Button variant="primary" className="w-100" onClick={() => navigate('/register')}>
                Inscription
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
