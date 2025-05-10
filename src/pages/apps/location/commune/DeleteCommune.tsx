import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteSectorSchema } from 'features/sector/communeValidation';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deleteSector } from 'features/sector/communeSlice';
import { DeleteSectorType } from 'features/sector/communeType';
import { toast } from 'react-toastify';

const DeleteCommune = ({ id, name }: { id: string; name: string }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.sectors);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = useForm<DeleteSectorType>({
    resolver: zodResolver(deleteSectorSchema),
    defaultValues: {
      id,
      reason: ''
    }
  });

  const handleClose = () => setShow(false);

  const onSubmit = async (data: DeleteSectorType) => {
    try {
      await dispatch(deleteSector(data)).unwrap();
      toast.success('Commune supprimée avec succès');
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
          <Modal.Title>Supprimer la commune</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <p>Voulez-vous vraiment supprimer la commune <strong>{name}</strong> ?</p>
            <Form.Group className="mb-3">
              <Form.Label>Raison</Form.Label>
              <Form.Select {...register('reason')}>
                <option value="">-- Choisir --</option>
                <option value="Bad data">Données erronées</option>
                <option value="Created by mistake">Créée par erreur</option>
              </Form.Select>
              {errors.reason && <div className="text-danger">{errors.reason.message}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="danger" type="submit" disabled={deleteStatus === 'loading'}>
              {deleteStatus === 'loading' ? <Spinner size="sm" /> : 'Supprimer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteCommune;
