import { zodResolver } from '@hookform/resolvers/zod';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { fetchProvinces } from 'features/province/provinceSlice';
import { ICity, ISector, IVillage } from 'features/province/provinceType';
import { fetchTerritories } from 'features/territoire/territorySlice';
import { fetchCitiesByTerritory } from 'features/ville/citySlice';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, FormCheck } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormData = z.object({
  province: z.string().min(1, { message: 'La province est requise' }),
  city: z.string().min(1, { message: 'La ville ou territoire est requis' }),
  sector: z.string().min(1, { message: 'Le secteur est requis' }),
  village: z.string().optional(),
  addressLine1: z.string().min(1, { message: 'Adresse est requise' }),
  commune: z.string().optional(),
  secteurOuChefferie: z.string().optional(),
  quartier: z.string().optional(),
  groupement: z.string().optional(),
  villageRural: z.string().optional(),
  avenue: z.string().optional(),
  numeroParcelle: z.string().optional()
});

interface Form4RegerationProps {
  formData: RegerationFormType;
  prevStep: () => void;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form4Address: React.FC<Form4RegerationProps> = ({ formData, prevStep, saveStepData }) => {
  const { provinces } = useAppSelector((state) => state.province);
  const { territories } = useAppSelector((state) => state.territory);
  const { cities } = useAppSelector((state) => state.Villes);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof FormData>>({
    resolver: zodResolver(FormData),
    defaultValues: {
      province: formData.complainant.province,
      city: formData.complainant.city,
      sector: formData.complainant.sector,
      village: formData.complainant.village,
      addressLine1: formData.complainant.addressLine1,
      commune: formData.complainant.commune,
      secteurOuChefferie: formData.complainant.secteurOuChefferie,
      quartier: formData.complainant.quartier,
      groupement: formData.complainant.groupement,
      villageRural: formData.complainant.villageRural,
      avenue: formData.complainant.avenue,
      numeroParcelle: formData.complainant.numeroParcelle
    }
  });

  const [sectors, setSectors] = useState<ISector[]>([]);
  const [villages, setVillages] = useState<IVillage[]>([]);
  const [typeSelection, setTypeSelection] = useState<'city' | 'territory' | ''>('');

  const provinceId = watch('province');
  const cityId = watch('city');
  const sectorId = watch('sector');

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    setValue('city', '');
    setValue('sector', '');
    setValue('village', '');
    setSectors([]);
    setVillages([]);
    if (provinceId && typeSelection === 'territory') {
      dispatch(fetchTerritories({ id: provinceId }));
    } else if (provinceId && typeSelection === 'city') {
      dispatch(fetchCitiesByTerritory({ id: provinceId }));
      // alert(JSON.stringify(cities)); 
    }
  }, [provinceId, typeSelection, dispatch, setValue]);

  const dynamicCities: ICity[] = typeSelection === 'territory' ? territories : cities;

  useEffect(() => {
    setValue('sector', '');
    setValue('village', '');
    const selectedCity = dynamicCities.find((c) => c.id === cityId);
    setSectors(selectedCity?.sectors || []);
  }, [cityId, dynamicCities, setValue]);

  useEffect(() => {
    setValue('village', '');
    const selectedSector = sectors.find((s) => s.id === sectorId);
    setVillages(selectedSector?.villages || []);
  }, [sectorId, sectors, setValue]);

  const onSubmit = (data: z.infer<typeof FormData>) => {
    dispatch(saveStepData({ complainant: { ...formData.complainant, ...data } }));
  };

  return (
    <div className="form4-address-container">
      <Row>
        <Col md={12} className="mb-4">
          <h2 className="section-title">Adresse du plaignant</h2>
        </Col>

        <Col md={12}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Province <span className="text-danger">*</span></Form.Label>
                  <Form.Select {...register('province')} isInvalid={!!errors.province}>
                    <option value="">Sélectionner la province</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>{province.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.province?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {provinceId && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Choisissez le type</Form.Label>
                    <div>
                      <FormCheck
                        inline
                        label="Ville"
                        type="radio"
                        id="city-option"
                        checked={typeSelection === 'city'}
                        onChange={() => setTypeSelection('city')}
                      />
                      <FormCheck
                        inline
                        label="Territoire"
                        type="radio"
                        id="territory-option"
                        checked={typeSelection === 'territory'}
                        onChange={() => setTypeSelection('territory')}
                      />
                    </div>
                  </Form.Group>
                </Col>
              )}

              {typeSelection && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>{typeSelection === 'city' ? 'Ville' : 'Territoire'} <span className="text-danger">*</span></Form.Label>
                    <Form.Select {...register('city')} isInvalid={!!errors.city}>
                      <option value="">Sélectionner</option>
                      {dynamicCities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}

              {/* <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Secteur <span className="text-danger">*</span></Form.Label>
                  <Form.Select {...register('sector')} disabled={!cityId} isInvalid={!!errors.sector}>
                    <option value="">Sélectionner le secteur</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>{sector.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.sector?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Village</Form.Label>
                  <Form.Select {...register('village')} disabled={!sectorId} isInvalid={!!errors.village}>
                    <option value="">Sélectionner le village</option>
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.village?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col> */}

              {/* Champs conditionnels supplémentaires */}
              {typeSelection === 'city' && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Commune</Form.Label>
                      <Form.Control type="text" {...register('commune')} />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Quartier</Form.Label>
                      <Form.Control type="text" {...register('quartier')} />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Avenue</Form.Label>
                      <Form.Control type="text" {...register('avenue')} />
                    </Form.Group>
                  </Col>
                </>
              )}

              {typeSelection === 'territory' && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Secteur / Chefferie</Form.Label>
                      <Form.Control type="text" {...register('secteurOuChefferie')} />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Groupement</Form.Label>
                      <Form.Control type="text" {...register('groupement')} />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Village (zone rurale)</Form.Label>
                      <Form.Control type="text" {...register('villageRural')} />
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Numéro de parcelle / maison</Form.Label>
                  <Form.Control type="text" {...register('numeroParcelle')} />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control as="textarea" rows={3} {...register('addressLine1')} style={{ resize: 'none' }} />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={prevStep} type="button">Retour</Button>
              <Button variant="primary" type="submit">Suivant</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Form4Address;
