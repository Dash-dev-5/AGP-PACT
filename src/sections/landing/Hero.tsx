import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import styles from './Hero.module.css';
import { useNavigate } from 'react-router-dom';
import { handleScroll } from 'utils/someUtils';
import image3 from 'assets/images/file.png';
import useAuth from 'hooks/useAuth';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className={styles['hero-section']} id="hero">
      <div className={styles['hero-backdrop']}>
        <Container>
          <Row>
            <Col xs={12} md={12} lg={7} className="d-flex flex-column justify-content-center">
              <div className="text-center text-md-start">
                <h1 className="display-2 fw-bold">
                  Portail <br />
                  des Plaintes
                  <br />
                  du Projet PACT
                </h1>
                <p className="text-justify" style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                  Bienvenue sur le portail du Mécanisme de Gestion des Plaintes (MGP) du Projet d’Appui à la Connectivité et au Transport
                  (PACT) financé par la Banque Mondiale et mise en œuvre par la Cellule Infrastructures du Ministère des Infrastructures et
                  travaux publics.
                  <br />
                </p>
                <p className="text-justify" style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                  Soumettez vos Plaintes en toute confidentialité, transparence et convivialité et de manière anonyme pour les plaintes
                  sensibles.
                </p>
                <div className="d-flex gap-2 flex-column flex-md-row">
                  <Button
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: '1px solid white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc0b12';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc0b12';
                      e.currentTarget.style.color = 'white';
                    }}
                    className="me-2"
                    onClick={() => {
                      user ? navigate('/gestion/plainte/plainte-generale') : navigate('select-complaint');
                    }}
                  >
                    Soumettez une plainte
                  </Button>

                  <Button
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      border: '1px solid white',
                      transition: 'all 0.4s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'blue';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'blue';
                      e.currentTarget.style.color = 'white';
                    }}
                    onClick={(e) => handleScroll(e, 'download')}
                  >
                    Télécharger l'application
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={3} className="d-none d-lg-flex justify-content-center">
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(3, 17, 76, 0.5)',
                    background: 'white'
                  }}
                >
                  <Image
                    src="/img/partners/logo-cellule-infrastructure.jpg"
                    style={{
                      width: '400px',
                      height: '400px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
