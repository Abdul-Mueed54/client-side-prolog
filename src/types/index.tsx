
export interface Project {
  id: string;
  title: string;
  abstract: string;
  department: string;
  domains: string[];
  supervisor: string;
  batch: string;
  isSponsored: boolean;
}