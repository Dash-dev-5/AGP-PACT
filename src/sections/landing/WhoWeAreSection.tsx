import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styles from './WhoWeAreSection.module.css'; // Create this CSS file for custom styling
import exampleImage from 'assets/images/landing/american-woman-in-call-center-with-headphones.jpg'; // Replace with your image path
import image2 from 'assets/images/image-2.jpeg.jpg';
import image1 from 'assets/images/image-1.jpeg.jpg';
import image3 from 'assets/images/plainte.jpg';

const WhoWeAreSection = () => {
  return (
    <section className={`${styles['who-we-are-section']} py-5`} id="about">
      <Container>
        <Row className="align-items-center">
          {/* Colonne d'images, cachée sur les petits écrans */}
          <Col md={6} className="d-none d-md-block">
            <div className="d-flex">
              <Card
                style={{
                  width: '8rem',
                  margin: '1rem',
                  borderRadius: '5px',
                  height: '22rem',
                  backgroundImage: `url(${image1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                className="text-center"
              ></Card>
              <Card
                style={{
                  width: '8rem',
                  margin: '1rem',
                  borderRadius: '5px',
                  height: '22rem',
                  backgroundImage: `url(${image2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  marginTop: '4rem'
                }}
                className="text-center"
              ></Card>
              <Card
                style={{
                  width: '8rem',
                  margin: '1rem',
                  borderRadius: '5px',
                  height: '22rem',
                  backgroundImage: `url(${image3})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                className="text-center"
              ></Card>
              <Card
                style={{
                  width: '8rem',
                  margin: '1rem',
                  borderRadius: '5px',
                  height: '22rem',
                  backgroundImage: `url(${image2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  marginTop: '4rem'
                }}
                className="text-center"
              ></Card>
            </div>
          </Col>

          {/* Colonne de texte, centrée sur les petits écrans */}
          <Col md={6} className="text-center text-md-start">
            <h2 className="fs-3 mt-3 mt-md-0" style={{ color: 'white' }}>
              A propos de l'AGP-PACT
            </h2>
            <p className="fs-6" style={{ textAlign: 'justify', lineHeight: '1.8', color: 'white' }}>
              L&rsquo;AGP-PACT est une Application de Gestion des Plaintes mise en place dans le cadre de la mise en œuvre des interventions
              du Projet PACT sur la Route nationale Numéro 2 (RN2), tronçons Mbuji-Mayi &ndash; Kabinda &ndash; Mbanga et Kanya Bayonga
              &ndash; Butembo. Elle vise à améliorer le Mécanisme de Gestion des Plaintes du Projet en termes d&rsquo;enregistrement des
              plaintes, de traitement, de suivi et de rétroaction en respectant les règles de confidentialité pour les plaintes sensibles.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhoWeAreSection;
