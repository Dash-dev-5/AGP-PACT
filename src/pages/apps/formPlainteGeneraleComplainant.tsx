import {
  resetComplainantForm,
  deleteComplainantVictimeByIndex,
  prevComplainantStep,
  saveComplainantStepData,
  saveSpeciesComplainantData,
  updateComplainantSpeciesByIndex,
  deleteComplainantSpeciesByIndex,
  saveVictimesComplainantData,
  updateComplainantVictimeByIndex,
  submitComplainantRegstrationForm
} from 'features/dataManagement/complainantComplaintSteps/complainantComplaintStepsSlice';
import React from 'react';
import Form5Victimes, { Form5VictimesDataType } from './plaignant/organisms/Form5Victimes';
import Form6FinalSubmit from './plaignant/organisms/Form6FinalSubmit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';

const FormPlainteGeneraleComplainant = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const navigate = useNavigate();
  const handleClose = () => navigate(-1);

  const dispatchedPrevStep = () => dispatch(prevComplainantStep());
  const dispatchedDeleteComplainantVictimeByIndex = (index: number) => dispatch(deleteComplainantVictimeByIndex(index));
  const dispatchedUpdateComplainantVictimeByIndex = (index: number, data: any) =>
    dispatch(updateComplainantVictimeByIndex({ index, data }));
  const dispatchedSaveVictimesComplainantData = (data: any) => dispatch(saveVictimesComplainantData(data));

  const dispatchedSaveSpeciesComplainantData = (data: any) => dispatch(saveSpeciesComplainantData(data));
  const dispatchedUpdateSpeciesComplainantData = (index: number, data: any) => dispatch(updateComplainantSpeciesByIndex({ index, data }));
  const dispatchedDeleteSpeciesComplainantData = (index: number) => dispatch(deleteComplainantSpeciesByIndex(index));

  const { formData, step } = useAppSelector((state) => state.dataManagement.complainantComplaintSteps);

  const submitForm5Victimes = (data: z.infer<typeof Form5VictimesDataType>) => {
    dispatch(
      saveComplainantStepData({
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

    try {
      await dispatch(submitComplainantRegstrationForm({ ...formData, complainant: user?.id })).unwrap();
      dispatch(resetComplainantForm());
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
    }
  };

  return (
    <React.Fragment>
      {step === 1 && (
        <Form5Victimes
          formData={formData}
          onSubmit={submitForm5Victimes}
          handleClose={handleClose}
          saveSpeciesData={dispatchedSaveSpeciesComplainantData}
          updateSpeciesByIndex={dispatchedUpdateSpeciesComplainantData}
          deleteSpeciesByIndex={dispatchedDeleteSpeciesComplainantData}
        />
      )}
      {step === 2 && (
        <Form6FinalSubmit
          prevStep={dispatchedPrevStep}
          deleteVictimeByIndex={dispatchedDeleteComplainantVictimeByIndex}
          formData={formData}
          onSubmit={submitForm6Final}
          saveVictimesData={dispatchedSaveVictimesComplainantData}
          updateVictimeByIndex={dispatchedUpdateComplainantVictimeByIndex}
        />
      )}
    </React.Fragment>
  );
};

export default FormPlainteGeneraleComplainant;
