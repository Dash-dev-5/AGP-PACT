import React from 'react';
import styles from './Contacts.module.scss';
import { Container } from 'react-bootstrap';

function Contacts() {
  return (
    <section className={styles.contact} id="contact">
      <h2 className="align-items-center text-center fw-semibold" style={{ color: '#ffb53a' }}>
        Nous contactez
      </h2>
      <Container>
        <p className="mx-10 my-lg-4 align-items-center text-center" style={{ color: '#f5eff0' }}>
          Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos démarches. N'hésitez pas à nous
          contacter pour obtenir les informations et les conseils personnalisés. Votre satisfaction est notre priorité, et nous sommes là
          pour vous aider. Ensemble, construisons une expérience positive et enrichissante.
        </p>
      </Container>
      <div className={`${styles.container} container m-md-auto d-flex`}>
        <div className={styles.phone}>
          <div className={styles.description}>
            <p>
              Assistance 100% gratuite au{' '}
              <span style={{ color: 'green', fontSize: '1rem', backgroundColor: '#fef200', padding: '0.25rem' }}>0000</span>.
              <br />
              <a href="tel:0000">Appelez-nous !</a>
            </p>
          </div>
        </div>
        <div className={styles.site}>
          <div className={styles.description}>
            <a href="mailto:info@celluleinfra.org">info@celluleinfra.org</a>
            <br />
            <a href="https://www.celluleinfra.org/" target="_blank">
              www.celluleinfra.org
            </a>
            <br />
            <a href="tel:+243970140323">+243 (0) 97 014 0323</a>
          </div>
        </div>
        <div className={styles.map}>
          <div className={styles.description}>
            <a href="https://maps.app.goo.gl/oLdoyqxcchFdB9aL6" rel="noreferrer" target="_blank">
              70A, avenue Roi Baudouin
            </a>
            <p>
              Kinshasa-Gombe
              <br />
              République Démocratique du Congo
            </p>
          </div>
        </div>
      </div>
      <Container style={{ marginTop: '3rem' }}>
        <div className="row d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 gap-md-0">
          <div className="col-12 col-md-4 col-lg-3 mb-3 text-center">
            <a href="https://infrastructures.gouv.cd/" target="_blank">
              <img
                src="/img/partners/logo-ITP.png"
                alt="Logo ITP"
                className="img-fluid rounded"
                style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </a>
          </div>
          <div className="col-12 col-md-4 col-lg-3 mb-3 text-center">
            <a href="https://www.celluleinfra.org/" target="_blank">
              <img
                src="/img/partners/logo-cellule-infrastructure.jpg"
                alt="Logo Partner 2"
                className="img-fluid rounded"
                style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </a>
          </div>
          <div className="col-12 col-md-4 col-lg-3 mb-3 text-center">
            <a href="https://www.banquemondiale.org/" target="_blank">
              <img
                src="/img/partners/la-banque-mondiale-logo.png"
                alt="Logo Banque Mondiale"
                className="img-fluid rounded"
                style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Contacts;
