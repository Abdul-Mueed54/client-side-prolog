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

export interface Domains {
  id: string;
  name: string;
  description: string;
  deptAbbreviation: string;
}

export interface Departments {
  name: string;
  abbreviation: string;
}
