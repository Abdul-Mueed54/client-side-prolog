import { create } from 'zustand';
import { Project } from '../types'; // Importing your master schema!

interface ProjectDisplayState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  closeSidebar: () => void;
}

export const useProjectDisplayStore = create<ProjectDisplayState>((set) => ({
  selectedProject: null, // Starts as null because nothing is clicked yet

  setSelectedProject: (project) => set({ selectedProject: project }),

  closeSidebar: () => set({ selectedProject: null }),
}));