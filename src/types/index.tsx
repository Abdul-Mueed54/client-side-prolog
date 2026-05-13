export interface Resources {
  projectReport: string;
  other: string;
}

export interface Comments {
  id: string;
  text: string;
}
export interface Project {
  id: string;
  title: string;
  abstract: string;
  department: string;
  domains: string[];
  supervisors: { role: string; name: string }[];
  batch: string;
  grants?: { name: string; amount: number }[];
  industries?: { name: string; association: string }[];
  comment?: Comments[];
  resources?: Resources[];
}
