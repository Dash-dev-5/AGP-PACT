import { useAppDispatch, useAppSelector } from 'app/hooks';
import Form1Creation, { Form1VictimeDataType } from './organisms/Form1Creation';

import Form2Identification, { Form2IdentificationDataType } from './organisms/Form2Identification';
import Form3PersonneJuridique from './organisms/Form3PersonneJuridique';
import Form4Address from './organisms/Form4Address';
import Form5Victimes, { Form5VictimesDataType } from './organisms/Form5Victimes';
import Form6FinalSubmit from './organisms/Form6FinalSubmit';

// Victimes  [prevStep✅, saveStepData✅, saveSpeciesData✅]

// Submits [prevStep✅, resetForm✅, submitRegstrationForm✅, saveVictimesData✅,updateVictimeByIndex✅,deleteVictimeByIndex✅]
import {
  prevStep,
  saveSpeciesData,
  saveStepData,
  resetForm,
  submitRegstrationForm,
  saveVictimesData,
  updateVictimeByIndex,
  deleteVictimeByIndex,
  updateSpeciesByIndex,
  deleteSpeciesByIndex
} from 'features/dataManagement/registrationSteps/registrationStepsSlice';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreatePlaignantForm() {
  const { step, formData } = useAppSelector((state) => state.dataManagement.registrationSteps);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitForm5Victimes = (data: z.infer<typeof Form5VictimesDataType>) => {
    dispatch(
      saveStepData({
        ...formData,
        incidentStartDate: data.incidentStartDate,
        incidentEndDate: data.incidentEndDate,
        type: data.type,
        description: data.description,
        province: data.province,
        city: data.city,
        sector: data.sector,
        village: data.village,
        addressLine1: data.addressLine1
      })
    );
  };

  const submitForm6Final = async () => {
    const toastId = toast.loading('Veuillez patienter...');
    console.log(formData);

    try {
      await dispatch(submitRegstrationForm(formData)).unwrap(); 
      dispatch(resetForm());
      toast.update(toastId, {
        render: 'Formulaire envoye avec success',
        type: 'success',
        isLoading: false,
        autoClose: 1000
      });
      navigate('/login');
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
        type: 'error',
        isLoading: false,
        autoClose: 1000
      });
      console.error(error);
    }
  };

  const dispatchedPrevStep = () => dispatch(prevStep());
  const dispatchedSaveSpeciesData = (data: any) => dispatch(saveSpeciesData(data));
  const dispatchedUpdateSpeciesData = (index: number, data: any) => dispatch(updateSpeciesByIndex({ index, data }));
  const dispatchedDeleteSpeciesData = (index: number) => dispatch(deleteSpeciesByIndex(index));

  const dispatchedUpdateVictimeByIndex = (index: number, data: any) => dispatch(updateVictimeByIndex({ index, data }));
  const dispatchedDeleteVictimeByIndex = (index: number) => dispatch(deleteVictimeByIndex(index));
  const dispatchedSaveVictimesData = (data: any) => dispatch(saveVictimesData(data));

  return (
    <>
      {step === 1 && <Form1Creation formData={formData} saveStepData={saveStepData} />}
      {step === 2 && <Form2Identification formData={formData} prevStep={dispatchedPrevStep} saveStepData={saveStepData} />}
      {step === 3 && <Form3PersonneJuridique formData={formData} prevStep={dispatchedPrevStep} saveStepData={saveStepData} />}
      {step === 4 && <Form4Address formData={formData} prevStep={dispatchedPrevStep} saveStepData={saveStepData} />}
      {step === 5 && (
        <Form5Victimes
          onSubmit={submitForm5Victimes}
          prevStep={dispatchedPrevStep}
          saveSpeciesData={dispatchedSaveSpeciesData}
          deleteSpeciesByIndex={dispatchedDeleteSpeciesData}
          updateSpeciesByIndex={dispatchedUpdateSpeciesData}
          formData={formData}
        />
      )}
      {step === 6 && (
        <Form6FinalSubmit
          prevStep={dispatchedPrevStep}
          onSubmit={submitForm6Final}
          saveVictimesData={dispatchedSaveVictimesData}
          updateVictimeByIndex={dispatchedUpdateVictimeByIndex}
          deleteVictimeByIndex={dispatchedDeleteVictimeByIndex}
          formData={formData}
        />
      )}
    </>
  );
}

export default CreatePlaignantForm;
