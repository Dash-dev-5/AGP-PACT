import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { useAppDispatch } from 'app/hooks';
import { z } from 'zod';
import { AssetTypeSchema } from 'features/asset-type/assetTypeType';
import { updateAssetTypeAsync } from 'features/asset-type/assetTypeSlice';

const UpdateAssetType = ({ assetType }: { assetType: z.infer<typeof AssetTypeSchema> }) => {
  const [show, setShow] = React.useState(false);

  const dispatch = useAppDispatch();

  const AssetTypeOmitted = AssetTypeSchema.omit({ referenceNumber: true, slug: true });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof AssetTypeOmitted>>({
    defaultValues: {
      id: assetType.id,
      name: assetType.name
    }
  });

  const handleClose = () => {
    reset({ name: assetType.name, id: assetType.id });
    setShow(false);
  };

  const onSubmit = async (data: z.infer<typeof AssetTypeOmitted>) => {
    try {
      await dispatch(updateAssetTypeAsync(data)).unwrap();
      setShow(false);
    } catch (error) {
      setError('name', { message: 'Une erreur est survenue lors de la mise à jour.' });
      console.error('Failed to update asset type:', error);
    }
  };

  return (
    <>
      <Button type="button" variant="primary" onClick={() => setShow(true)}>
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier Type d'Actif</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <Form.Label htmlFor="name">Nom</Form.Label>
                <Form.Control
                  id="name"
                  className={`shadow-sm ${errors.name ? 'is-invalid' : ''}`}
                  {...register('name', { required: 'Le nom est requis.' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="danger" type="button" onClick={handleClose} className="shadow-sm">
                Annuler
              </Button>
              <Button variant="primary" type="submit" className="shadow-sm px-4">
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateAssetType;
