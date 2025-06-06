// DeleteTerritoire.tsx
import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteTerritorySchema } from 'features/territoire/territoryValidation';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deleteTerritory } from 'features/territoire/territorySlice';
import { DeleteTerritoryType } from 'features/territoire/territoryType';
import { toast } from 'react-toastify';

const DeleteTerritoire = ({ id, name }: { id: string; name: string }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.territory);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = useForm<DeleteTerritoryType>({
    resolver: zodResolver(deleteTerritorySchema),
    defaultValues: { id }
  });

  const handleClose = () => setShow(false);

  const onSubmit = async (data: DeleteTerritoryType) => {
    try {
      await dispatch(deleteTerritory(data)).unwrap();
      toast.success('Territoire supprimé');
      handleClose();
    } catch (err) {
      setError('reason', { message: String(err) });
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}><FaRegTrashAlt /></Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer le territoire</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <p>Voulez-vous vraiment supprimer le territoire <strong>{name}</strong> ?</p>
            <Form.Group className="mb-3">
              <Form.Label>Raison</Form.Label>
              <Form.Select {...register('reason')}>
                <option value="">-- Choisir --</option>
                <option value="Bad data">Données erronées</option>
                <option value="Created by mistake">Créé par erreur</option>
              </Form.Select>
              {errors.reason && <div className="text-danger">{errors.reason.message}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="danger" type="submit">
              {deleteStatus === 'loading' ? <Spinner size="sm" /> : 'Supprimer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteTerritoire;
