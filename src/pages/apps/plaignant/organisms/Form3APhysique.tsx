import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchProfession } from 'features/profession/professionSlice';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { fetchVulnerability } from 'api/fetchData';
import { ProjeSite } from 'types/auth';

const Form3DataRegisterPhysique = (professions: { id: string; name: string }[]) =>
  z
    .object({
      lastName: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' }),
      middleName: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' }).optional(),
      firstName: z.string().min(3, { message: 'Le prénom doit comporter au moins 3 caractères' }),
      gender: z.enum(['Male', 'Female']),
      dateOfBirth: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: 'La date doit être au format YYYY-MM-DD'
      }),
      profession: z.string().min(1, { message: 'La profession est requise' }),
      otherProfession: z.string().optional(),
      vulnerabilityLevel: z.string().optional(),
      phone: z
        .string()
        .optional()
        .or(z.string().regex(/\+243[0-9]{9}$/, 'Le numéro de téléphone doit contenir exactement 9 chiffres après +243')),
      email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }).or(z.literal('')).optional(),
      isComplainantAffected: z.string()
    })
    .superRefine((data, ctx) => {
      const selectedProfession = professions.find((profession) => profession.id === data.profession);

      if (selectedProfession?.name === 'Autres' && !data.otherProfession) {
        ctx.addIssue({
          code: 'custom',
          path: ['otherProfession'],
          message: 'La profession est requise'
        });
      }

      if (data.isComplainantAffected === 'true' && !data.vulnerabilityLevel) {
        ctx.addIssue({
          code: 'custom',
          path: ['vulnerabilityLevel'],
          message: 'Le niveau de vulnérabilité est requis'
        });
      }
    });

interface Form3APhysiqueProps {
  formData: RegerationFormType;
  prevStep: () => void;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form3APhysique: React.FC<Form3APhysiqueProps> = ({ formData, prevStep, saveStepData }) => {
  const dispatch = useAppDispatch();

  const [vulnerability, setVulnerability] = useState<ProjeSite[]>([]);

  const { professions } = useAppSelector((state) => state.profession);

  const schema = Form3DataRegisterPhysique(professions);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastName: formData.complainant.lastName,
      middleName: formData.complainant.middleName,
      firstName: formData.complainant.firstName,
      gender: formData.complainant.gender,
      dateOfBirth: formData.complainant.dateOfBirth,
      profession: formData.complainant.profession,
      phone: formData.complainant.phone,
      email: formData.complainant.email,
      isComplainantAffected: formData.isComplainantAffected,
      vulnerabilityLevel: formData.complainant.vulnerabilityLevel
    }
  });

  const complainantIsAffected = watch('isComplainantAffected') === 'true';
  const selectedProfession = watch('profession');
  const isOtherProfessionDisabled = professions.find((profession) => profession.id === selectedProfession)?.name.includes('Autres');

  useEffect(() => {
    setValue('vulnerabilityLevel', '');
  }, []);

  useEffect(() => {
    dispatch(fetchProfession());
  }, [dispatch]);

  useEffect(() => {
    const loadProvinces = async () => {
      const fetchvulnerability = await fetchVulnerability();
      setVulnerability(fetchvulnerability);
    };

    loadProvinces();
  }, []);

  const onSubmit = (data: z.infer<typeof schema>) => {
    const newData = {
      ...formData,
      complainant: {
        ...formData.complainant,
        lastName: data.lastName,
        middleName: data.middleName,
        firstName: data.firstName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        profession: data.profession,
        phone: data.phone,
        email: data.email
      }
    };

    if (data.otherProfession) {
      newData.complainant.otherProfession = data.otherProfession;
    }
    if (data.vulnerabilityLevel && complainantIsAffected) {
      newData.complainant.vulnerabilityLevel = data.vulnerabilityLevel;
    }

    dispatch(saveStepData(newData));
  };

  return (
    <div className="form3a-physique-container">
      <h2 className="section-title mb-4">Identification du/de la plaignant(e)</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                Nom <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control type="text" {...register('lastName')} isInvalid={!!errors.lastName} />
              <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Post-nom</Form.Label>
              <Form.Control type="text" {...register('middleName')} />
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                Prénom <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control type="text" {...register('firstName')} isInvalid={!!errors.firstName} />
              <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                Genre <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select {...register('gender')} isInvalid={!!errors.gender}>
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                Date de naissance <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control type="date" {...register('dateOfBirth')} isInvalid={!!errors.dateOfBirth} />
              <Form.Control.Feedback type="invalid">{errors.dateOfBirth?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                Profession <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select {...register('profession')} isInvalid={!!errors.profession}>
                <option value="">Sélectionner la profession</option>
                {professions.map((profession) => (
                  <option key={profession.id} value={profession.id}>
                    {profession.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.profession?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Autres profession</Form.Label>
              <Form.Control
                type="text"
                {...register('otherProfession')}
                disabled={!isOtherProfessionDisabled}
                isInvalid={!!errors.otherProfession}
              />
              <Form.Control.Feedback type="invalid">{errors.otherProfession?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Numéro de téléphone</Form.Label>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    placeholder="Entrez le numéro de téléphone"
                    value={value}
                    onChange={onChange}
                    defaultCountry="CD"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                Etes-vous concerné par la plainte ? <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select {...register('isComplainantAffected')} isInvalid={!!errors.isComplainantAffected}>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.isComplainantAffected?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Vulnérabilité</Form.Label>
              <Form.Select {...register('vulnerabilityLevel')} disabled={!complainantIsAffected} isInvalid={!!errors.vulnerabilityLevel}>
                <option value="">Sélectionner le niveau vulnérabilité</option>
                {vulnerability.map((vulnerable) => (
                  <option key={vulnerable.id} value={vulnerable.id}>
                    {vulnerable.name}
                  </option>
                ))}
                <option value="autre">Autre</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.vulnerabilityLevel?.message}</Form.Control.Feedback>
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
    </div>
  );
};

export default Form3APhysique;
