import { useAppDispatch, useAppSelector } from 'app/hooks';

import Form5Victimes, { Form5VictimesDataType } from './plaignant/organisms/Form5Victimes';
import Form2Identification from './plaignant/organisms/Form2Identification';
import Form3PersonneJuridique from './plaignant/organisms/Form3PersonneJuridique';
import Form4Address from './plaignant/organisms/Form4Address';
import Form6FinalSubmit from './plaignant/organisms/Form6FinalSubmit';

import {
  prevAdminStep,
  deleteAdminVictimeByIndex,
  resetAdminForm, 
  saveAdminSpeciesData,
  updateAdminSpeciesByIndex,
  deleteAdminSpeciesByIndex,
  saveAdminStepData,
  
  saveAdminVictimesData,
  updateAdminVictimeByIndex,
  submitRegstrationForm
} from 'features/dataManagement/adminComplaintSteps/adminComplaintStepsSlice';

// Victimes  [prevStep✅, saveStepData✅, saveSpeciesData✅]

// Submits [prevStep✅, resetForm✅, submitRegstrationForm✅, saveVictimesData✅,updateVictimeByIndex✅,deleteVictimeByIndex✅]

import { z } from 'zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function FormPlainteGeneraleAdmin() {
  const { step, formData } = useAppSelector((state) => state.dataManagement.adminRegistrationSteps);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitForm5Victimes = (data: z.infer<typeof Form5VictimesDataType>) => {
    dispatch(
      saveAdminStepData({
        ...formData,
        incidentStartDate: data.incidentStartDate,
        incidentEndDate: data.incidentEndDate,
        type: data.type,
        isSensitive: data.isSensitive,
        description: data.description,
        province: data.province,
        city: data.city,
        sector: data.sector,
        village: data.village,
        addressLine1: data.addressLine1,
        
      })
    );
  };

  const submitForm6Final = async () => {
    const toastId = toast.loading('Veuillez patienter...');

    try {
      await dispatch(submitRegstrationForm(formData)).unwrap();
      dispatch(resetAdminForm());
      toast.update(toastId, {
        render: 'Formulaire envoye avec success',
        type: 'success',
        isLoading: false,
        autoClose: 1000
      });
      navigate('/gestion/plainte');
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

  const dispatchedPrevStep = () => dispatch(prevAdminStep());
  const dispatchedSaveSpeciesData = (data: any) => dispatch(saveAdminSpeciesData(data));
  const dispatchedUpdateSpeciesByIndex = (index: number, data: any) => dispatch(updateAdminSpeciesByIndex({ index, data }));
  const dispatchedDeleteSpeciesByIndex = (index: number) => dispatch(deleteAdminSpeciesByIndex(index));

  const dispatchedUpdateVictimeByIndex = (index: number, data: any) => dispatch(updateAdminVictimeByIndex({ index, data }));
  const dispatchedDeleteVictimeByIndex = (index: number) => dispatch(deleteAdminVictimeByIndex(index));
  const dispatchedSaveVictimesData = (data: any) => dispatch(saveAdminVictimesData(data));

  return (
    <>
      {step === 1 && <Form2Identification formData={formData} saveStepData={saveAdminStepData} />}
      {step === 2 && <Form3PersonneJuridique formData={formData} prevStep={dispatchedPrevStep} saveStepData={saveAdminStepData} />}
      {step === 3 && <Form4Address formData={formData} prevStep={dispatchedPrevStep} saveStepData={saveAdminStepData} />}
      {step === 4 && (
      <Form5Victimes
        onSubmit={submitForm5Victimes}
        prevStep={dispatchedPrevStep}
        saveSpeciesData={dispatchedSaveSpeciesData}
        formData={formData}
        updateSpeciesByIndex={dispatchedUpdateSpeciesByIndex} 
        deleteSpeciesByIndex={dispatchedDeleteSpeciesByIndex}
      />
      )}
      {step === 5 && (
      <Form6FinalSubmit
        prevStep={dispatchedPrevStep}
        onSubmit={submitForm6Final}
        saveVictimesData={dispatchedSaveVictimesData}
        updateVictimeByIndex={dispatchedUpdateVictimeByIndex}
        deleteVictimeByIndex={dispatchedDeleteVictimeByIndex}
        formData={formData}
      />
      )}
      {step === 6 && (
      <div>
        <h2>Résumé des informations</h2>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        <button onClick={dispatchedPrevStep}>Retour</button>
        <button onClick={submitForm6Final}>Soumettre</button>
      </div>
      )}
    </>
  );
}

export default FormPlainteGeneraleAdmin;
