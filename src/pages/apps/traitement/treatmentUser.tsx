import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { getTraitements } from 'features/traintement/traitementSlice';
import { FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material';
import { fetchCommitteesAsync } from 'features/commitee/committeeSlice';
// import { updateFiveStep, updateFourStep, updateSecondStep, updateThreeStep } from 'features/stepForm/stepSlice';
import { useParams } from 'react-router-dom';
import { fetchComplaints } from 'features/complaint/complaintSlice';
import { putRequest } from 'utils/verbes';
// import { UpdateStepFiveOne } from 'types/stepFormType';

export default function c() {
  //complaint id
  const { id } = useParams();
  const { complaints } = useAppSelector((state) => state.complaint);
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [formValues, setFormValues] = React.useState<Record<number, any>>({});
  const [currentPageState, setCurrentPageState] = React.useState<number>(0);

  // const [activeStep, setActiveStep] = useState(1);
  const dispatch = useAppDispatch();
  const { traitementData, loading } = useSelector((state: RootState) => state.traitement);
  const { committees } = useAppSelector((state) => state.committee);

  //compare local step with api step
  const pageSizeComplaint = 12000;

  const detailComplaint = complaints.data.find((item) => item.id === id!);
  console.log('detailComplaint:', detailComplaint?.tracking);

  //Fetch all committee
  const pageSize = 20;
  React.useEffect(() => {
    dispatch(fetchCommitteesAsync({ pageSize, currentPage: currentPageState, filter: '' }));
  }, [dispatch, currentPageState]);

  React.useEffect(() => {
    dispatch(getTraitements());
  }, [dispatch]);

  //Next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    handleSubmitStepFive(activeStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormValues({});
  };

  interface FileUploadProps {
    onChange: (file: File | null) => void;
  }

  const handleChange = (stepIndex: number, field: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [stepIndex]: {
        ...prevValues[stepIndex],
        [field]: value
      }
    }));
  };

  const handleClick = () => {
    // Logique pour gérer l'envoi de la plainte en justice
    console.log('Plainte envoyée en justice');
  };

  //Submit step five
  const handleSubmitStepFive = async (index: number) => {
    const stepValues = formValues[index];
    // const data: UpdateStepFiveOne = {
    //   complaint: id !== undefined ? id : '',
    //   isSolutionAccepted: stepValues.isSolutionAccepted === 'true',
    //   refusalReason: stepValues.refusalReason
    // };

    try {
      // const result = await dispatch(updateFiveStep(data)).unwrap();
      // console.log('response:', result);
      // return result;
    } catch (error) {
      console.log('errorrr', error);
    }
  };

  type FormValues = {
    proposedSolution?: string;
    isSolutionAccepted?: string;
    refusalReason?: string;
    cardNumber?: string;
    plaignaAnswer?: string;
  };

  interface RenderFormContentProps {
    step: { status: string; name: string };
    index: number;
    formValues: FormValues[];
    handleChange: (index: number, field: string, value: string) => void;
  }

  // Ajout des formulaires spécifiques pour chaque étape
  const renderFormContent = (step: any, index: number) => {
    switch (index) {
      case 0: // Form step one
        return (
          <>
            <span>La plainte est enregistrée</span>
          </>
        );
      case 1: // Form step two
        return <></>;
      case 2: // Form step three
        return <></>;
      case 3: // Formulaire pour la troisième étape
        return (
          <>
            <TextField
              label="La réponse du manager/admin"
              value={formValues[index]?.proposedSolution || ''}
              onChange={(e) => handleChange(index, 'proposedSolution', e.target.value)}
              fullWidth
              multiline
              rows={5}
              sx={{ mb: 2 }}
            />
          </>
        );
      case 4: // Formulaire pour la troisième étape
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>La réponse du Plaignant</InputLabel>
              <Select
                value={formValues[index]?.isSolutionAccepted || ''}
                onChange={(e) => handleChange(index, 'isSolutionAccepted', e.target.value)}
                label="plaignaAnswer"
              >
                <MenuItem value="">
                  <em>Aucune</em>
                </MenuItem>
                <MenuItem value="true">Oui</MenuItem>
                <MenuItem value="false">Non</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="La réponse de l'admin"
              value={formValues[index]?.refusalReason || ''}
              onChange={(e) => handleChange(index, 'refusalReason', e.target.value)}
              fullWidth
              multiline
              rows={5}
              sx={{ mb: 2 }}
              disabled={formValues[index]?.plaignaAnswer === 'non'}
            />
          </>
        );
      case 5: // Formulaire pour la troisième étape
        return <></>;
      case 6: // Formulaire pour la troisième étape
        return <> </>;
      case 7: // Formulaire pour la troisième étape
        return (
          <>
            <TextField
              label="La réponse de la commité"
              value={formValues[index]?.cardNumber || ''}
              onChange={(e) => handleChange(index, 'cardNumber', e.target.value)}
              fullWidth
              multiline
              rows={5}
              sx={{ mb: 2 }}
            />
          </>
        );
      case 8: // Formulaire pour la troisième étape
        return <></>;
      default:
        return <Typography>Aucun formulaire disponible pour cette étape.</Typography>;
    }
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {traitementData.map((step, index) => (
              <Step key={step.position}>
                <StepLabel>{step.name}</StepLabel>
                <StepContent>
                  {index === 0 && activeStep > 0 ? null : renderFormContent(step, index)}
                  <Box sx={{ mb: 2 }}>
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                      {index === traitementData.length - 1 ? 'Terminer' : 'Continuer'}
                    </Button>

                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Retour
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === traitementData.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>Toutes les étapes sont complétées - Vous avez terminé !</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Réinitialiser
              </Button>
              <Typography variant="body2">Valeurs du formulaire: {JSON.stringify(formValues, null, 2)}</Typography>
            </Paper>
          )}
        </Box>
      )}
    </>
  );
}
