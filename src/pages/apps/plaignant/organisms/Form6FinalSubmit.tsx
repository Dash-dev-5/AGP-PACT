import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import RegisterVictimes from './RegisterVictimes';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { AnonymousRegistrationForm } from 'features/dataManagement/anonynousRegistrationSteps/anonynousRegistrationStepsType';
import { ComplaintRegistrationForm } from 'features/dataManagement/complainantComplaintSteps/complainantComplaintStepsType';

interface Form6FinalSubmitProps {
  prevStep: () => void;
  onSubmit: () => Promise<void>;
  saveVictimesData: (data: any) => void;
  updateVictimeByIndex: (index: number, data: any) => void;
  deleteVictimeByIndex: (index: number) => void;
  formData: RegerationFormType | AnonymousRegistrationForm | ComplaintRegistrationForm;
}

const FormSummary: React.FC<{ formData: any }> = ({ formData }) => {
  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h5>Résumé des formulaires</h5>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
};

const Form6FinalSubmit: React.FC<Form6FinalSubmitProps> = ({
  prevStep,
  onSubmit,
  deleteVictimeByIndex,
  saveVictimesData,
  updateVictimeByIndex,
  formData
}) => {
  const { handleSubmit } = useForm();

  return (
    <>
      <FormSummary formData={formData} />
      <RegisterVictimes
        saveVictimesData={saveVictimesData}
        updateVictimeByIndex={updateVictimeByIndex}
        deleteVictimeByIndex={deleteVictimeByIndex}
        formData={formData}
      />
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex justify-content-between"
        style={{
          padding: '10px',
          backgroundColor: 'white'
        }}
      >
        <Button variant="secondary" onClick={() => prevStep()} type="button">
          Retour
        </Button>

        <Button variant="primary" type="submit">
          Envoyer
        </Button>
      </Form>
    </>
  );
};

export default Form6FinalSubmit;
