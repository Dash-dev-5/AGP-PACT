import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deletePrejudiceAsync, DeletePrejudiceType } from 'features/prejudice/prejudiceSlice';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeletePrejudice = ({ id, name }: { id: string; name: string }) => {
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DeletePrejudiceType>();
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.prejudice);

  const submitDelete = async (data: DeletePrejudiceType) => {
    try {
      await dispatch(deletePrejudiceAsync({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue lors de la suppression.' });
    }
  };

  const handleClose = () => {
    setShow(false);
    reset();
  };

  return (
    <>
      <Button type="button" variant="danger" onClick={() => setShow(true)}>
        <FaRegTrashAlt />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Supprimer Préjudice
              {deleteStatus === 'loading' && <Spinner animation="border" className="ms-3" size="sm" />}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body className="p-4">
              <p className="mb-3">Confirmez-vous la suppression du préjudice suivant ?</p>
              <p className="fw-bold text-primary">{name}</p>

              <Form.Group className="mb-3">
                <Form.Label>Raison</Form.Label>
                <Form.Select
                  {...register('reason', { required: 'Ce champ est requis' })}
                  className={`shadow-sm ${errors.reason ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="outline-secondary" onClick={handleClose} type="button" className="shadow-sm">
                Annuler
              </Button>
              <Button variant="danger" type="submit" className="shadow-sm px-4">
                Supprimer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default DeletePrejudice;
