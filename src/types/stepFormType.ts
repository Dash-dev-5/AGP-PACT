export interface UpdateStepTwoPayload {
    prejudice: string;
    complaint: string;
  }

 export  interface UpdateStepThreePayload {
    complaint: string;
    isEligible: boolean;
    documents?: string[];
  }
 export  interface UpdateStepFourPayload {
    complaint: string;
    proposedSolution: string;
    totalPrice?: string;
    documents?: string;
  }
 export  interface UpdateStepSixPayload {
    complaint: string;
    documents: string[];
  }
  export interface UpdateStepFiveOnePayload {
    complaint: string;
    isSolutionAccepted: boolean;
    refusalReason: string;
  }
  export interface UpdateStepSevenOnePayload {
    complaint: string;
    rating?: string;
    reason?: string;
  }
  export interface UpdateStepSevenTwoPayload {
    complaint: string;
    escalateComplaintToStep3: boolean;
  }
  export interface UpdateStepNinePayload {
    complaint: string;
    isComplaintSentToJustice: boolean;
  }

  
  