export interface Experience {
  id: string;
  organization: string;
  location: string;
  locationType: string; // e.g., 'onsite' | 'remote' | 'hybrid'
  employmentType: string; // e.g., 'full_time' | 'part_time' | 'contract'
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  isCurrentlyWork: boolean;
  createdAt: string;
  updatedAt: string;
  experienceSkills: string[]; // Update with specific type if skills have a defined structure
  media: string[];
  position: string;
  description: string;
}