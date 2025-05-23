import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeleteCommiteeType, deleteCommittee } from 'features/commitee/committeeSlice';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeleteCommitee: React.FC<{ id: string; name: string }> = ({ id, name }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DeleteCommiteeType>();

  const { deleteStatus } = useAppSelector((state) => state.committee);

  const submitDelete = async (data: DeleteCommiteeType) => {
    try {
      await dispatch(deleteCommittee({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: String(error) });
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
        <Modal show={show} onHide={handleClose} centered={true}>
          <Modal.Header closeButton>
            <Modal.Title>Suprimer la Comité {deleteStatus === 'loading' && <Spinner size="sm" animation="border" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body className="p-4">
              <p>Confirmer la suppression du Comité ?</p>
              <p>{name}</p>

              <Form.Group className="mb-3">
                <Form.Label>Raison</Form.Label>
                <Form.Select {...register('reason', { required: 'Ce champs est requies' })}>
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <span className="text-danger">{errors.reason.message}</span>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex align-items-center gap-3 justify-content-end">
                <Button variant="outline-secondary" onClick={handleClose} type="button">
                  Annuler
                </Button>
                <Button variant="danger" type="submit">
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

export default DeleteCommitee;
