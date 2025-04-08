import { City, Prejiduce, ProjeSite, Province, Provinces, ResposableEntity, Sector } from "types/auth";
import { Commitees, GroupCommitees } from "types/commitee";
import { Profession } from "types/profession";
import { Village } from "types/village";
import axios from "utils/axios";



export const fetchProffesions = async (): Promise<Profession[]> => {
    try {
      const response = await axios.get<Profession[]>('professions');
      return response.data;
    } catch (error) {
      console.error('Error fetching profession:', error);
      return [];
    }
  };
export const fetchProvinces = async (): Promise<Provinces[]> => {
    try {
      const response = await axios.get<Provinces[]>('provinces');
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  };
export const fetchCitiesByProvinceId = async (provinceId :string): Promise<City[]> => {
    try {
      const response = await axios.get<City[]>('cities/provinces/' + provinceId);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  };
export const fetchSectorsByCityId = async (cityId :string): Promise<Sector[]> => {
    try {
      const response = await axios.get<Sector[]>('sectors/city/' + cityId);
      return response.data;
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  };
  export const fetchVillagesBySectorId = async (sectorId :string): Promise<Village[]> => {
    try {
      const response = await axios.get<Village[]>('villages/sectors/' + sectorId);      
      return response.data;
    } catch (error) {
      console.error('Error fetching villages:', error);
      return [];
    }
  };
 export interface InitialStateCommittee {
    committees: Commitees[];
    isLoading: boolean;
    error: string | null;
    totalItems: number;
    currentPage: number;
}
export const fetchAllCommittees = async (): Promise<InitialStateCommittee> => {
  try {
      const response = await axios.get<{ data: Commitees[]; totalItems: number; currentPage: number }>('committees');
      return {
          committees: response.data.data, 
          isLoading: false,                 
          error: null,   
          totalItems: response.data.totalItems,
          currentPage: response.data.currentPage
      };
  } catch (error: any) {
      console.error('Error fetching committees:', error);
      return {
          committees: [],
          isLoading: false,
          error: error.message || 'An error occurred',
          totalItems: 0,
          currentPage: 0
      };
  }
};

export const fetchAllGroups= async (): Promise<GroupCommitees[]> => {
  try {
    const response = await axios.get<GroupCommitees[]>('committee-group');
    return response.data;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return []
  }}

export const fetchResponsableEntity = async (): Promise<ResposableEntity[]> => {
  try {
    const response = await axios.get<ResposableEntity[]>('responsible-entity');      
    return response.data;
  } catch (error) {
    console.error('Error fetching ResposableEntity:', error);
    return [];
  }
};


export const fetchSite = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>('project-site');      
    return response.data;
  } catch (error) {
    console.error('Error fetching ProjeSite:', error);
    return [];
  }
};

export const fetchRepairType = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>('requested-repair-type');      
    return response.data;
  } catch (error) {
    console.error('Error fetching requested-repair-type:', error);
    return [];
  }
};

export const fetchPrejudice = async (): Promise<Prejiduce[]> => {
  try {
    const response = await axios.get<Prejiduce[]>('prejudices');      
    return response.data;
  } catch (error) {
    console.error('Error fetching requested-repair-type:', error);
    return [];
  }
};

export const fetchActivities = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>('activities');      
    return response.data;
  } catch (error) {
    console.error('Error fetching requested-repair-type:', error);
    return [];
  }
};

export const fetchVulnerability = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>('vulnerability-level');      
    return response.data;
  } catch (error) {
    console.error('Error fetching requested-repair-type:', error);
    return [];
  }
};

export const fetchComplaintType = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>('complaint-type');     
    console.log("#########3 ",response.data) 
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint-type', error);
    return [];
  }
};

export const fetchPrejudiceByIdComplainType = async (id:string): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>(`prejudices/complaint-type/${id}`);      
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint-type', error);
    return [];
  }
};

export const fetchAssetSpecies = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>(`asset-species`);      
    return response.data;
  } catch (error) {
    console.error('Error fetching asset-species', error);
    return [];
  }
};

export const fetchAssetSpeciesByType = async (id:string): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>(`/asset-species/asset-type/${id}`);      
    return response.data;
  } catch (error) {
    console.error('Error fetching asset-species', error);
    return [];
  }
};

export const fetchAssetTypes = async (): Promise<ProjeSite[]> => {
  try {
    const response = await axios.get<ProjeSite[]>(`asset-type`);      
    return response.data;
  } catch (error) {
    console.error('Error fetching asset-type', error);
    return [];
  }
};
