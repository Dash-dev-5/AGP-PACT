import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import ThemeLayout from './ThemeLayout';
import ThemeMode from './ThemeMode';
import ThemeContrast from './ThemeContrast';
import ColorScheme from './ColorScheme';
import ThemeWidth from './ThemeWidth';
import ThemeMenuLayout from './ThemeMenuLayout';
import ThemeFont from './ThemeFont';
import MenuCaption from './MenuCaption';

import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';

import { HEADER_HEIGHT } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import { Add, Setting2 } from 'iconsax-react';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

export default function Customization() {
  const theme = useTheme();
  const { container, mode, presetColor, miniDrawer, themeDirection, menuOrientation, menuCaption, themeContrast, fontFamily } = useConfig();

  // eslint-disable-next-line
  const themeLayout = useMemo(() => <ThemeLayout />, [miniDrawer, themeDirection]);
  // eslint-disable-next-line
  const themeMenuLayout = useMemo(() => <ThemeMenuLayout />, [menuOrientation]);
  // eslint-disable-next-line
  const themeMode = useMemo(() => <ThemeMode />, [mode]);
  // eslint-disable-next-line
  const themeContrastView = useMemo(() => <ThemeContrast />, [themeContrast]);
  // eslint-disable-next-line
  const menuCaptionView = useMemo(() => <MenuCaption />, [menuCaption]);
  // eslint-disable-next-line
  const themeColor = useMemo(() => <ColorScheme />, [presetColor]);
  // eslint-disable-next-line
  const themeWidth = useMemo(() => <ThemeWidth />, [container]);
  // eslint-disable-next-line
  const themeFont = useMemo(() => <ThemeFont />, [fontFamily]);

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      
    </>
  );
}
