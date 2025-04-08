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
import {
  updateEightStepTwo,
  updateFiveStepOne,
  updateFiveStepTwo,
  updateFourStep,
  updateSecondStep,
  updateStepSevenOne,
  updateStepSix,
  updateThreeStep
} from 'features/stepForm/stepSlice';
import { useParams } from 'react-router-dom';
import { fetchComplaintById, fetchComplaints } from 'features/complaint/complaintSlice';
import { putRequest } from 'utils/verbes';
import { Complaint, proposedSolution } from 'features/complaint/complaintType';
import CustomToast from 'components/customToast';
import { uploadImageToCloudinary } from 'utils/ImageUploader';
import { Badge } from 'react-bootstrap';

export default function TreatmentComplaint() {
  //complaint id
  const { id } = useParams();
  const { oneComplaint } = useAppSelector((state) => state.complaint);

  const [activeStep, setActiveStep] = React.useState<number>(() => {
    const savedStep = localStorage.getItem('activeStep');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [formValues, setFormValues] = React.useState<Record<number, any>>({});
  const [loadingProvoked, setLoadingProvoked] = React.useState(true);
  const [currentPageState, setCurrentPageState] = React.useState<number>(0);
  const [detailsComplaints, setDetailsComplaints] = React.useState<Complaint>();
  const [proposedSolutionsCommittee, setProposedSolutionsCommitee] = React.useState<proposedSolution>();
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');
  const [image, setImage] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([]);
  const [complaintMessageStepFive, setComplaintMessageStepFive] = React.useState<string>('');
  const [complaintMessageStepSeven, setComplaintMessageStepSeven] = React.useState<string>('');
  const dispatch = useAppDispatch();
  const { traitementData, loading } = useSelector((state: RootState) => state.traitement);
  const { committees } = useAppSelector((state) => state.committee);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  // Function to manage multiple file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  //Dowland urls files
  const handleUpload = async () => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      if (file.size > 5 * 1024 * 1024) {
        // 5 MB size limit
        alert(`Le fichier ${file.name} dépasse la limite de 5 Mo.`);
        continue;
      }

      const url = await uploadImageToCloudinary(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    setUploadedFiles(uploadedUrls);
  };

  //fetch one detail
  React.useEffect(() => {
    if (id) {
      dispatch(fetchComplaintById(id));
    }
  }, [dispatch, id, activeStep]);

  //compare local step with api step
  React.useEffect(() => {
    if (activeStep && oneComplaint) {
      const tracking = oneComplaint.currentStep;
      const lastStep = tracking?.position!;
      const solutionCommittee = oneComplaint?.tracking?.find((t) => t.position === 4);

      setProposedSolutionsCommitee(solutionCommittee?.proposedSolution);

      // if (activeStep > lastStep) {
      setActiveStep(lastStep === 0 ? 1 : lastStep - 1);
      const currentStep = lastStep === 0 ? 1 : lastStep - 1;
      localStorage.setItem('activeStep', currentStep.toString());
      // }
      const timer = setTimeout(() => {
        setLoadingProvoked(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, oneComplaint]);

  //Fetch all committee
  const pageSize = 20;
  React.useEffect(() => {
    dispatch(fetchCommitteesAsync({ pageSize, currentPage: currentPageState, filter: '' }));
  }, [dispatch, currentPageState]);

  //get all treatment steps
  React.useEffect(() => {
    dispatch(getTraitements());
  }, [dispatch]);

  //Saved step in local storage
  React.useEffect(() => {
    localStorage.setItem('activeStep', activeStep.toString());
  }, [activeStep]);

  //Next step
  const handleNext = () => {
    switch (activeStep) {
      case 1:
        // submit step two(idex 1)

        break;

      case 2:
        // submit step three(index 2)

        break;

      case 3:
        // submit step four (index 3)

        break;

      case 4:
        // submit step five (index 4)
        handleSubmitStepFiveTwo(activeStep);

        break;

      case 5:
        // Submmit step six (index 5)
        handleSubmitStepSix(activeStep);
        break;

      case 6:
        // Submit step seven one (index 6)
        handleSubmitStepSevenOne(activeStep);

        break;

      case 7:
        // Submit eight two (index 7)
        handleSubmitStepEightTwo(activeStep);

        break;

      default:
        console.log('No steps to submit');
        break;
    }
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

  //Submit step five two
  const handleSubmitStepFiveTwo = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      isSolutionAccepted: stepValues.isSolutionAccepted === 'true',
      refusalReason: stepValues.refusalReason
    };

    try {
      const result = await dispatch(updateFiveStepOne(dataToSubmit)).unwrap();
      if (result !== null) {
        setComplaintMessageStepFive('Merci pour votre réponse. Cette étape sera clôturée après l’analyse de votre réponse par le comité.');
      }
    } catch (error) {
      console.log('errorrr', error);
    }
  };

  //Submit step six
  const handleSubmitStepSix = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      documents: ['string']
    };
    try {
      const result = await dispatch(updateStepSix(dataToSubmit)).unwrap();
      if (result !== null) {
        putRequest(`processing-step/closed/Complaint/${id!}`)
          .then((response) => {
            console.log('reponse step six', response.data);
            // localStorage.setItem('activeStep', currentStep.toString());
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
          })
          .catch((error) => {
            console.error('error step 6', error);
          });
      }
    } catch (error) {
      console.log('errorrr', error);
    }
  };
  //Submit step seven One
  const handleSubmitStepSevenOne = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      rating: stepValues.rating,
      reason: stepValues.reason
    };
    try {
      const result = await dispatch(updateStepSevenOne(dataToSubmit)).unwrap();
      if (result !== null) {
      }
      setComplaintMessageStepSeven('Merci pour votre réponse. Cette étape sera clôturée après l’analyse de votre réponse par le comité.');
    } catch (error) {
      console.log('errorrr', error);
    }
  };

  const handleSubmitStepEightTwo = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      isSolutionAccepted: stepValues.isSolutionAccepted === 'true',
      refusalReason: stepValues.refusalReason
    };

    try {
      const result = await dispatch(updateEightStepTwo(dataToSubmit)).unwrap();
      if (result !== null) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
      }
    } catch (error) {
      console.log('errorrr', error);
    }
  };

  // Add specific forms for each stage
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
      case 3: // Form steo four
        return <></>;
      case 4: // Form step five two
        return (
          <>
            {oneComplaint ? (
              <>
                <div className="d-flex flex-column">
                  <span>Proposition de la solution :</span>
                  <span className="fw-bold">{proposedSolutionsCommittee?.response}</span>
                </div>
                <div className="d-flex gap-3">
                  <span>Montant :</span>
                  <span className="fw-bold">{oneComplaint.totalPrice} Fc</span>
                </div>

                <FormControl fullWidth sx={{ mb: 2 }} className="mt-3">
                  <InputLabel>La réponse du Plaignant</InputLabel>
                  <Select
                    value={formValues[index]?.isSolutionAccepted || ''}
                    onChange={(e) => handleChange(index, 'isSolutionAccepted', e.target.value)}
                    label="isSolutionAccepted"
                  >
                    <MenuItem value="true">Oui</MenuItem>
                    <MenuItem value="false">Non</MenuItem>
                  </Select>
                </FormControl>
                {formValues[index]?.isSolutionAccepted !== 'true' && (
                  <TextField
                    label="La raison"
                    value={formValues[index]?.refusalReason || ''}
                    onChange={(e) => handleChange(index, 'refusalReason', e.target.value)}
                    fullWidth
                    multiline
                    disabled={formValues[index]?.isSolutionAccepted === 'true'}
                    rows={5}
                    sx={{ mb: 2 }}
                  />
                )}
                {complaintMessageStepFive && (
                  <div>
                    <Badge
                      bg="success"
                      style={{
                        width: '100%',
                        display: 'block',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        padding: '0.5rem',
                        boxSizing: 'border-box',
                        fontSize: '12px',
                        lineHeight: '20px'
                      }}
                    >
                      {complaintMessageStepFive}
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              ''
            )}
          </>
        );
      case 5: // Form step six
        return (
          <>
            <div></div>
          </>
        );
      case 6: // Form step seven
        const satisfactionRating = oneComplaint?.tracking?.find(
          (t) => t.satisfactionRating?.position != null && t.satisfactionRating?.position === 7
        );

        return (
          <>
            {satisfactionRating?.satisfactionRating.isComplainantSatisfied !== false ? (
              <div>
                {oneComplaint?.status !== 'Closed' ? (
                  <div>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>La réponse du Plaignant</InputLabel>
                      <Select
                        value={formValues[index]?.rating || ''}
                        onChange={(e) => handleChange(index, 'rating', e.target.value)}
                        label="Satisfied"
                      >
                        <MenuItem value="false">
                          <em>Aucune</em>
                        </MenuItem>
                        <MenuItem value="Satisfied">Satisfait</MenuItem>
                        <MenuItem value="Partially Satisfied">Pas vraiment Satisfait</MenuItem>
                        <MenuItem value="Dissatisfied">Non Satisfait</MenuItem>
                      </Select>
                    </FormControl>
                    {formValues[index]?.rating !== 'Satisfied' && (
                      <TextField
                        label="La raison"
                        value={formValues[index]?.reason || ''}
                        onChange={(e) => handleChange(index, 'reason', e.target.value)}
                        fullWidth
                        multiline
                        rows={5}
                        sx={{ mb: 2 }}
                        disabled={formValues[index]?.rating === 'Satisfied'}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <Badge
                      bg="success"
                      style={{
                        width: '100%',
                        display: 'block',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        padding: '0.5rem',
                        boxSizing: 'border-box',
                        fontSize: '12px',
                        lineHeight: '20px'
                      }}
                    >
                      La plainte a été clôturée.
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Badge
                  bg="success"
                  style={{
                    width: '100%',
                    display: 'block',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    padding: '0.5rem',
                    boxSizing: 'border-box',
                    fontSize: '12px',
                    lineHeight: '20px'
                  }}
                >
                  Merci pour votre réponse
                </Badge>
              </div>
            )}

            {complaintMessageStepSeven && (
              <div>
                <Badge
                  bg="success"
                  style={{
                    width: '100%',
                    display: 'block',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    padding: '0.5rem',
                    boxSizing: 'border-box',
                    fontSize: '12px',
                    lineHeight: '20px'
                  }}
                >
                  {complaintMessageStepSeven}
                </Badge>
              </div>
            )}
          </>
        );
      case 7:
        const findStepEigthTraking = oneComplaint && oneComplaint?.tracking!.find((t) => t.position === 8);
        const amountProposed = oneComplaint && oneComplaint.totalPrice;

        return (
          <>
            {findStepEigthTraking != null ? (
              <>
                <div className="d-flex flex-column">
                  <span>Une autre solution que les responsables ont proposée :</span>
                  <span className="fw-bold">
                    {findStepEigthTraking?.proposedSolution != null && findStepEigthTraking?.proposedSolution.response}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <span>Montant à payer :</span>
                  <span className="fw-bold">{amountProposed} Fc</span>
                </div>
                <FormControl fullWidth sx={{ mb: 2 }} className="mt-3">
                  <InputLabel>Le plaignant est-il d'accord ?</InputLabel>
                  <Select
                    value={formValues[index]?.isSolutionAccepted || ''}
                    onChange={(e) => handleChange(index, 'isSolutionAccepted', e.target.value)}
                    label="isSolutionAccepted"
                  >
                    <MenuItem value="true">Oui</MenuItem>
                    <MenuItem value="false">Non</MenuItem>
                  </Select>
                </FormControl>
                {formValues[index]?.isSolutionAccepted !== 'true' && (
                  <TextField
                    label="La raison"
                    value={formValues[index]?.refusalReason || ''}
                    onChange={(e) => handleChange(index, 'refusalReason', e.target.value)}
                    fullWidth
                    multiline
                    disabled={formValues[index]?.isSolutionAccepted === 'true'}
                    rows={5}
                    sx={{ mb: 2 }}
                  />
                )}
              </>
            ) : (
              ''
            )}
          </>
        );
      case 8:
        return (
          <>
            {oneComplaint?.status === 'Closed' && (
              <div>
                <Badge
                  bg="success"
                  style={{
                    width: '100%',
                    display: 'block',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    padding: '0.5rem',
                    boxSizing: 'border-box',
                    fontSize: '12px',
                    lineHeight: '20px'
                  }}
                >
                  Plainte envoyer à la justice
                </Badge>
              </div>
            )}
          </>
        );
      default:
        return <Typography>Aucun formulaire disponible pour cette étape.</Typography>;
    }
  };

  function getStepSummaryFromComplaint(oneComplaint: Complaint, stepPosition: number): string | string[] {
    if (!oneComplaint) return 'Information non disponible';

    switch (stepPosition) {
      case 1:
        return `Plainte enregistrée : ${oneComplaint.referenceNumber || 'N/A'}`;
      case 2:
        return `Préjudice : ${oneComplaint.prejudice?.name || 'N/A'}`;
      case 3:
        return oneComplaint.isEligible ? 'Plainte éligible' : 'Plainte non éligible';
      case 4:
        const solution = oneComplaint.tracking?.find((t) => t.position === 4)?.proposedSolution?.response;
        return `Solution proposée : ${solution || 'Aucune'}`;
      case 5:
        return complaintMessageStepFive || 'Étape en attente';
      case 6:
        return complaintMessageStepSeven || 'Satisfaction non renseignée';
      case 7:
        return `Nouvelle solution proposée par l'admin`;
      default:
        return 'Résumé non disponible';
    }
  }

  return (
    <>
      {loadingProvoked && loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {traitementData.map((step, index) => {
              let stepSummary: string | string[] = '';
              if (index < activeStep && oneComplaint) {
                stepSummary = getStepSummaryFromComplaint(oneComplaint, step.position);
              }
              return (
                <Step key={step.position}>
                  <StepLabel>
                    <Typography variant="h6" sx={{ fontWeight: index === activeStep ? 'bold' : 'normal' }}>
                      {step.name}
                    </Typography>
                    {/* Show summary for completed steps */}
                    {typeof stepSummary === 'string' ? (
                      <Typography variant="body2" color="textSecondary">
                        {stepSummary}
                      </Typography>
                    ) : (
                      stepSummary.map((summary) => (
                        <Typography variant="body2" sx={{ color: 'gray', fontStyle: 'italic' }}>
                          {summary}
                        </Typography>
                      ))
                    )}
                  </StepLabel>
                  <StepContent>
                    {index === 0 && activeStep > 0 ? null : renderFormContent(step, index)}
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={activeStep === traitementData.length - 1}
                      >
                        {index === traitementData.length - 1 ? 'Terminer' : 'Continuer'}
                      </Button>
                      {activeStep > 0 && (
                        <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Retour
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
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
      <CustomToast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}
