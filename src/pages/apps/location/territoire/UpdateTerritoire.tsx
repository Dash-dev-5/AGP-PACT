// UpdateTerritoire.tsx
import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { updateTerritory } from 'features/territoire/territorySlice';
import { UpdateTerritoryType } from 'features/territoire/territoryType';
import { updateTerritorySchema } from 'features/territoire/territoryValidation';
import { toast } from 'react-toastify';

const UpdateTerritoire = ({ territory }: { territory: UpdateTerritoryType }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { updateStatus } = useAppSelector((state) => state.territory);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateTerritoryType>({
    resolver: zodResolver(updateTerritorySchema),
    defaultValues: {
      id: territory.id,
      name: territory.name
    }
  });

  const handleClose = () => {
    reset();
    setShow(false);
  };

  const onSubmit = async (data: UpdateTerritoryType) => {
    try {
      await dispatch(updateTerritory(data)).unwrap();
      toast.success('Territoire mis à jour avec succès');
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <>
      <Button onClick={() => setShow(true)}><FaRegEdit /></Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le territoire</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control {...register('name')} />
              {errors.name && <div className="text-danger">{errors.name.message}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit">
              {updateStatus === 'loading' ? <Spinner size="sm" /> : 'Enregistrer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateTerritoire;
