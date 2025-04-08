import { useState, MouseEvent, ReactNode, SyntheticEvent } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import Tabs from '@mui/material/Tabs';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';

// assets
import { ArrowDown, ArrowSwapHorizontal, ArrowUp } from 'iconsax-react';
import { height } from '@mui/system';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| DATA WIDGET - TYRANSACTIONS ||============================== //

export default function Transactions() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard content={false} style={{height:"37.5rem"}}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5">Plaintes</Typography>
          <IconButton
            color="secondary"
            id="wallet-button"
            aria-controls={open ? 'wallet-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="wallet-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'wallet-button', sx: { p: 1.25, minWidth: 150 } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <ListItemButton onClick={handleClose}>Jour</ListItemButton>
            <ListItemButton onClick={handleClose}>Semaine</ListItemButton>
            <ListItemButton onClick={handleClose}>Mois</ListItemButton>
          </Menu>
        </Stack>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3 }}>
            <Tab label="Plaintes" {...a11yProps(0)} />
            <Tab label="Traitée" {...a11yProps(1)} />
            <Tab label="En attente" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            <ListItem
              divider
              secondaryAction={
                <Stack spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle1">0,0</Typography>
                  <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowDown style={{ transform: 'rotate(45deg)' }} size={14} /> 0.0%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  type="outlined"
                  color="secondary"
                  sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                >
                  NON
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Pas de plainte</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Non plainte
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            <ListItem
              divider
              secondaryAction={
                <Stack spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle1">0.0</Typography>
                  <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowUp style={{ transform: 'rotate(45deg)' }} size={14} /> 0.0%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  type="outlined"
                  color="secondary"
                  sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                >
                  NON
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Pas de plainte</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Non plainte
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            <ListItem
              divider
              secondaryAction={
                <Stack spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle1">0.0</Typography>
                  <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowUp style={{ transform: 'rotate(45deg)' }} size={14} /> 0.0%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  type="outlined"
                  color="secondary"
                  sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                >
                  Non
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">Pas de plainte</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Non plainte
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </TabPanel>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ p: 3 }}>
          <Button variant="outlined" fullWidth color="secondary">
            Plainte Historique
          </Button>
          <Button variant="contained" fullWidth>
            Plaignant
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
}
