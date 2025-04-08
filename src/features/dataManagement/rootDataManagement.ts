import { combineReducers, Reducer } from '@reduxjs/toolkit';
import registrationStepsReducer from './registrationSteps/registrationStepsSlice';
import anonynousRegistrationStepsReducer from './anonynousRegistrationSteps/anonynousRegistrationStepsSlice';
import complainantComplaintStepsReducer from './complainantComplaintSteps/complainantComplaintStepsSlice';
import adminRegistrationStepsReducer from './adminComplaintSteps/adminComplaintStepsSlice';

interface DataManagementState {
  registrationSteps: ReturnType<typeof registrationStepsReducer>;
  anonynousRegistrationSteps: ReturnType<typeof anonynousRegistrationStepsReducer>;
  complainantComplaintSteps: ReturnType<typeof complainantComplaintStepsReducer>;
  adminRegistrationSteps: ReturnType<typeof adminRegistrationStepsReducer>;
}

const dataManagementReducer: Reducer<DataManagementState> = combineReducers({
  registrationSteps: registrationStepsReducer,
  anonynousRegistrationSteps: anonynousRegistrationStepsReducer,
  complainantComplaintSteps: complainantComplaintStepsReducer,
  adminRegistrationSteps: adminRegistrationStepsReducer
});

export default dataManagementReducer;
