export interface Village {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  committeeName: string;
  committeeId: string;
  projectSiteName: string;
  projectSiteId: string;
}

export interface AddVillage {
  name: string;
  sector: string;
  projectSite: string;
  committee: string;
}
