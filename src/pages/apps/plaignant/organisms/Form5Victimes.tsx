import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import FileUpload, { UploadedFile } from 'layout/Component/fileUpload';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { fetchIncidentCausesAsync } from 'features/activities/incidentCause';
import { ICity, ISector, IVillage } from 'features/province/provinceType';
import { fetchProvinces } from 'features/province/provinceSlice';
import Form5VictimesEspeces from './Form5VictimesEspeces';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { AnonymousRegistrationForm } from 'features/dataManagement/anonynousRegistrationSteps/anonynousRegistrationStepsType';
import { ComplaintRegistrationForm } from 'features/dataManagement/complainantComplaintSteps/complainantComplaintStepsType';

export const Form5VictimesDataType = z.object({
  incidentStartDate: z.string().min(1, { message: 'La date est requise' }),
  incidentEndDate: z.string().min(1, { message: 'La date est requise' }),
  type: z.string().min(1, { message: 'La cause est requise' }),
  description: z.string().min(1, { message: 'La description est requise' }),
  province: z.string().min(1, { message: 'La province est requise' }),
  city: z.string().min(1, { message: 'La ville est requise' }),
  sector: z.string().min(1, { message: 'Le secteur est requis' }),
  village: z.string().min(1, { message: 'Le village est requis' }),
  addressLine1: z.string().or(z.literal(''))
  ,
  isSensitive: z.boolean().optional()
});

interface Form5VictimesProps {
  onSubmit: (data: z.infer<typeof Form5VictimesDataType>) => void;
  prevStep?: () => void;
  saveSpeciesData: (data: any) => void;
  deleteSpeciesByIndex: (index: number) => void;
  updateSpeciesByIndex: (index: number, data: any) => void;
  formData: RegerationFormType | AnonymousRegistrationForm | ComplaintRegistrationForm;
  handleClose?: () => void;
}

const Form5Victimes: React.FC<Form5VictimesProps> = ({
  onSubmit,
  prevStep,
  saveSpeciesData,
  formData, 
  handleClose,
  deleteSpeciesByIndex,
  updateSpeciesByIndex
}) => {
  const dispatch = useAppDispatch();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { provinces } = useAppSelector((state) => state.province);
  const { incidentCauses } = useAppSelector((state) => state.type);
  

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof Form5VictimesDataType>>({
    resolver: zodResolver(Form5VictimesDataType),
    defaultValues: {
      incidentStartDate: formData.incidentStartDate,
      incidentEndDate: formData.incidentEndDate,
      type: formData.type,
      description: formData.description,
      province: formData.province,
      city: formData.city,
      sector: formData.sector,
      village: formData.village,
      addressLine1: formData.addressLine1,
      isSensitive: !!formData.isSensitive, // Pass the initial value from formData
    }
  });
   
  const selectedType = watch('type');

  useEffect(() => {
    const selectedCause = incidentCauses.find((cause) => cause.id === selectedType);
    if (selectedCause) {
      const sensitiveValue = selectedCause.isSensitive;
      setValue('isSensitive', sensitiveValue); // Directly update the form value
      console.log('Valeur de isSensitive:', sensitiveValue);

      // Ajouter la valeur de isSensitive dans le store Redux
      dispatch({
        type: 'incident/updateIsSensitive',
        payload: sensitiveValue,
      });
    }
  }, [selectedType, incidentCauses, dispatch]);

  const [cities, setCities] = useState<ICity[]>([]);
  const [sectors, setSectors] = useState<ISector[]>([]);
  const [villages, setVillages] = useState<IVillage[]>([]);


  useEffect(() => {
    dispatch(fetchProvinces());
  }, []);

  const provinceId = watch('province');
  useEffect(() => {
    setValue('city', '');
    setValue('sector', '');
    setValue('village', '');
    if (provinceId) {
      const province = provinces?.find((province) => province.id === provinceId);
      setCities(province?.cities || []);
    }
  }, [provinceId]);

  const filteredProvinces = provinces.filter((province) => province.isProjectConcern === true);

  const cityId = watch('city');
  useEffect(() => {
    setValue('sector', '');
    setValue('village', '');
    if (cityId) {
      const city = cities.find((city) => city.id === cityId);
      setSectors(city?.sectors || []);
    }
  }, [cityId]);

  const sectorId = watch('sector');
  useEffect(() => {
    setValue('village', '');
    if (sectorId) {
      const sector = sectors.find((sector) => sector.id === sectorId);
      setVillages(sector?.villages || []);
    }
  }, [sectorId]);

  useEffect(() => {
    dispatch(fetchIncidentCausesAsync());
  }, []);

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  return (
    <div className="form5-victimes-container">
      <Row>
        <Col md={12} className="mb-4">
          <h2 className="section-title">Incident</h2>
        </Col>

        <Col md={12} className="mb-4">
          <Form className="incident-form">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Date début incident <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control type="date" {...register('incidentStartDate')} isInvalid={!!errors.incidentStartDate} />
                  <Form.Control.Feedback type="invalid">{errors.incidentStartDate?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date fin incident</Form.Label>
                  <Form.Control type="date" {...register('incidentEndDate')} isInvalid={!!errors.incidentEndDate} />
                  <Form.Control.Feedback type="invalid">{errors.incidentEndDate?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Cause de l'incident <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select {...register('type')} isInvalid={!!errors.type}>
                    <option value="">Sélectionner la cause de l'incident</option>
                    {incidentCauses.map((cause) => (
                      <option
                      key={cause.id}
                      value={cause.id}
                      >
                      {cause.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.type?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <div className="location-section">
        <h2 className="section-title">Localisation de l'incident</h2>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Province <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select {...register('province')}   isInvalid={!!errors.province}>
                <option value="">Sélectionner la province</option>
                {filteredProvinces.map((province) => (
                  <option key={province.id} value={province.id}>
                  {province.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.province?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
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

          <Col md={6}>
            <Form.Group className="mb-3">
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

          <Col md={6}>
            <Form.Group className="mb-3">
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

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control as="textarea" rows={3} {...register('addressLine1')} style={{ resize: 'none' }} />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="description-section mb-4">
        <Form.Group className="mb-3">
          <Form.Label>
            Description <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control as="textarea" rows={3} {...register('description')} style={{ resize: 'none' }} isInvalid={!!errors.description} />
          <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
        </Form.Group>
      </div>
{/* 
      <div className="file-upload-section mb-4">
        <FileUpload onFilesChange={handleFilesChange} />
      </div> */}
     
        {!watch('isSensitive') && (
          <div className="species-data-section"> 
            <Form5VictimesEspeces
              saveSpeciesData={saveSpeciesData}
              formData={formData}
              deleteSpeciesByIndex={deleteSpeciesByIndex}
              updateSpeciesByIndex={updateSpeciesByIndex}
            />
          </div>
        )}

      <div className="action-buttons d-flex justify-content-between mt-4">
        {prevStep && (
          <Button variant="secondary" onClick={prevStep} type="button">
            Retour
          </Button>
        )}
        {handleClose && (
          <Button variant="secondary" onClick={handleClose} type="button">
            Fermer
          </Button>
        )}
        <Button variant="primary" onClick={handleSubmit(onSubmit)} type="button">
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default Form5Victimes;
