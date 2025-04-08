import { zodResolver } from '@hookform/resolvers/zod';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export const Form2IdentificationDataType = z.object({
  legalPersonality: z.enum(['Juridical Person', 'Natural Person'])
});

interface Form2IdentificationProps {
  prevStep?: () => void;
  formData: RegerationFormType;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form2Identification: React.FC<Form2IdentificationProps> = ({ prevStep, formData, saveStepData }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof Form2IdentificationDataType>>({
    resolver: zodResolver(Form2IdentificationDataType),
    defaultValues: { legalPersonality: formData.complainant.legalPersonality }
  });

  const onSubmit = (data: z.infer<typeof Form2IdentificationDataType>) => {
    dispatch(saveStepData({ complainant: { ...formData.complainant, legalPersonality: data.legalPersonality } }));
  };

  return (
    <div>
      <div style={{ height: '27.5rem' }}>
        <div className="mb-4">
          <span className="fs-4 fw-bold">Identification</span>
        </div>
        <div>
          <p className="fw-bold fs-6">La partie plaignante est elle une :</p>
          <Form.Check
            label={<label htmlFor="naturalPerson">Personne Physique ?</label>}
            id="naturalPerson"
            type="radio"
            value="Natural Person"
            className="mb-4 fs-5"
            {...register('legalPersonality')}
          />
          <Form.Check
            label={<label htmlFor="juridicalPerson">Personne Morale (Entreprise, Ong, Organisation) ?</label>}
            id="juridicalPerson"
            type="radio"
            value="Juridical Person"
            className="mb-4 fs-5"
            {...register('legalPersonality')}
          />
        </div>
      </div>
      <div
        className="d-flex justify-content-between"
        style={{
          padding: '10px', 
          backgroundColor: 'white'
        }}
      >
        {prevStep ? (
          <Button variant="secondary" onClick={() => prevStep()} type="button">
            Retour
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => navigate(-1)} type="button">
            Retour
          </Button>
        )}
        <Button variant="primary" type="button" onClick={handleSubmit(onSubmit)}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default Form2Identification;
