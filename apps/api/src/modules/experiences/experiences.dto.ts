import { z } from "zod";

export const experienceMediaDto = z.object({
  url: z.string(),
  alt: z.string().nullish(),
  sortOrder: z.number().nullish()
});

export const createExperienceDto = z.object({
  organization: z.string(),
  location: z.string().nullish(),
  locationType: z.string().nullish(),
  employmentType: z.string().nullish(),
  startMonth: z.number().nullish(),
  startYear: z.number().nullish(),
  endMonth: z.number().nullish(),
  endYear: z.number().nullish(),
  isCurrentlyWork: z.boolean().nullish(),
  skillIds: z.array(z.string()).optional(),
  media: z.array(experienceMediaDto).optional(),
  translations: z.array(z.object({
    locale: z.string().min(2).max(10),
    jobTitle: z.string().min(1).max(255),
    highlights: z.string().optional(),
  }))
});

export const updateExperienceDto = createExperienceDto.partial();
