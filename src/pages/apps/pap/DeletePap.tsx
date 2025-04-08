import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deletePapAsync } from 'features/pap/papSlice';
import { DeletePapType } from 'features/pap/papTypes';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

interface DeletePapProps {
  id: string;
  code: string;
}

const DeletePap: React.FC<DeletePapProps> = ({ id, code }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.pap);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DeletePapType>();

  const handleClose = () => setShow(false);

  const onSubmit = async (data: DeletePapType) => {
    try {
      await dispatch(deletePapAsync({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue lors de la suppression.' });
    }
  };

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setShow(true)}>
        <FaRegTrashAlt />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer le PAP</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <p>
              Confirmez-vous la suppression du PAP suivant ?<br />
              <strong>CODE: {code}</strong>
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Raison de la suppression</Form.Label>
              <Form.Select {...register('reason', { required: 'La raison est requise.' })}>
                <option value="">-- Choisir une raison --</option>
                <option value="Bad data">Données erronées</option>
                <option value="Data created by mistake and more">Données créées par erreur</option>
              </Form.Select>
              {errors.reason && <Form.Text className="text-danger">{errors.reason.message}</Form.Text>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="danger" type="submit" disabled={deleteStatus === 'loading'}>
              {deleteStatus === 'loading' ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DeletePap;
