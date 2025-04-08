import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// icons
import { Image } from 'react-bootstrap';
import Logo from 'assets/images/landing/Logo_AGP_PACT_COULEUR.png';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography>
            <Link to="/">
              <Image src={Logo} style={{ width: '100px', height: '100px' }} />
            </Link>
          </Typography>
          <Typography variant="h3" className="mt-2" color={'#009fe3'}>
            AUTHENTIFICATION
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography component={Link} to={isLoggedIn ? '/' : '/'} variant="body1" sx={{ textDecoration: 'none' }} color="red">
              Retour
            </Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Vous n'avez pas de compte ?
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
