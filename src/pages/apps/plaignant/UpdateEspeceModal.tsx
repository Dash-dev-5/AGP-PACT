import { z } from 'zod';
import React from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { SpeciesType } from 'features/dataManagement/dataManagementType';
import { AddSpeciesModalFormData } from './addEspeceModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchAssetTypesAsync } from 'features/asset-type/assetTypeSlice';
import { fetchSpeciesTypeAsync } from 'features/species/speciesSlice';

interface UpdateEspeceModalProps {
  index: number;
  updateSpeciesByIndex: (index: number, data: any) => void;
  species: SpeciesType;
}

const UpdateEspeceModal = ({ index, updateSpeciesByIndex, species }: UpdateEspeceModalProps) => {
  const [show, setShow] = React.useState(false);

  const dispatch = useAppDispatch();

  const { speciesTypeList } = useAppSelector((state) => state.species);
  const { assetTypes } = useAppSelector((state) => state.assetType);

  const schema = AddSpeciesModalFormData(speciesTypeList);

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      assetType: species.assetType,
      quantity: species.quantity,
      species: species.species,
      otherSpecies: species.otherSpecies
    },
    resolver: zodResolver(schema)
  });

  const assetTypeId = watch('assetType');
  const selectedSpecies = watch('species');
  const isOtherSpeciesDisabled = speciesTypeList.find((species) => species.id === selectedSpecies)?.name.includes('Autres');
  const currentSpecies = speciesTypeList.find((speciesType) => speciesType.id === selectedSpecies);

  React.useEffect(() => {
    dispatch(fetchAssetTypesAsync());
  }, [dispatch]);

  React.useEffect(() => {
    if (assetTypeId) {
      dispatch(fetchSpeciesTypeAsync(assetTypeId));
      setValue('species', '');
    }
  }, [assetTypeId, dispatch, setValue]);

  const handleClose = () => {
    reset();
    setShow(false);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    const currentAsset = assetTypes.find((item) => item.id === data.assetType);
    const currentEspece = speciesTypeList.find((item) => item.id === data.species);

    const updatedEspece: SpeciesType = {
      quantity: data.quantity,
      species: data.species,
      assetType: data.assetType,
      speciesName: currentEspece?.name || '',
      assetName: currentAsset?.name || '',
      unit: currentEspece?.unitName
    };

    if (data.otherSpecies) {
      updatedEspece.otherSpecies = data.otherSpecies;
    }
    updateSpeciesByIndex(index, updatedEspece);
    handleClose();
  };

  return (
    <>
      <Button type="button" variant="outline-primary" onClick={() => setShow(true)}>
        <FaRegEdit />
      </Button>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Modifier une espèce affectée</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <Col>
                  <FloatingLabel label="Type de bien *">
                    <Form.Select {...register('assetType')} isInvalid={!!errors.assetType}>
                      <option value="">Sélectionner un type</option>
                      {assetTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.assetType?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <FloatingLabel label="Espèces *">
                    <Form.Select {...register('species')} disabled={!assetTypeId} isInvalid={!!errors.species}>
                      <option value="">Sélectionner une espèce</option>
                      {speciesTypeList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.species?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>
              {selectedSpecies && isOtherSpeciesDisabled && (
                <Row className="mb-3">
                  <Col>
                    <FloatingLabel label="Autres Espèces *">
                      <Form.Control type="text" {...register('otherSpecies')} isInvalid={!!errors.otherSpecies} />
                      <Form.Control.Feedback type="invalid">{errors.otherSpecies?.message}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
              )}
              <Row className="mb-3">
                <Col>
                  <FloatingLabel label="Quantité *">
                    <Form.Control type="number" min={1} {...register('quantity')} isInvalid={!!errors.quantity} />
                    <Form.Control.Feedback type="invalid">{errors.quantity?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center gap-2">
                    {currentSpecies ? (
                      <span className="fw-bold">Unité : {currentSpecies.unitName}</span>
                    ) : (
                      <span className="text-danger">Sélectionnez une espèce pour voir l'unité</span>
                    )}
                  </div>
                </Col>
              </Row>
              <Modal.Footer className="border-0">
                <Button variant="danger" onClick={handleClose}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  Enregistrer
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default UpdateEspeceModal;
