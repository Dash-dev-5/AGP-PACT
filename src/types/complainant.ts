export type Complainant = {
    id: string; 
    fullName: string; 
    legalPersonality: 'Physique' | 'Morale'; 
    organizationStatus: 'Structure public' | 'Structure privé'; 
    userDetails: string; 
    account: string; 
    profession: string; 
    vulnerabilityLevel: string;
  };
  