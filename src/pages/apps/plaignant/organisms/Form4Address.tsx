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
  typeZone: z.string().optional(),
  city: z.string().optional(),
  sector: z.string().optional(),
  village: z.string().optional(),
  addressLine1: z.string().min(1, { message: 'Adresse est requise' }),
  commune: z.string().optional(),
  quartier: z.string().optional(),
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
      province: formData.complainant.province || '',
      city: formData.complainant.city || '',
      sector: formData.complainant.sector || '',
      village: formData.complainant.village || '',
      addressLine1: formData.complainant.addressLine1 || '',
      commune: formData.complainant.commune || '',
      quartier: formData.complainant.quartier || '',
    }
  });

  const [sectors, setSectors] = useState<ISector[]>([]);
  const [villages, setVillages] = useState<IVillage[]>([]);
  const [typeSelection, setTypeSelection] = useState<'village' | 'quartier' | ''>('');

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

    if (provinceId && typeSelection === 'village') {
      dispatch(fetchTerritories({ id: provinceId }));
    } else if (provinceId && typeSelection === 'quartier') {
      dispatch(fetchCitiesByTerritory({ id: provinceId }));
    }
  }, [provinceId, typeSelection, dispatch, setValue]);

  const dynamicCities: ICity[] = typeSelection === 'village'
    ? territories.map((territory) => ({
        id: territory.id ?? '',
        name: territory.name ?? '',
        slug: territory.slug ?? '',
        referenceNumber: territory.referenceNumber ?? '',
        sectors: (territory.villages ?? []).map((village) => ({
          id: village.id ?? '',
          name: village.name ?? '',
          slug: village.slug ?? '',
          referenceNumber: village.referenceNumber ?? '',
          villages: [],
        })),
      }))
    : cities.map(city => ({
        id: city.id ?? '',
        name: city.name ?? '',
        slug: city.slug ?? '',
        referenceNumber: city.referenceNumber ?? '',
        sectors: city.sectors?.map(sector => ({
          id: sector.id ?? '',
          name: sector.name ?? '',
          slug: sector.slug ?? '',
          referenceNumber: sector.referenceNumber ?? '',
          villages: sector.villages?.map(village => ({
            id: village.id ?? '',
            name: village.name ?? '',
            slug: village.slug ?? '',
            referenceNumber: village.referenceNumber ?? '',
            committeeName: village.committeeName ?? null,
            committeeId: village.committeeId ?? null,
            projectSiteName: village.projectSiteName ?? null,
            projectSiteId: village.projectSiteId ?? null,
          })) ?? [],
        })) ?? [],
      }));

  useEffect(() => {
    setValue('sector', '');
    setValue('village', '');
    const selectedCity = dynamicCities.find((c) => c.id === cityId);
    setSectors(selectedCity?.sectors ?? []);
  }, [cityId, dynamicCities, setValue]);

  useEffect(() => {
    setValue('village', '');
    const selectedSector = sectors.find((s) => s.id === sectorId);
    setVillages(selectedSector?.villages ?? []);
  }, [sectorId, sectors, setValue]);

  const onSubmit = (data: z.infer<typeof FormData>) => {
    const updatedData = {
      ...formData.complainant,
      ...data
    };
    dispatch(saveStepData({ complainant: updatedData }));
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
                    <Form.Label>Type de zone</Form.Label>
                    <div>
                      <FormCheck
                        inline
                        label="Village"
                        type="radio"
                        id="village-option"
                        checked={typeSelection === 'village'}
                        onChange={() => setTypeSelection('village')}
                      />
                      <FormCheck
                        inline
                        label="Quartier"
                        type="radio"
                        id="quartier-option"
                        checked={typeSelection === 'quartier'}
                        onChange={() => setTypeSelection('quartier')}
                      />
                    </div>
                  </Form.Group>
                </Col>
              )}

              {typeSelection && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>{typeSelection === 'village' ? 'Territoire' : 'Ville'} <span className="text-danger">*</span></Form.Label>
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

              {typeSelection === 'village' && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Village</Form.Label>
                    <Form.Select {...register('village')} disabled={!cityId} isInvalid={!!errors.village}>
                      <option value="">Sélectionner le village</option>
                      {villages.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.village?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}

              {typeSelection === 'quartier' && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Commune</Form.Label>
                      <Form.Select {...register('sector')} disabled={!cityId} isInvalid={!!errors.sector}>
                        <option value="">Sélectionner la commune</option>
                        {sectors.map((sector) => (
                          <option key={sector.id} value={sector.id}>{sector.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.sector?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Quartier</Form.Label>
                      <Form.Select {...register('quartier')} disabled={!sectorId} isInvalid={!!errors.quartier}>
                        <option value="">Sélectionner le quartier</option>
                        {(sectors.find((sector) => sector.id === sectorId)?.villages ?? []).map((q) => (
                          <option key={q.id} value={q.id}>{q.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.quartier?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Adresse complète</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('addressLine1')}
                    placeholder="Ex: Rue 3, Kinshasa, RDC"
                    isInvalid={!!errors.addressLine1}
                  />
                  <Form.Control.Feedback type="invalid">{errors.addressLine1?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-buttons d-flex justify-content-between">
              <Button variant="secondary" onClick={prevStep}>Retour</Button>
              <Button type="submit" variant="primary">Suivant</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Form4Address;
