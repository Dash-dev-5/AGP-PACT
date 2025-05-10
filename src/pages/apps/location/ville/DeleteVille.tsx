import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deleteCity } from 'features/ville/citySlice'; // Utilisation du slice de ville
import { DeleteCityType } from 'features/ville/villeType'; // Importer le type de la ville
import { deleteCitySchema } from 'features/ville/cityValidation'; // Utilisation du schéma de validation de la ville

import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { z } from 'zod';

const DeleteCity = ({ id, name }: { id: string; name: string }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DeleteCityType>({
    defaultValues: {
      id
    },
    resolver: zodResolver(deleteCitySchema) // Utilisation du schéma de validation de la ville
  });
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.Villes); // Changer "province" en "ville"

  const submitDelete = async (data: DeleteCityType) => {
    try {
      await dispatch(deleteCity(data)).unwrap(); // Dispatch de la suppression de la ville
      toast.success('Ville supprimée avec succès', { autoClose: 2000 });
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
            <Modal.Title>Supprimer la ville {deleteStatus === 'loading' && <Spinner animation="border" size="sm" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body className="p-4">
              <p>Confirmer la suppression de la ville ?</p>
              <p>{name}</p>

              <Form.Group className="mb-3">
                <Form.Label>Raison</Form.Label>
                <Form.Select {...register('reason', { required: 'Ce champ est requis' })}>
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <span className="text-danger mt-2">{errors.reason.message}</span>}
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

export default DeleteCity;
