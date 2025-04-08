import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchAssetTypesAsync } from 'features/asset-type/assetTypeSlice';
import { SpeciesType } from 'features/dataManagement/dataManagementType';
import { fetchSpeciesTypeAsync } from 'features/species/speciesSlice';
import { useEffect } from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddSpeciesModalFormData = (speciesTypeList: { id: string; name: string }[]) =>
  z
    .object({
      assetType: z.string().min(1, { message: 'Type de bien est requis' }),
      species: z.string().min(1, { message: 'Espèce est requise' }),
      otherSpecies: z.string().optional(),
      quantity: z
        .string()
        .min(1, { message: 'Quantité est requise' })
        .refine(
          (value) => {
            const parsedValue = parseInt(value, 10);
            return Number.isInteger(parsedValue) && parsedValue >= 1;
          },
          { message: 'La quantité doit être un entier supérieur ou égal à 1' }
        )
    })
    .superRefine((data, ctx) => {
      const selectedSpecies = speciesTypeList.find((speciesType) => speciesType.id === data.species);

      if (selectedSpecies?.name === 'Autres' && !data.otherSpecies) {
        ctx.addIssue({
          code: 'custom',
          path: ['otherSpecies'],
          message: "L'espèce est requise"
        });
      }
    });

function AddEspeceModal({
  setAjoutEspece,
  show,
  saveSpeciesData
}: {
  setAjoutEspece: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  saveSpeciesData: (data: any) => void;
}) {
  const handleClose = () => setAjoutEspece(false);

  const dispatch = useAppDispatch();

  const { speciesTypeList, } = useAppSelector((state) => state.species);
  const { assetTypes } = useAppSelector((state) => state.assetType);

  const schema = AddSpeciesModalFormData(speciesTypeList);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const assetTypeId = watch('assetType');

  const selectedSpecies = watch('species');
  const isOtherSpeciesDisabled = speciesTypeList.find((species) => species.id === selectedSpecies)?.name.includes('Autres');

  useEffect(() => {
    dispatch(fetchAssetTypesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (assetTypeId) {
      dispatch(fetchSpeciesTypeAsync(assetTypeId));
    }
    setValue('species', '');
  }, [assetTypeId, dispatch, setValue]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const currentAsset = assetTypes.find((item) => item.id === data.assetType);
    const currentEspece = speciesTypeList.find((item) => item.id === data.species);

    const newEspece: SpeciesType = {
      quantity: data.quantity,
      species: data.species,
      assetType: data.assetType,
      speciesName: currentEspece?.name || '',
      assetName: currentAsset?.name || '',
      unit: currentEspece?.unitName
    };

    if (data.otherSpecies) {
      newEspece.otherSpecies = data.otherSpecies;
    }

    saveSpeciesData(newEspece);
    handleClose();
  };

  const currentSpecies = speciesTypeList.find((speciesType) => speciesType.id === watch('species'));

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une espèce affectée</Modal.Title>
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
  );
}

export default AddEspeceModal;
