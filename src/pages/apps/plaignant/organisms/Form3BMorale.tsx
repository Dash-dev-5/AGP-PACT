import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { useAppDispatch } from 'app/hooks';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

const Form3DataRegisterMorale = z.object({
  fullName: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères' }).nonempty({ message: 'Le nom est requis' }),
  organizationStatus: z.enum(['Public', 'Private', 'Other']),
  legalPersonality: z.enum(['Juridical Person', 'Natural Person']),
  phone: z
    .string()
    .nonempty({ message: 'Le numéro de téléphone est requis' })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Le numéro de téléphone doit être valide' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }).optional()
});

interface Form3BMoraleProps {
  formData: RegerationFormType;
  prevStep: () => void;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form3BMorale: React.FC<Form3BMoraleProps> = ({ formData, prevStep, saveStepData }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<z.infer<typeof Form3DataRegisterMorale>>({
    resolver: zodResolver(Form3DataRegisterMorale),
    defaultValues: {
      fullName: formData.complainant.fullName,
      organizationStatus: formData.complainant.organizationStatus,
      legalPersonality: formData.complainant.legalPersonality,
      phone: formData.complainant.phone,
      email: formData.complainant.email
    }
  });

  const onSubmit = (data: z.infer<typeof Form3DataRegisterMorale>) => {
    dispatch(
      saveStepData({
        ...formData,
        complainant: {
          ...formData.complainant,
          fullName: data.fullName,
          organizationStatus: data.organizationStatus,
          legalPersonality: data.legalPersonality,
          phone: data.phone,
          email: data.email
        }
      })
    );
  };

  return (
    <div>
      <div className="mb-4 mt-3">
        <span className="fs-4 fw-bold">Identification de l'organisation</span>
      </div>
      <div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
          {/* FullName */}
          <Form.Group className="col mb-3">
            <Form.Label htmlFor="fullName">Nom de l'organisation / ONG</Form.Label>
            <Form.Control id="fullName" type="text" {...register('fullName')} isInvalid={!!errors.fullName} />
            <Form.Control.Feedback type="invalid">{errors.fullName?.message}</Form.Control.Feedback>
          </Form.Group>
          {/* Organization Status */}
          <Form.Group className="col mb-3">
            <Form.Label>Statut de l'organisation</Form.Label>
            <Form.Select {...register('organizationStatus')} isInvalid={!!errors.organizationStatus}>
              <option value="">Choisir un statut</option>
              <option value="Public">Public</option>
              <option value="Private">Privé</option>
              <option value="Other">Autre</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.organizationStatus?.message}</Form.Control.Feedback>
          </Form.Group>
          {/* Legal Personality */}
          <Form.Group className="col mb-3">
            <Form.Label>Personnalité juridique</Form.Label>
            <Form.Select {...register('legalPersonality')} isInvalid={!!errors.legalPersonality}>
              <option value="">Choisir une personnalité</option>
              <option value="Natural Person">Personne naturelle</option>
              <option value="Juridical Person">Personne juridique</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.legalPersonality?.message}</Form.Control.Feedback>
          </Form.Group>
          {/* Phone */}
          <Form.Group className="col mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="Entrez le numéro de téléphone"
                  defaultCountry="CD"
                  international
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
          </Form.Group>
          {/* Email */}
          <Form.Group className="col mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={() => prevStep()} type="button">
            Retour
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit(onSubmit)}>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Form3BMorale;
