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
  grantDetails?: { grantName: string; grantIndustryName: string; grantAmount: number; }[];
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
  grantName: string;
  recievedDate: Date;
  grantAmount: number;
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
  industryId?: string;
  industryName?: string;
}

export interface Groups {
  groupId: string;
  groupLeader: string;
  member2: string;
  member3: string;
  member4: string;
  projectId: string;
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
  facultyContactNo: string;
  designation?: string;
  role: string;
  isActive: boolean;
  areaOfResearch?: string;
}

export interface Staff {
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffContactNo: string;
  deptAbbreviation: string;
  role: string;
  isActive: boolean;
  jobTitle?: string;
}

export interface AuditLog {
  id: string;
  tableName: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  oldData: Record<string, any> | null;
  newData: Record<string, any> | null;
  changedAt: string; // Date string
}

export interface DashboardStats {
  totalFaculty: number;
  totalSupervisingFaculty: number;
  totalExternals: number;
  totalIndustries: number;
  totalDept: number;
  totalDomain: number;
  totalProject: number;
  totalStaff: number;
  totalUsers: number;
  totalStudent: number;
  totalGrants: number;
  totalGroups: number;
  totalLogs: number,
  projectsByDept: number;
  studentsByFilter: number;
}
