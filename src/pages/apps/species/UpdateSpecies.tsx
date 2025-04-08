import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { z } from 'zod';
import { SpeciesSchema, updateSpeciesSchema } from 'features/species/SpeciesTypes';
import { updateSpeciesAsync } from 'features/species/speciesSlice';
import useAuth from 'hooks/useAuth';

const UpdateSpecies = ({ species }: { species: z.infer<typeof SpeciesSchema> }) => {
  const [show, setShow] = React.useState(false);

  const dispatch = useAppDispatch();
  const { units } = useAppSelector((state) => state.units);
  const { updateStatus, updateError } = useAppSelector((state) => state.species);
  const { assetTypes } = useAppSelector((state) => state.assetType);

  const SpeciesOmitted = SpeciesSchema.omit({ referenceNumber: true, slug: true });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof SpeciesOmitted>>({
    defaultValues: {
      id: species.id,
      name: species.name,
      prices: species.prices,
      typeId: species.typeId,
      typeName: species.typeName,
      unitId: species.unitId,
      unitName: species.unitName
    }
  });

  const handleClose = () => {
    reset({
      id: species.id,
      name: species.name,
      prices: species.prices,
      typeId: species.typeId,
      typeName: species.typeName,
      unitId: species.unitId,
      unitName: species.unitName
    });
    setShow(false);
  };

  const onSubmit = async (data: z.infer<typeof SpeciesOmitted>) => {
    const updateValues: z.infer<typeof updateSpeciesSchema>['data'] = { name: data.name, type: data.typeId, unit: data.unitId };

    try {
      await dispatch(updateSpeciesAsync({ id: data.id, data: updateValues })).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to update unit:', error);
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setShow(true)} disabled={species.name === 'Autres'}>
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered={true} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier Unité {updateStatus === 'loading' && <Spinner />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <label htmlFor="name">Nom</label>
                <input id="name" className="form-control my-2" {...register('name', { required: 'Ce champ est requis' })} />
                {errors.name && <div className="text-danger">{errors.name.message}</div>}
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Type d'actif</Form.Label>
                <Form.Control as="select" {...register('typeId', { required: "Le Type d'actif est requis" })}>
                  <option value="">Sélectionnez un type d'actif</option>
                  {assetTypes.map((type, index) => (
                    <option key={index} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Control>
                {errors.typeId && <div className="text-danger">{errors.typeId.message}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Unité de mesure</Form.Label>
                <Form.Control as="select" {...register('unitId', { required: "L'unité de mesure est requise" })}>
                  <option value="">Sélectionnez une unité de mesure</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </Form.Control>
                {errors.unitId && <div className="text-danger">{errors.unitId.message}</div>}
              </Form.Group>
              {updateStatus === 'failed' && <p className="text-danger">{updateError}</p>}
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="danger" type="button" onClick={handleClose}>
                Annulé
              </Button>
              <Button variant="primary" type="submit" className="px-4">
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateSpecies;
