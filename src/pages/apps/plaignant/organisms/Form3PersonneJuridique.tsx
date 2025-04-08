import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import Form3APhysique from './Form3APhysique';
import Form3BMorale from './Form3BMorale';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';

interface Form3PersonneJuridiqueProps {
  formData: RegerationFormType;
  prevStep: () => void;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form3PersonneJuridique: React.FC<Form3PersonneJuridiqueProps> = ({ formData, prevStep, saveStepData }) => {
  return (
    <>
      {formData.complainant.legalPersonality === 'Natural Person' && (
        <Form3APhysique saveStepData={saveStepData} formData={formData} prevStep={prevStep} />
      )}
      {formData.complainant.legalPersonality === 'Juridical Person' && (
        <Form3BMorale saveStepData={saveStepData} formData={formData} prevStep={prevStep} />
      )}
    </>
  );
};

export default Form3PersonneJuridique;
