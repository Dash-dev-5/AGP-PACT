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
  updateEightStepOne,
  updateFiveStepTwo,
  updateFourStep,
  updateSecondStep,
  updateStepNine,
  updateStepSevenOne,
  updateStepSevenTwo,
  updateStepSix,
  updateThreeStep
} from 'features/stepForm/stepSlice';
import { useParams } from 'react-router-dom';
import { fetchComplaintById, fetchComplaints } from 'features/complaint/complaintSlice';
import { putRequest } from 'utils/verbes';
import { Complaint, proposedSolution } from 'features/complaint/complaintType';
import CustomToast from 'components/customToast';
import { uploadImageToCloudinary } from 'utils/ImageUploader';
import { fetchComplaintTypesAsync } from 'features/complaintType/complaintTypeSlice';
import { fetchPrejudicesAsync, Prejudice } from 'features/prejudice/prejudiceSlice';
import { Badge } from 'react-bootstrap';

export default function VerticalLinearStepper() {
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
  // const [activeStep, setActiveStep] = useState(1);
  const dispatch = useAppDispatch();
  const { traitementData, loading } = useSelector((state: RootState) => state.traitement);
  const { committees } = useAppSelector((state) => state.committee);
  const { prejudices } = useAppSelector((state) => state.prejudice);
  const { complaintTypes } = useAppSelector((state) => state.complaintType);
  const [filteredPrejudices, setFilteredPrejudices] = React.useState<Prejudice[]>([]);
  const [complaintMessageStepEight, setComplaintMessageStepEight] = React.useState<string>('');
  const [complaintMessageStepNine, setComplaintMessageStepNine] = React.useState<string>('');

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
      dispatch(fetchComplaintTypesAsync());
      dispatch(fetchPrejudicesAsync());
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
        handleSubmitStep(activeStep);
        break;

      case 2:
        // submit step three(index 2)
        handleSubmitStepTwo(activeStep);

        break;

      case 3:
        // submit step four (index 3)
        handleSubmitStepFour(activeStep);

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
        // Submmit step seven two (index 6)
        handleSubmitStepSevenOne(activeStep);

        break;

      case 7:
        // Submmit step eight one (index 7)
        handleSubmitStepEightOne(activeStep);

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

  //Submit step two
  const handleSubmitStep = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      prejudice: stepValues.prejudice,
      complaint: id !== undefined ? id : ''
    };

    try {
      const result = await dispatch(updateSecondStep(dataToSubmit)).unwrap();
      if (result !== null) {
        putRequest(`processing-step/closed/Complaint/${id!}`)
          .then((response) => {
            setShowToast(true);
            setToastMessage(String('Etape cloturé avec success'));
            setToastType('success');
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
          })
          .catch((error) => console.error('error', error));
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
      console.error('errorrr', error);
    }
  };

  //Submit step three
  const handleSubmitStepTwo = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      isEligible: stepValues.isEligible === 'true',
      // documents: uploadedFiles
      documents: ['run run']
    };

    try {
      const result = await dispatch(updateThreeStep(dataToSubmit)).unwrap();
      if (result !== null) {
        putRequest(`processing-step/closed/Complaint/${id!}`)
          .then((response) => {
            setShowToast(true);
            setToastMessage(String('Etape cloturé avec success'));
            setToastType('success');
            // localStorage.setItem('activeStep', currentStep.toString());
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
          })
          .catch((error) => console.error('error', error));
      }
    } catch (error) {
      console.error('errorrr', error);
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
    }
  };

  //Submit step fourth
  const handleSubmitStepFour = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      proposedSolution: stepValues.proposedSolution,
      totalPrice: stepValues.totalPrice
    };
    try {
      const result = await dispatch(updateFourStep(dataToSubmit)).unwrap();
      if (result !== null) {
        putRequest(`processing-step/closed/Complaint/${id!}`)
          .then((response) => {
            setShowToast(true);
            setToastMessage(String('Etape cloturé avec success'));
            setToastType('success');
            // localStorage.setItem('activeStep', currentStep.toString());
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
          })
          .catch((error) => console.error('error', error));
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
      console.error('errorrr', error);
    }
  };

  //Submit step five two
  const handleSubmitStepFiveTwo = async (index: number) => {
    if (proposedSolutionsCommittee?.isSolutionAccepted === null) {
      setShowToast(true);
      setToastMessage("Veuillez, s'il vous plaît, attendre la réponse du plaignant avant de continuer le traitement.");
      setToastType('error');
      return;
    }

    if (proposedSolutionsCommittee?.isSolutionAccepted) {
      putRequest(`processing-step/closed/Complaint/${id!}`)
        .then((response) => {
          // localStorage.setItem('activeStep', currentStep.toString());
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
        })
        .catch((error) => console.error('error closed', error));
    } else {
      const stepValues = formValues[index];
      const dataToSubmit = {
        complaint: id !== undefined ? id : '',
        proposedSolution: stepValues.proposedSolution
      };
      try {
        const result = await dispatch(updateFiveStepTwo(dataToSubmit)).unwrap();
        if (result !== null) {
          putRequest(`processing-step/closed/Complaint/${id!}`)
            .then((response) => {
              setShowToast(true);
              setToastMessage(String('Etape cloturé avec success'));
              setToastType('success');
              // console.log("reponse", response.data);
              // localStorage.setItem('activeStep', currentStep.toString());
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
              setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
            })
            .catch((error) => console.error('error', error));
        }
      } catch (error) {
        setShowToast(true);
        setToastMessage(String(error));
        setToastType('error');
        console.log('errorrr', error);
      }
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
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
          })
          .catch((error) => console.error('error step 6', error));
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
      console.log('errorrr', error);
    }
  };
  //Submit step seven One
  const handleSubmitStepSevenOne = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      escalateComplaintToStep3: stepValues.escalateComplaintToStep3 === 'true' ? false : true
    };
    try {
      const result = await dispatch(updateStepSevenTwo(dataToSubmit)).unwrap();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setCompletedSteps((prevCompleted) => [...prevCompleted, index]);
      if (dataToSubmit.escalateComplaintToStep3) {
        setShowToast(true);
        setToastMessage(String("La plainte est renvoyée à l'étape trois."));
        setToastType('success');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setCompletedSteps((prevCompleted) => [...prevCompleted, 3]);
      } else {
        setShowToast(true);
        setToastMessage(String('Etape cloturé avec success'));
        setToastType('success');
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
      console.log('errorrr', error);
    }
  };

  //Submit step Eight
  const handleSubmitStepEightOne = async (index: number) => {
    const stepValues = formValues[index];
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      proposedSolution: stepValues.proposedSolution,
      totalPrice: stepValues.totalPrice
    };
    try {
      const result = await dispatch(updateEightStepOne(dataToSubmit)).unwrap();
      setComplaintMessageStepEight(
        "Merci pour votre proposition. Si le plaignant l'accepte, la plainte sera clôturée. Dans le cas contraire, nous passerons à l'étape neuf."
      );
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
      console.error('errorrr', error);
    }
  };

  //Submit step nine
  const handleSubmitStepNine = async () => {
    const dataToSubmit = {
      complaint: id !== undefined ? id : '',
      isComplaintSentToJustice: true
    };
    try {
      const result = await dispatch(updateStepNine(dataToSubmit)).unwrap();
      if (result !== null) {
        setComplaintMessageStepNine('Plainte envoyer à la justice');
        setShowToast(true);
        setToastMessage(String('Plainte envoyer à la justice'));
        setToastType('success');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setCompletedSteps((prevCompleted) => [...prevCompleted, 8]);
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
      console.error('errorrr', error);
    }
  };

  //step send to justice
  const handleClick = () => {
    handleSubmitStepNine();
  };
  // Filter prejudices according to the type of complaint selected

  const handleComplaintTypeChange = (index: number, value: string) => {
    handleChange(index, 'complaintType', value);
    const prejudicesForType = prejudices.filter((p) => p.typeId === value);
    setFilteredPrejudices(prejudicesForType);
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
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type de plainte</InputLabel>
              <Select
                value={formValues[index]?.complaintType || ''}
                onChange={(e) => handleComplaintTypeChange(index, e.target.value)}
                label="complaintType"
              >
                {complaintTypes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Préjudice</InputLabel>
              <Select
                value={formValues[index]?.prejudice || ''}
                onChange={(e) => handleChange(index, 'prejudice', e.target.value)}
                label="prejudice"
              >
                {filteredPrejudices.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 2: // Form step three
        return (
          <>
            {oneComplaint?.status !== 'Closed' ? (
              <div>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>La plainte est-elle éligible ?</InputLabel>
                  <Select
                    value={formValues[index]?.isEligible || ''}
                    onChange={(e) => handleChange(index, 'isEligible', e.target.value)}
                    label="isEligible"
                  >
                    <MenuItem value="true">Oui</MenuItem>
                    <MenuItem value="false">Non</MenuItem>
                  </Select>
                </FormControl>
                <input type="file" accept=".pdf,.doc,.docx" multiple onChange={handleFileChange} />
                <Button onClick={handleUpload} variant="contained" sx={{ mt: 2 }}>
                  Télécharger le(s) fichier(s)
                </Button>
                {uploadedFiles.length > 0 && (
                  <div>
                    <p>Fichiers téléchargés :</p>
                    <ul>
                      {uploadedFiles.map((fileUrl, index) => (
                        <li key={index}>
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            Voir le fichier {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
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
                  La plainte est non éligible. Par conséquent, elle a été clôturée.
                </Badge>
              </div>
            )}
          </>
        );
      case 3: // Form step four
        const totalAmount = oneComplaint?.species?.reduce((acc, s) => acc + (s.totalPrice || 0), 0);

        return (
          <>
            <div className="d-flex gap-2">
              <span>Montant total :</span>
              <span className="fw-bold">{totalAmount} Fc</span>
            </div>
            <TextField
              label="Montant à payé"
              value={formValues[index]?.totalPrice || ''}
              onChange={(e) => handleChange(index, 'totalPrice', e.target.value)}
              rows={1}
              sx={{ mb: 2 }}
            />
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
      case 4: // Form step five two
        return (
          <>
            {oneComplaint && proposedSolutionsCommittee?.isSolutionAccepted == null ? (
              <p>Veuillez, s'il vous plaît, attendre la réponse du plaignant avant de continuer le traitement.</p>
            ) : proposedSolutionsCommittee?.isSolutionAccepted ? (
              <>
                <div className="d-flex flex-column">
                  <span>Le plaignant a accepté votre proposition suivante :</span>
                  <span className="fw-bold">{proposedSolutionsCommittee?.response}</span>
                </div>
              </>
            ) : (
              proposedSolutionsCommittee?.isSolutionAccepted === false && (
                <>
                  <p>Le plaignant a refusé votre proposition. Voici la raison :</p>
                  <Badge
                    bg="warning"
                    className="mb-4"
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
                    {proposedSolutionsCommittee.refusalReason}
                  </Badge>
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
              )
            )}
          </>
        );
      case 5: // Form step six
        return (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" className="mb-3">
                Télécharger un document
              </Typography>
              <Input
                type="file"
                inputProps={{
                  accept: '.docx,.pdf,.jpeg,.jpg,.png,.svg',
                  multiple: true
                }}
                // onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                sx={{ display: 'none' }} // Cacher l'input
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="contained" component="span">
                  Choisir un fichier
                </Button>
              </label>
              {/* <Button variant="contained" onClick={() => document.getElementById('file-upload')?.click()} sx={{ ml: 2 }} className="mb-1">
                Télécharger
              </Button> */}
            </Box>
          </>
        );
      case 6: // Form step seven
        const satisfactionRating = oneComplaint?.tracking?.find(
          (t) => t.satisfactionRating?.position != null && t.satisfactionRating?.position === 7
        );

        return (
          <>
            {satisfactionRating?.satisfactionRating == null ? (
              <span> Veuillez, s'il vous plaît, attendre la réponse du plaignant avant de continuer le traitement.</span>
            ) : satisfactionRating?.satisfactionRating.isComplainantSatisfied === true ? (
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
                  Le plaigant à accepter votre solution
                </Badge>
              </div>
            ) : (
              <>
                <div className="d-flex flex-column">
                  <span>Le plaignant n'a pas accepté vos propositions. Voici la raison de son refus :</span>
                  <Badge
                    bg="warning"
                    className="mb-2"
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
                    {satisfactionRating?.satisfactionRating.reason}
                  </Badge>
                </div>
                <FormControl fullWidth sx={{ mb: 2 }} className="mt-3">
                  <InputLabel>Souhaitez-vous faire remonter la plainte à un niveau supérieur ?</InputLabel>
                  <Select
                    value={formValues[index]?.escalateComplaintToStep3 || ''}
                    onChange={(e) => handleChange(index, 'escalateComplaintToStep3', e.target.value)}
                    label="escalateComplaintToStep3"
                  >
                    <MenuItem value="true">Oui</MenuItem>
                    <MenuItem value="false">Non</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </>
        );
      case 7: //
        const totalAmounts = oneComplaint?.species?.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
        return (
          <>
            <div className="d-flex gap-2">
              <span>Montant total :</span>
              <span className="fw-bold">{totalAmounts} Fc</span>
            </div>
            <TextField
              label="Montant à payé"
              value={formValues[index]?.totalPrice || ''}
              onChange={(e) => handleChange(index, 'totalPrice', e.target.value)}
              rows={1}
              sx={{ mb: 2 }}
            />
            <TextField
              label="La réponse de l'admin"
              value={formValues[index]?.proposedSolution || ''}
              onChange={(e) => handleChange(index, 'proposedSolution', e.target.value)}
              fullWidth
              multiline
              rows={5}
              sx={{ mb: 2 }}
            />

            {complaintMessageStepEight && (
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
                  {complaintMessageStepEight}
                </Badge>
              </div>
            )}
          </>
        );
      case 8:
        const tranking = oneComplaint?.tracking?.find((t) => t.position === 9);
        return (
          <>
            {oneComplaint?.status !== 'Closed' && (
              <div>
                <h5 className="my-3">Envoi de la plainte au niveau de la justice</h5>
                <Button
                  variant="contained"
                  disabled={complaintMessageStepNine ? true : false}
                  color="primary"
                  onClick={handleClick}
                  sx={{
                    backgroundColor: '#d10a11',
                    '&:hover': {
                      backgroundColor: '#830509'
                    },
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontSize: '16px'
                  }}
                  className="mb-3"
                >
                  Envoyer la plainte en justice
                </Button>
              </div>
            )}
            {complaintMessageStepNine ||
              (oneComplaint?.status === 'Closed' && (
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
                    {complaintMessageStepNine ? complaintMessageStepNine : 'Plainte envoyer à la justice'}
                  </Badge>
                </div>
              ))}
          </>
        );
      default:
        return <Typography>Aucun formulaire disponible pour cette étape.</Typography>;
    }
  };

  function getStepSummaryFromComplaint(oneComplaint: Complaint, stepPosition: number): string | string[] {
    if (!oneComplaint) return '';

    switch (stepPosition) {
      case 1:
        return `Plainte enregistrée: ${oneComplaint.referenceNumber}`;
      case 2:
        return [`Type: ${oneComplaint.prejudice?.typeName || 'N/A'}`, `Préjudice: ${oneComplaint.prejudice?.name || 'N/A'}`];
      case 3:
        return oneComplaint.isEligible ? 'Plainte éligible' : 'Plainte non éligible';
      case 4: {
        const track4 = oneComplaint.tracking?.find((t) => t.position === 4);
        return [`Solution proposée: ${track4?.proposedSolution?.response || 'N/A'}`, `Total price: ${oneComplaint.totalPrice} FC`];
      }
      // Add summaries for other steps
      default:
        return '';
    }
  }

  const satisfactionRating = oneComplaint?.tracking?.find(
    (t) => t.satisfactionRating?.position != null && t.satisfactionRating?.position === 7
  );
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
                    <Typography variant="h6">{step.name}</Typography>
                    {/* Show summary for completed steps */}
                    {typeof stepSummary === 'string' ? (
                      <Typography variant="body2" color="textSecondary">
                        {stepSummary}
                      </Typography>
                    ) : (
                      stepSummary.map((summary) => (
                        <Typography variant="body2" color="textSecondary">
                          {summary}
                        </Typography>
                      ))
                    )}
                  </StepLabel>
                  <StepContent>
                    {renderFormContent(step, index)}
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={
                          (index === 6 && satisfactionRating?.satisfactionRating == null) || complaintMessageStepNine
                            ? true
                            : false || oneComplaint?.status === 'Closed' || complaintMessageStepEight
                              ? true
                              : false
                        }
                      >
                        {index === traitementData.length - 1 ? "Annuler l'envoi de la plainte en justice " : 'Continuer'}
                      </Button>
                      {/* disabled={index === 1 || completedSteps.includes(index - 1)} */}
                      <Button
                        disabled={
                          index === 1 || completedSteps.includes(index - 1) || satisfactionRating?.satisfactionRating == null || index === 8
                        }
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Retour
                      </Button>
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
