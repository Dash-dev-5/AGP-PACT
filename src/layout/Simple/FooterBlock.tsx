import { color } from '@mui/system';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const FooterBlock = () => {
  return (
    
    <footer className="text-center pt-2 " style={{ backgroundColor: '#080913'}}>
      <Container>
        <Row>
          <Col>
            <div className="text-muted d-flex justify-content-center">
              <p style={{color:'#ffffff'}}>
                Copyright © 2024 -{' '}
              </p>
              <a href="https://www.celluleinfra.org" target="_blank" rel="noreferrer" className="text-primary">
                Cellule Infrastructures
              </a>{' '}
              <p style={{color:'#ffffff'}}>
                - Tous droits réservés
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterBlock;
