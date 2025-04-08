import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap'; 

interface ToastProps {
  message: string;         
  type: 'success' | 'error'; 
  show: boolean;           
  onClose: () => void;      
  delay?: number;       
}

const CustomToast: React.FC<ToastProps> = ({ message, type, show, onClose, delay = 3000 }) => {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show); 
  }, [show]);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={onClose} show={showToast} delay={delay} autohide>
        <Toast.Header>
          <strong className="me-auto">
            {type === 'success' ? 'Succès' : 'Erreur'}
          </strong>
        </Toast.Header>
        <Toast.Body className={type === 'error' ? 'text-danger' : 'text-success'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
