// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';

import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import RepeatCustomerRateNonTraiter from 'sections/widget/chart/RepeatCustomerRateNonTraiter';
import RepeatCustomerRateEncours from 'sections/widget/chart/RepeatCustomerRateEncours';
import RepeatCustomerRateTermine from 'sections/widget/chart/RepeatCustomerRateTermine';

import RepeatCustomerRateTotalGen from 'sections/widget/chart/RepeatCustomerRateTotaleGen';
import RepeatCustomerRateSens from 'sections/widget/chart/RepeatCustomerRateTotaleSens';


import RepeatCustomerRateDansDelais from 'sections/widget/chart/RepeatCustomerRateTotaleSensDansDelais';
import RepeatCustomerRateHorsDelais from 'sections/widget/chart/RepeatCustomerRateTotaleSensHorsDelais';
// assets
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from 'iconsax-react';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';
import { useEffect, useState } from 'react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();
  const [data, setData] = useState<any[]>([]);
  const [error500, setError500] = useState(false); // State to handle 500 error

 
  const fetchData = async () => {

    const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const effectiveStartDate = currentDate;
    const effectiveEndDate = currentDate;
    const selectedTroncon = '3b7e8a1c-9d2f-4a5b-8c6e-1f0a3d5e7b9c'; // Tronçon sélectionné (vide par défaut)
    console.log('Effective Start Date:', effectiveStartDate);
    let url = `${import.meta.env.VITE_APP_API_URL}complaints/statistic`;
    if (selectedTroncon) {
      url += `?projectSite=${selectedTroncon}&startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`;
    }

    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      console.log('données :', result);
      
      console.log('Effective Start Date:', effectiveStartDate);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // const generalComplaints = data.find((item) => item.category === 'General');
  // const sensitiveComplaints = data.find((item) => item.category === 'Sensible');

  const generalComplaints = Array.isArray(data) ? data.find(item => item.category === 'General') : null;
const sensitiveComplaints = Array.isArray(data) ? data.find(item => item.category === 'Sensible') : null;

console.log('Data Dash Board : ', generalComplaints);
console.log('Data Dash Board 2 : ', sensitiveComplaints);



  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>
      {/* row 1 */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total des plaintes générales "
          count={generalComplaints ? generalComplaints.totalComplaints : 0}
          iconPrimary={<Wallet3 />}
          percentage={
        <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total des plaintes sensibles"
          count={sensitiveComplaints ? sensitiveComplaints.totalComplaints : 0}
          color="error"
          iconPrimary={<CloudChange color={theme.palette.error.dark} />}
          percentage={
        <Typography color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </EcommerceDataCard>
      </Grid>

      {/* row 2 */}
      {/* RepeatCustomerRateTotalGen*/}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepeatCustomerRateTotalGen />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
        </Grid>
        {/* RepeatCustomerRateSens*/}
        <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>  
            <RepeatCustomerRateSens />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
      </Grid>

      {/**************  */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total des plaintes en cours"
          count={
        generalComplaints && sensitiveComplaints ? generalComplaints.complaintInProgress + sensitiveComplaints.complaintInProgress : 0
          }
          color="warning"
          iconPrimary={<Calendar color={theme.palette.warning.darker} />}
          percentage={
        <Typography color="warning.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.darker} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Plaintes traitées"
          count={
        generalComplaints && sensitiveComplaints ? generalComplaints.complaintProcessed + sensitiveComplaints.complaintProcessed : 0
          }
          color="success"
          iconPrimary={<Book color={theme.palette.success.dark} />}
          percentage={
        <Typography color="success.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.dark} />
        </EcommerceDataCard>
      </Grid>
      {/* row 2 */}
      {/* En cours*/}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepeatCustomerRateEncours />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
        </Grid>
        {/* Traite*/}
        <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>  
            <RepeatCustomerRate />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
      </Grid>

      {/**************  */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Plaintes sensibles traitées dans les délais"
          count={sensitiveComplaints ? sensitiveComplaints.complaintProcessedInTime : 0}
          color="success"
          iconPrimary={<ArrowUp color={theme.palette.success.main} />}
          percentage={
        <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Plaintes sensibles traitées hors délais"
          count={sensitiveComplaints ? sensitiveComplaints.complaintProcessedOutOfTime : 0}
          color="warning"
          iconPrimary={<ArrowDown color={theme.palette.warning.main} />}
          percentage={
        <Typography color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.main} />
        </EcommerceDataCard>
      </Grid>
      {/******** delais ******  */}
      {/* En cours*/}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepeatCustomerRateDansDelais />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
        </Grid>
        {/* Traite*/}
        <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>  
            <RepeatCustomerRateHorsDelais />
          
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
      </Grid>

      {/**************  */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Plaintes générales traitées dans les délais"
          count={generalComplaints ? generalComplaints.complaintProcessedInTime : 0}
          color="info"
          iconPrimary={<ArrowUp color={theme.palette.info.main} />}
          percentage={
        <Typography color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.info.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Plaintes générales traitées hors délais"
          count={generalComplaints ? generalComplaints.complaintProcessedOutOfTime : 0}
          color="error"
          iconPrimary={<ArrowDown color={theme.palette.error.main} />}
          percentage={
        <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 0.0%
        </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.main} />
        </EcommerceDataCard>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}></Grid>


      {/* Termine*/}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepeatCustomerRateTermine />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>
        </Grid>
      {/* Non Traite*/}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RepeatCustomerRateNonTraiter />
          </Grid>
          {/* <Grid item xs={12}>
            <ProjectOverview />
          </Grid> */}
        </Grid>  
      </Grid>

    </Grid>
  );
}
