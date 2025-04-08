import { z } from 'zod';
import { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deleteUnitAsync } from 'features/units/unitsSlice';
import { DeleteUnitSchema } from 'features/units/unitsType';

const DeleteUnit = ({ id, name }: { id: string; name: string }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.units);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<z.infer<typeof DeleteUnitSchema>>();

  // Handle form submission
  const submitDelete = async (data: z.infer<typeof DeleteUnitSchema>) => {
    try {
      await dispatch(deleteUnitAsync({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue.' });
      console.error('Delete error:', error);
    }
  };

  // Close modal
  const handleClose = () => setShow(false);

  return (
    <>
      {/* Delete Button */}
      <Button type="button" variant="danger" onClick={() => setShow(true)} className="shadow-sm" aria-label={`Supprimer l'unité ${name}`}>
        <FaRegTrashAlt />
      </Button>

      {/* Delete Confirmation Modal */}
      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Supprimer l'unité {deleteStatus === 'loading' && <Spinner size="sm" className="ms-2" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body>
              <p>
                Confirmez-vous la suppression de l'unité <strong>{name}</strong> ?
              </p>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reason" className="fw-bold">
                  Raison
                </Form.Label>
                <Form.Select
                  id="reason"
                  {...register('reason', { required: 'Ce champ est requis.' })}
                  className={`shadow-sm ${errors.reason ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="primary" onClick={handleClose} className="shadow-sm" type="button">
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

export default DeleteUnit;
