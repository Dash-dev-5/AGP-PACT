// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// project-imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import logoAGPPACT from 'assets/images/landing/Logo_AGP_PACT_COULEUR.png';
import { DRAWER_WIDTH, HEADER_HEIGHT, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { Link } from 'react-router-dom';

interface Props {
  open: boolean;
}

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }: Props) {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : HEADER_HEIGHT,
        width: isHorizontal ? { xs: '100%', lg: DRAWER_WIDTH + 50 } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
      }}
    >
      {/* <Logo isIcon={!open} sx={{ width: open ? 'auto' : 52, height: 'auto' }} /> */}
      <Link to="/">
        <img src={logoAGPPACT} height="60" className="d-inline-block align-top" alt="Logo" />
      </Link>
    </DrawerHeaderStyled>
  );
}
