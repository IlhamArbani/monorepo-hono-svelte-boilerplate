import { z } from "zod";

export const experienceMediaDto = z.object({
  url: z.string(),
  alt: z.string().nullish(),
  sortOrder: z.number().nullish()
});

export const createExperienceDto = z.object({
  jobTitle: z.string(),
  organization: z.string(),
  highlights: z.string().nullish(),
  location: z.string().nullish(),
  locationType: z.string().nullish(),
  employmentType: z.string().nullish(),
  startMonth: z.number().nullish(),
  startYear: z.number().nullish(),
  endMonth: z.number().nullish(),
  endYear: z.number().nullish(),
  isCurrentlyWork: z.boolean().nullish(),
  skillIds: z.array(z.string()).optional(),
  media: z.array(experienceMediaDto).optional()
});

export const updateExperienceDto = createExperienceDto.partial();
