import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeleteComplaintType, deleteComplaintTypeAsync } from 'features/complaintType/complaintTypeSlice';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeletePlainteType = ({ id, name }: { id: string; name: string }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DeleteComplaintType>();
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.complaintType);

  const submitDelete = async (data: DeleteComplaintType) => {
    try {
      await dispatch(deleteComplaintTypeAsync({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue lors de la suppression.' });
    }
  };

  const handleClose = () => {
    setShow(false);
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
              Supprimer Type de plainte
              {deleteStatus === 'loading' && <Spinner animation="border" className="ms-3" size="sm" />}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body className="p-4">
              <p className="mb-3">Confirmez-vous la suppression du type de plainte suivant ?</p>
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
            <Modal.Footer>
              <div className="d-flex align-items-center gap-3 justify-content-end">
                <Button variant="outline-secondary" onClick={handleClose} type="button" className="shadow-sm">
                  Annuler
                </Button>
                <Button variant="danger" type="submit" className="shadow-sm px-4">
                  Supprimer
                </Button>
              </div>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default DeletePlainteType;
