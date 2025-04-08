import { zodResolver } from '@hookform/resolvers/zod';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { fetchProvinces } from 'features/province/provinceSlice';
import { ICity, ISector, IVillage } from 'features/province/provinceType';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormData = z.object({
  province: z.string().min(1, { message: 'La province est requise' }),
  city: z.string().min(1, { message: 'La ville est requise' }),
  sector: z.string().min(1, { message: 'Le secteur est requis' }),
  village: z.string().min(1, { message: 'Le village est requis' }),
  addressLine1: z.string().optional()
});

interface Form4RegerationProps {
  formData: RegerationFormType;
  prevStep: () => void;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form4Address: React.FC<Form4RegerationProps> = ({ formData, prevStep, saveStepData }) => {
  const { provinces } = useAppSelector((state) => state.province);
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
      addressLine1: formData.complainant.addressLine1
    }
  });

  const [cities, setCities] = useState<ICity[]>([]);
  const [sectors, setSectors] = useState<ISector[]>([]);
  const [villages, setVillages] = useState<IVillage[]>([]);

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  const provinceId = watch('province');
  useEffect(() => {
    setValue('city', '');
    setValue('sector', '');
    setValue('village', '');
    if (provinceId) {
      const province = provinces.find((prov) => prov.id === provinceId);
      setCities(province?.cities || []);
    }
  }, [provinceId, provinces, setValue]);

  const cityId = watch('city');
  useEffect(() => {
    setValue('sector', '');
    setValue('village', '');
    if (cityId) {
      const city = cities.find((cty) => cty.id === cityId);
      setSectors(city?.sectors || []);
    }
  }, [cityId, cities, setValue]);

  const sectorId = watch('sector');
  useEffect(() => {
    setValue('village', '');
    if (sectorId) {
      const sector = sectors.find((sct) => sct.id === sectorId);
      setVillages(sector?.villages || []);
    }
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
                  <Form.Label>
                    Province <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select {...register('province')} isInvalid={!!errors.province}>
                    <option value="">Sélectionner la province</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.province?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Ville/Territoire <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select {...register('city')} disabled={!provinceId} isInvalid={!!errors.city}>
                    <option value="">Sélectionner la ville</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Secteur <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select {...register('sector')} disabled={!cityId} isInvalid={!!errors.sector}>
                    <option value="">Sélectionner le secteur</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.sector?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Village <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select {...register('village')} disabled={!sectorId} isInvalid={!!errors.village}>
                    <option value="">Sélectionner le village</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.village?.message}</Form.Control.Feedback>
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
              <Button variant="secondary" onClick={prevStep} type="button">
                Retour
              </Button>
              <Button variant="primary" type="submit">
                Suivant
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Form4Address;
