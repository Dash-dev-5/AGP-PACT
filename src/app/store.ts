import { configureStore } from '@reduxjs/toolkit';
import committeeSlice from 'features/commitee/committeeSlice';
import notificationSlice from 'features/notification/notificationSlice';
import complainantSlice from 'features/complainant/complainantSlice';
import professionSlice from 'features/profession/professionSlice';
import provinceSlice from 'features/province/provinceSlice';
import managerSlice from 'features/utilisateur/managerSlice';
import complaintTypeSlice from 'features/complaintType/complaintTypeSlice';
import prejudiceSlice from 'features/prejudice/prejudiceSlice';
import vulnerabilitySlice from 'features/vulnerability/vulnerabilitySlice';
import complaintSlice from 'features/complaint/complaintSlice';
import projectSiteReducer from 'features/project-site/projectSiteSlice';
import { responsibleEntityReducer } from 'features/responsibleEntity/responsibleEntity';
import { incidentCauseReducer } from 'features/activities/incidentCause';
import { repairRequestReducer } from 'features/repairRequest/repairRequest';
import groupCommiteesSlice from 'features/groupCommittes/groupCommiteesSlice';
import complaintsSlice from 'features/complaints/complaintsSlice';
import questionsSlice from 'features/faq/questionsSlice';
import traitementSlice from 'features/traintement/traitementSlice';
import stepSlice from 'features/stepForm/stepSlice';
import anonymouscomplaintSlice from 'features/complaints/anonymouscomplaintSlice';
import villageSlice from 'features/village/villageSlice';
import speciesSlice from 'features/species/speciesSlice';
import dataManagementReducer from 'features/dataManagement/rootDataManagement';
import unitsReducer from 'features/units/unitsSlice';
import assetTypeReducer from 'features/asset-type/assetTypeSlice';
import papReducer from 'features/pap/papSlice';

const store = configureStore({ 
  reducer: {
    notification: notificationSlice,
    complaint: complaintSlice,
    complainant: complainantSlice,
    profession: professionSlice,
    province: provinceSlice,
    manager: managerSlice,
    committee: committeeSlice,
    complaintType: complaintTypeSlice,
    prejudice: prejudiceSlice,
    vulnerability: vulnerabilitySlice,
    projectSite: projectSiteReducer,
    type: incidentCauseReducer,
    isSensitive: incidentCauseReducer,
    repairRequest: repairRequestReducer,
    responsibleEntity: responsibleEntityReducer,
    groupCommitees: groupCommiteesSlice,
    complaintes: complaintsSlice,
    faq: questionsSlice,
    traitement: traitementSlice,
    steps: stepSlice,
    anonymouscomplaint: anonymouscomplaintSlice,
    village: villageSlice,
    species: speciesSlice,
    units: unitsReducer,
    assetType: assetTypeReducer,
    dataManagement: dataManagementReducer,
    pap: papReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
