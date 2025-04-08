import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Hero from 'sections/landing/Hero';

const ChooseComplaintType = () => {
  const navigate = useNavigate();
  return (
    <>
      <Hero />
      <Modal show={true} onHide={() => navigate('..')} centered={true}>
        <Modal.Body>
          <div className="container flex-grow-1 flex-column flex-md-row d-flex justify-content-center align-items-md-center gap-3">
            <Button variant="outline-primary fw-semibold" onClick={() => navigate('/register')}>
              Créer un compte gratuit
            </Button>
            <Button onClick={() => navigate('/login')}>J'ai un compte</Button>
            <Button variant="success d-flex gap-3 align-items-center" onClick={() => navigate('/anonymous-complaint')}>
              <FaPaperPlane size={18} />
              Plainte anonyme
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChooseComplaintType;
