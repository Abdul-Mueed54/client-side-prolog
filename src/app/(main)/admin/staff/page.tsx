import { columns } from "./columns";
import { DataTable } from "./projectsDataTable";
import { Project } from "@/types";

// async function getData(): Promise<Project[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "proj-001",
//       title: "ProLog: Project Cataloging System",
//       abstract:
//         "A centralized digital archive and search engine for Final Year Design Projects, transitioning from manual storage to a digitized LAN-based application.",
//       department: "CIS",
//       domains: ["Web Dev", "Database Architecture"],
//       supervisor: ["Dr. Muhammad Numan"],
//       batch: "2025-2026",
//       isSponsored: true,
//     },
//     {
//       id: "proj-002",
//       title: "Neuro-Symbolic AI for Medical Diagnosis",
//       abstract:
//         "Combining neural networks with symbolic logic systems to provide interpretable and highly accurate diagnoses for early-stage respiratory illnesses.",
//       department: "CIS",
//       domains: ["AI/ML", "Healthcare Technology"],
//       supervisor: ["Dr. Aisha Khan", "Prof. Tariq Mahmood"],
//       batch: "2025-2026",
//       isSponsored: false,
//     },
//     {
//       id: "proj-003",
//       title: "Low Power FPGA Based Vehicle Detector",
//       abstract:
//         "A hardware-accelerated computer vision system utilizing low power FPGAs to accurately track and count vehicles in real-time under variable lighting conditions.",
//       department: "CIS",
//       domains: ["Computer Vision", "Hardware/FPGA", "IoT"],
//       supervisor: ["Dr. Syed Ali"],
//       batch: "2025-2026",
//       isSponsored: true,
//     },
//     {
//       id: "proj-004",
//       title: "Decentralized Voting Mechanism on Ethereum",
//       abstract:
//         "A secure, transparent, and immutable electronic voting system leveraging smart contracts to prevent tampering and ensure voter anonymity.",
//       department: "SE",
//       domains: ["Blockchain", "Cybersecurity", "Web3"],
//       supervisor: ["Engr. Fatima Zahra"],
//       batch: "2025-2026",
//       isSponsored: false,
//     },
//     {
//       id: "proj-005",
//       title: "TextileCheck: Real-time Quality Control",
//       abstract:
//         "Automated fabric defect detection system using high-speed cameras and edge-deployed machine learning models to reduce waste in textile manufacturing.",
//       department: "CIS",
//       domains: ["AI/ML", "Embedded Systems", "Manufacturing"],
//       supervisor: ["Dr. Muhammad Numan", "Engr. Bilal Ahmed"],
//       batch: "2025-2026",
//       isSponsored: true,
//     },
//     // ...
//   ];
// }

export default async function StaffUsersTable() {
  // const data = await getData();
  // const columns = await ProjectColumn()
  return (
    <div className="container mx-auto py-10">
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
}
