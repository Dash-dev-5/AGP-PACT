import { Col, Container, Row } from 'react-bootstrap';
import styles from './Download.module.scss';
import logoAndroid from 'assets/images/landing/en_badge_web_generic_.png';
import logoIOS from 'assets/images/landing/Download_on_the_App_Store_RGB_blk.svg';

function Download() {
  return (
    <section className={`${styles.download} bg-white`} id="download">
      <Container>
        <Row className="text-center flex-column">
          <Col>
            <h2>L&rsquo;AGP-PACT : Application de Gestion des Plaintes du Projet PACT</h2>
          </Col>
          <Col className="d-flex flex-column gap-3 flex-md-row align-items-center justify-content-center mb-5">
            <a href="/" className="theme-logo mx-2">
              <img src={logoAndroid} alt="logo" style={{ height: '60px' }} />
            </a>
            <a href="/" className="theme-logo mx-2">
              <img src={logoIOS} alt="logo" style={{ height: '60px' }} />
            </a>
          </Col>
          <Col>
            <p style={{ fontSize: '1.2rem' }}>
              Facilitons ensemble la connectivité et améliorons les infrastructures de la RDC pour un avenir meilleur
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Download;
