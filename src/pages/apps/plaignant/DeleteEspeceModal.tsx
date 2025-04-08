import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeleteEspeceModal = ({ deleteSpecies }: { deleteSpecies: () => void }) => {
  const [show, setShow] = React.useState(false);

  const submitDelete = () => {
    deleteSpecies();
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
            <Modal.Title>Supprimer une espèce</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-center">Êtes-vous sûr de vouloir supprimer cette espèce affectée ? Cette action est irréversible.</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="primary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="danger" onClick={submitDelete}>
              Confirmer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default DeleteEspeceModal;
