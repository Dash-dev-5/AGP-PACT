export interface Commitees {
  id: string;
  name: string;
  slug: string;
  referenceNumber: string;
  groupName: string;
  groupId: string;
  group: string;
  villages: Village[];
}

interface Village {
  name: string;
  id: string;
  slug: string;
  referenceNumber: string;
  committeeName: string;
  committeeId: string;
  projectSiteName: string;
  projectSiteId: string;
}

export interface GroupCommitees {
  name?: string;
  id?: string;
  slug?: string;
  referenceNumber?: string;
  committees: Commitees[];
}

export interface CommitteesWithPagging {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  data: Commitees[];
}

export interface FetchCommiteeType {
  pageSize?: number;
  currentPage?: number;
  filter?: string;
  allInOnePage?: boolean;
}
