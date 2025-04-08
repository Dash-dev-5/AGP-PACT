import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeleteSpeciesSchema } from 'features/species/SpeciesTypes';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';
import { z } from 'zod';

const DeleteSpeciesPrice = ({ id, name }: { id: string; name: string }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.species);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<z.infer<typeof DeleteSpeciesSchema>>();

  // Handle form submission
  const handleDelete = async (data: z.infer<typeof DeleteSpeciesSchema>) => {
    try {
      // Replace with your actual dispatch function
      // await dispatch(deleteSpeciesAsync({ id, reason: data.reason })).unwrap();
      console.log('Deleting:', { id, reason: data.reason });
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue.' });
    }
  };

  // Handle modal close
  const handleClose = () => setShow(false);

  return (
    <>
      <Button type="button" variant="danger" onClick={() => setShow(true)} className="btn-sm shadow-sm" aria-label="Supprimer l'espèce">
        <FaRegTrashAlt />
      </Button>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {deleteStatus === 'loading' ? (
                <>
                  Suppression en cours <Spinner size="sm" className="ms-2" />
                </>
              ) : (
                `Supprimer l'espèce`
              )}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(handleDelete)}>
            <Modal.Body className="p-4">
              <p>
                Confirmez-vous la suppression du prix de l'espèce sur le tronçon <span className="fw-bold text-primary">{name}</span> ?
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
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose} type="button" className="shadow-sm">
                Annuler
              </Button>
              <Button variant="danger" type="submit" className="shadow-sm">
                Supprimer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default DeleteSpeciesPrice;
