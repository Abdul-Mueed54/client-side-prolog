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
  domainId: string;
  domainName: string;
  domainDescription: string;
  deptAbbreviation: string;
}

export interface Departments {
  deptAbbreviation: string;
  deptName: string;
}

export interface Grants {
  projectId?: string;
  name: string;
  amount: number;
  industryName: string;
}

export interface Industry {
  industryId: string;
  industryName: string;
  industryLocation: string;
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
  groupId: string;
  groupLeader: string;
  member2: string | null;
  member3: string | null;
  member4: string | null;
  projectId: string | null;
}

export interface Students {
  seatNo: string;
  stdName: string;
  stdEmail: string;
  batch: string;
  deptAbbreviation: string;
}

export interface Faculty {
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  deptAbbreviation: string;
}
