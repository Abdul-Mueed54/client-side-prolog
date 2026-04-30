export interface Resources{
  projectReport: string;
  other: string;
}

export interface Comments{
  id: string;
  text: string;
}
export interface Project {
  id: string;
  title: string;
  abstract: string;
  department: string;
  domains: string[];
  supervisor: string;
  batch: string;
  isSponsored: boolean;
  comment?: Comments [];
  resources?: Resources [];
}