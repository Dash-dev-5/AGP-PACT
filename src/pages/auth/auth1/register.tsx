import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Logo from 'assets/images/landing/Logo_AGP_PACT_COULEUR.png';

// icons
import CreatePlaignantForm from 'pages/apps/plaignant/CreatePlaignantForm';
import { Button, Image, Modal } from 'react-bootstrap';

// ================================|| REGISTER ||================================ //

export default function Register() {
  const navigate = useNavigate();

  // const [show, setShow] = React.useState(true);

  // const handleClose = () => {
  //   setShow(false);
  // };

  return (
    <>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0'
        }}
      >
        <div style={{ width: '70rem', backgroundColor: '#F0F0F0', padding: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography>
                <Link to="/">
                  <Image src={Logo} style={{ width: '100px', height: '100px' }} />
                </Link>
              </Typography>
              <Typography variant="h3" className="mt-2" color={'#009fe3'}>
                Inscription / Soumission plainte
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CreatePlaignantForm />
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
    </>
  );
}
