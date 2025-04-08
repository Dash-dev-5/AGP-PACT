import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deleteAssetTypeAsync } from 'features/asset-type/assetTypeSlice';
import { DeleteAssetTypeSchema } from 'features/asset-type/assetTypeType';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaRegTrashAlt } from 'react-icons/fa';

const DeleteAssetType = ({ id, name }: { id: string; name: string }) => {
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<z.infer<typeof DeleteAssetTypeSchema>>({
    resolver: zodResolver(DeleteAssetTypeSchema),
    defaultValues: { id }
  });

  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.assetType);

  const submitDelete = async (data: z.infer<typeof DeleteAssetTypeSchema>) => {
    try {
      await dispatch(deleteAssetTypeAsync({ id, reason: data.reason })).unwrap();
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
              Supprimer Type d'actif
              {deleteStatus === 'loading' && <Spinner animation="border" size="sm" className="ms-3" />}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body className="p-4">
              <p className="mb-3">Confirmez-vous la suppression du type d'actif suivant ?</p>
              <p className="fw-bold text-primary">{name}</p>

              <Form.Group className="mb-3">
                <Form.Label>Raison</Form.Label>
                <Form.Select {...register('reason')} className={`shadow-sm ${errors.reason ? 'is-invalid' : ''}`}>
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="primary" onClick={handleClose} type="button" className="shadow-sm">
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

export default DeleteAssetType;
