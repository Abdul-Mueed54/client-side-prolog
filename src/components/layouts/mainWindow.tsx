import React from "react";
import ProjectCard from "../projects/ProjectCard";
import { Project } from "@/src/types";
import SearchBar from "../searchBar/SearchBar";

export default function MainWindow() {
  const MOCK_PROJECTS: Project[] = [
    {
      id: "proj-001",
      title: "ProLog: Project Cataloging System",
      abstract:
        "A centralized digital archive and search engine for Final Year Design Projects, transitioning from manual storage to a digitized LAN-based application.",
      department: "CIS - Computer & Info Systems",
      domains: ["AI/ML", "Web Dev"],
      supervisor: "Dr. Muhammad Numan",
      batch: "2025-2026",
      isSponsored: true,
    },
    {
      id: "proj-002",
      title: "EcoWeave: Sustainable Dyeing Process",
      abstract:
        "Investigating the use of organic, plant-based dyes combined with ML-driven temperature control to reduce water waste in textile manufacturing.",
      department: "TS - Textile Sciences",
      domains: ["Chemical Processing", "Sustainability", "AI/ML"],
      supervisor: "Dr. Aisha Khan",
      batch: "2024-2025",
      isSponsored: false,
    },
    {
      id: "proj-003",
      title: "DefectDetect: Real-time Fabric Inspection",
      abstract:
        "An FPGA-based computer vision system installed on looms to instantly detect thread breakages and weaving defects using neural networks.",
      department: "TE - Textile Engineering",
      domains: ["Quality Control", "AI/ML"],
      supervisor: "Engr. Tariq Mehmood",
      batch: "2025-2026",
      isSponsored: true,
    },
    {
      id: "proj-004",
      title: "SecureCampus: Zero-Trust Network Architecture",
      abstract:
        "Implementing a zero-trust security model for the university's internal faculty network to prevent unauthorized data access and lateral movement.",
      department: "SE - Software Engineering",
      domains: ["Cyber Security"],
      supervisor: "Dr. Sarah Ahmed",
      batch: "2023-2024",
      isSponsored: false,
    },
    {
      id: "proj-005",
      title: "CloudLoom: IoT Weaving Analytics",
      abstract:
        "A cloud-based dashboard that aggregates real-time IoT sensor data from multiple industrial looms to predict maintenance needs.",
      department: "CIS - Computer & Info Systems",
      domains: ["Cloud Computing", "Web Dev", "Embedded Systems"],
      supervisor: "Dr. Muhammad Numan",
      batch: "2024-2025",
      isSponsored: true,
    },
    {
      id: "proj-006",
      title: "PolyFlex: Advanced Sports Textiles",
      abstract:
        "Development of a new polymer blend for high-performance athletic wear that dynamically adjusts breathability based on body heat.",
      department: "TE - Textile Engineering",
      domains: ["Polymer Science", "Yarn Manufacturing"],
      supervisor: "Dr. Usman Ali",
      batch: "2025-2026",
      isSponsored: false,
    },
  ];

  return (
    <div className="h-[700px] overflow-y-auto overflow-scroll">
      <SearchBar />
      <div className="mb-6">
        <p className="text-slate-500 font-medium">
          <strong className="text-slate-800">{MOCK_PROJECTS.length}</strong>{" "}
          Projects Found
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {MOCK_PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
