import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeleteRegisterVictimes = ({ deleteVictime }: { deleteVictime: () => void }) => {
  const [show, setShow] = React.useState(false);

  const submitDelete = () => {
    deleteVictime();
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Button type="button" variant="outline-danger" onClick={() => setShow(true)}>
        <FaRegTrashAlt />
      </Button>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Supprimer une victime</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-center">Êtes-vous sûr de vouloir supprimer cette victime ? Cette action est irréversible.</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="primary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="danger" onClick={submitDelete}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default DeleteRegisterVictimes;
