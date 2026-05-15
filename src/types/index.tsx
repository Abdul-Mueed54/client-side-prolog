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

export interface Grants {
  projectId: string;
  name: string;
  recievedDate: Date;
  amount: number;
  industryId: string;
}

export interface Industries {
  industryId: string;
  industryName: string;
  location: string;
  industryType: string;
  industryEmail: string;
}

export interface Externals {
  extEmail: string;
  extName: string;
  extDesignation: string;
  industryId: string;
}

export interface Groups {
  groupLeader: string;
  member2: string;
  member3: string;
  member4: string;
  projectId: string;
}
