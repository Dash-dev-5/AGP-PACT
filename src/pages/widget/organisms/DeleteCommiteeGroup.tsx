import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeleteCommiteeGroupType, deleteGroupCommitees } from 'features/groupCommittes/groupCommiteesSlice';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeleteCommiteeGroup: React.FC<{ id: string; name: string }> = ({ id, name }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DeleteCommiteeGroupType>();

  const { deleteStatus } = useAppSelector((state) => state.groupCommitees);

  const submitDelete = async (data: DeleteCommiteeGroupType) => {
    try {
      await dispatch(deleteGroupCommitees({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue' });
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
            <Modal.Title>Suprimer le groupe de comité {deleteStatus === 'loading' && <Spinner animation="border" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body className="p-4">
              <p>Confirmer la suppression du Groupe de comités ?</p>
              <p>{name}</p>

              <Form.Group className="mb-3">
                <Form.Label>Raison</Form.Label>
                <Form.Select {...register('reason', { required: true })}>
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <span className="text-danger">Ce champ est requis</span>}
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

export default DeleteCommiteeGroup;
