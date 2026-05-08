"use client"; // Make sure this is a client component

import React, { useState, useEffect } from "react";
import ProjectCard from "../projects/ProjectCard";
import { Project } from "@/../src/types";
import SearchBar from "../searchBar/SearchBar";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainWindow() {
  // Set up state to hold the fetched projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthStore();

  // used state for hydration so that on refreshing page the logic will not crash
  const [isHydrated, setIsHydrated] = useState(false);

  // This tells us when localStorage has successfully been read
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  //  Fetch data when the component loads
  useEffect(() => {
    if (!isHydrated) return;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const headers: any = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/`,
          {
            method: "GET",
            headers: headers,
          },
        );

        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch projects");
        }

        const json = await response.json();

        setProjects(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isHydrated, token]); // the empty array means this runs exactly once when the page loads

  return (
    <div className="h-[700px] overflow-y-auto overflow-scroll">
      <SearchBar />

      <div className="mb-6">
        <p className="text-slate-l font-medium">
          {isLoading ? (
            <span className="text-slate-400">Loading projects...</span>
          ) : (
            <>
              <strong className="text-slate-d">{projects.length}</strong>{" "}
              Projects Found
            </>
          )}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md border border-red-100">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 p-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
