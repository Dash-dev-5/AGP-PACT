import { z } from 'zod';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  saveAnonymousStepData,
  prevAnonymousStep,
  saveSpeciesAnonymousData,
  deleteAnonymousSpeciesByIndex,
  updateAnonymousSpeciesByIndex,
  deleteAnonymousVictimeByIndex,
  resetAnonymousForm,
  saveVictimesAnonymousData,
  updateAnonymousVictimeByIndex,
  submitAnonymousRegstrationForm
} from 'features/dataManagement/anonynousRegistrationSteps/anonynousRegistrationStepsSlice';
import Form5Victimes, { Form5VictimesDataType } from 'pages/apps/plaignant/organisms/Form5Victimes';
import Form6FinalSubmit from 'pages/apps/plaignant/organisms/Form6FinalSubmit';
import { Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'assets/images/landing/Logo_AGP_PACT_COULEUR.png';

const AnonymousComplaint = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const handleClose = () => navigate('/');

  const dispatchedPrevStep = () => dispatch(prevAnonymousStep());
  const dispatchedDeleteAnonymousVictimeByIndex = (index: number) => dispatch(deleteAnonymousVictimeByIndex(index));
  const dispatchedUpdateAnonymousVictimeByIndex = (index: number, data: any) => dispatch(updateAnonymousVictimeByIndex({ index, data }));
  const dispatchedSaveVictimesAnonymousData = (data: any) => dispatch(saveVictimesAnonymousData(data));

  const dispatchedSaveSpeciesAnonymousData = (data: any) => dispatch(saveSpeciesAnonymousData(data));
  const dispatchedUpdateAnonymousSpeciesByIndex = (index: number, data: any) => dispatch(updateAnonymousSpeciesByIndex({ index, data }));
  const dispatchedDeleteAnonymousSpeciesByIndex = (index: number) => dispatch(deleteAnonymousSpeciesByIndex(index));

  const { formData, step } = useAppSelector((state) => state.dataManagement.anonynousRegistrationSteps);

  const submitForm5Victimes = (data: z.infer<typeof Form5VictimesDataType>) => {
    dispatch(
      saveAnonymousStepData({
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
      await dispatch(submitAnonymousRegstrationForm(formData)).unwrap();
      dispatch(resetAnonymousForm());
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

  return (
    <div style={{ backgroundColor: '#F0F0F0', padding: '20px', minHeight: '100vh' }}>
      <div className="container">
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography>
              <Image src={Logo} style={{ width: '100px', height: '100px' }} onClick={() => navigate('/')} />
            </Typography>
            <Typography variant="h3" className="mt-2 fs-3" color={'#009fe3'}>
              Plainte Anonyme
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {step === 1 && (
              <Form5Victimes
                formData={formData}
                onSubmit={submitForm5Victimes}
                handleClose={handleClose}
                saveSpeciesData={dispatchedSaveSpeciesAnonymousData}
                updateSpeciesByIndex={dispatchedUpdateAnonymousSpeciesByIndex}
                deleteSpeciesByIndex={dispatchedDeleteAnonymousSpeciesByIndex}
              />
            )}
            {step === 2 && (
              <Form6FinalSubmit
                prevStep={dispatchedPrevStep}
                deleteVictimeByIndex={dispatchedDeleteAnonymousVictimeByIndex}
                formData={formData}
                onSubmit={submitForm6Final}
                saveVictimesData={dispatchedSaveVictimesAnonymousData}
                updateVictimeByIndex={dispatchedUpdateAnonymousVictimeByIndex}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography component={Link} to={'/'} variant="body1" color="red" sx={{ textDecoration: 'none' }}>
                Abandonné
              </Typography>
              <Typography component={Link} to={'/login'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                Vous avez déjà un compte ?
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AnonymousComplaint;
