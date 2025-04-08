export interface Response {
    name: string;
  }
  
export  interface Question {
    id?: string;
    name: string;
    responses: Response[];
  }