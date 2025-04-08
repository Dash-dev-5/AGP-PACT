import { useEffect, useState, SyntheticEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { openSnackbar } from 'api/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { SnackbarProps } from 'types/snackbar';
import { StringColorProps } from 'types/password';

// assets
import { Eye, EyeSlash } from 'iconsax-react';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  // const { register } = useAuth();
  // const scriptedRef = useScriptRef();
  // const navigate = useNavigate();

  // const [level, setLevel] = useState<StringColorProps>();
  // const [showPassword, setShowPassword] = useState(false);
  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  // const handleMouseDownPassword = (event: SyntheticEvent) => {
  //   event.preventDefault();
  // };

  // const changePassword = (value: string) => {
  //   const temp = strengthIndicator(value);
  //   setLevel(strengthColor(temp));
  // };

  // useEffect(() => {
  //   changePassword('');
  // }, []);

  // return (
  //   <>
  //     <Formik
  //       initialValues={{
  //         first_name: '',
  //         last_name: '',
  //         middle_name: '',
  //         username: '',
  //         email: '',
  //         password: '',
  //         submit: null
  //       }}
  //       validationSchema={Yup.object().shape({
  //         first_name: Yup.string().max(255).required('Le prénom est requis'),
  //         last_name: Yup.string().max(255).required('Le nom de famille est requis'),
  //         middle_name: Yup.string().max(255),
  //         email: Yup.string().email('Doit être un e-mail valide').max(255).required("L'adresse e-mail est requise"),
  //         username: Yup.string().max(255).required("Le nom d'utilisateur est requis"),
  //         password: Yup.string().max(255).required('Le mot de passe est requis')
  //       })}
  //       onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
  //         try {
  //           await register(values.email, values.password, values.first_name, values.last_name);
  //           if (scriptedRef.current) {
  //             setStatus({ success: true });
  //             setSubmitting(false);
  //             openSnackbar({
  //               open: true,
  //               message: 'Votre inscription a été complétée avec succès',
  //               variant: 'alert',
  //               alert: {
  //                 color: 'success'
  //               }
  //             } as SnackbarProps);

  //             setTimeout(() => {
  //               navigate('/login', { replace: true });
  //             }, 1500);
  //           }
  //         } catch (err: any) {
  //           console.error(err);
  //           if (scriptedRef.current) {
  //             setStatus({ success: false });
  //             setErrors({ submit: err.message });
  //             setSubmitting(false);
  //           }
  //         }
  //       }}
  //     >
  //       {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
  //         <form noValidate onSubmit={handleSubmit}>
  //           <Grid container spacing={3}>
  //             <Grid item xs={12} md={6}>
  //               <Stack spacing={1}>
  //                 <InputLabel htmlFor="firstname-signup">Prénom*</InputLabel>
  //                 <OutlinedInput
  //                   id="firstname-login"
  //                   type="first_name"
  //                   value={values.first_name}
  //                   name="first_name"
  //                   onBlur={handleBlur}
  //                   onChange={handleChange}
  //                   placeholder="John"
  //                   fullWidth
  //                   error={Boolean(touched.first_name && errors.first_name)}
  //                 />
  //               </Stack>
  //               {touched.first_name && errors.first_name && (
  //                 <FormHelperText error id="helper-text-firstname-signup">
  //                   {errors.first_name}
  //                 </FormHelperText>
  //               )}
  //             </Grid>
  //             <Grid item xs={12} md={6}>
  //               <Stack spacing={1}>
  //                 <InputLabel htmlFor="lastname-signup">Nom de famille*</InputLabel>
  //                 <OutlinedInput
  //                   fullWidth
  //                   error={Boolean(touched.last_name && errors.last_name)}
  //                   id="lastname-signup"
  //                   type="last_name"
  //                   value={values.last_name}
  //                   name="last_name"
  //                   onBlur={handleBlur}
  //                   onChange={handleChange}
  //                   placeholder="Doe"
  //                   inputProps={{}}
  //                 />
  //               </Stack>
  //               {touched.last_name && errors.last_name && (
  //                 <FormHelperText error id="helper-text-lastname-signup">
  //                   {errors.last_name}
  //                 </FormHelperText>
  //               )}
  //             </Grid>
  //             <Grid item xs={12} md={6}>
  //               <Stack spacing={1}>
  //                 <InputLabel htmlFor="usernane-signup">Postnom</InputLabel>
  //                 <OutlinedInput
  //                   fullWidth
  //                   error={Boolean(touched.middle_name && errors.middle_name)}
  //                   id="middle_name-signup"
  //                   type="middle_name"
  //                   value={values.middle_name}
  //                   name="middle_name"
  //                   onBlur={handleBlur}
  //                   onChange={handleChange}
  //                   placeholder="Doe"
  //                   inputProps={{}}
  //                 />
  //               </Stack>
  //               {touched.middle_name && errors.middle_name && (
  //                 <FormHelperText error id="helper-text-lastname-signup">
  //                   {errors.middle_name}
  //                 </FormHelperText>
  //               )}
  //             </Grid>
  //             <Grid item xs={12} md={6}>
  //               <Stack spacing={1}>
  //                 <InputLabel htmlFor="usernane-signup">Nom d'utilisateur*</InputLabel>
  //                 <OutlinedInput
  //                   fullWidth
  //                   error={Boolean(touched.username && errors.username)}
  //                   id="usernane-signup"
  //                   type="usernane"
  //                   value={values.username}
  //                   name="usernane"
  //                   onBlur={handleBlur}
  //                   onChange={handleChange}
  //                   placeholder="Doe"
  //                   inputProps={{}}
  //                 />
  //               </Stack>
  //               {touched.username && errors.username && (
  //                 <FormHelperText error id="helper-text-lastname-signup">
  //                   {errors.username}
  //                 </FormHelperText>
  //               )}
  //             </Grid>
  //             <Grid item xs={12}>
  //               <Stack spacing={1}>
  //                 <InputLabel htmlFor="email-signup">Adresse e-mail*</InputLabel>
  //                 <OutlinedInput
  //                   fullWidth
  //                   error={Boolean(touched.email && errors.email)}
  //                   id="email-login"
  //                   type="email"
  //                   value={values.email}
  //                   name="email"
  //                   onBlur={handleBlur}
  //                   onChange={handleChange}
  //                   placeholder="demo@company.com"
  //                   inputProps={{}}
  //                 />
  //               </Stack>
  //               {touched.email && errors.email && (
  //                 <FormHelperText error id="helper-text-email-signup">
  //                   {errors.email}
  //                 </FormHelperText>
  //               )}
  //             </Grid>
  //             <Grid item xs={12}>
  //               <Stack spacing={1}>
  //                 <InputLabel htmlFor="password-signup">Mot de passe</InputLabel>
  //                 <OutlinedInput
  //                   fullWidth
  //                   error={Boolean(touched.password && errors.password)}
  //                   id="password-signup"
  //                   type={showPassword ? 'text' : 'password'}
  //                   value={values.password}
  //                   name="password"
  //                   onBlur={handleBlur}
  //                   onChange={(e) => {
  //                     handleChange(e);
  //                     changePassword(e.target.value);
  //                   }}
  //                   endAdornment={
  //                     <InputAdornment position="end">
  //                       <IconButton
  //                         aria-label="toggle password visibility"
  //                         onClick={handleClickShowPassword}
  //                         onMouseDown={handleMouseDownPassword}
  //                         edge="end"
  //                         color="secondary"
  //                       >
  //                         {showPassword ? <Eye /> : <EyeSlash />}
  //                       </IconButton>
  //                     </InputAdornment>
  //                   }
  //                   placeholder="******"
  //                   inputProps={{}}
  //                 />
  //               </Stack>
  //               {touched.password && errors.password && (
  //                 <FormHelperText error id="helper-text-password-signup">
  //                   {errors.password}
  //                 </FormHelperText>
  //               )}
  //               <FormControl fullWidth sx={{ mt: 2 }}>
  //                 <Grid container spacing={2} alignItems="center">
  //                   <Grid item>
  //                     <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
  //                   </Grid>
  //                   <Grid item>
  //                     <Typography variant="subtitle1" fontSize="0.75rem">
  //                       {level?.label}
  //                     </Typography>
  //                   </Grid>
  //                 </Grid>
  //               </FormControl>
  //             </Grid>
            
  //             {errors.submit && (
  //               <Grid item xs={12}>
  //                 <FormHelperText error>{errors.submit}</FormHelperText>
  //               </Grid>
  //             )}
  //             <Grid item xs={12}>
  //               <AnimateButton>
  //                 <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
  //                   Créer un compte
  //                 </Button>
  //               </AnimateButton>
  //             </Grid>
  //           </Grid>
  //         </form>
  //       )}
  //     </Formik>
  //   </>
  // );
}
