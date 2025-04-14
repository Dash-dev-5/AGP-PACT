export interface CreateIncidentCause {
  name: string;
}

export interface IncidentCause {
  id: string;
  name: string;
  slug: string;
  referenceNumber: string;
  isSensitive: boolean;
}
