import { z } from "zod";

export const createSkillDto = z.object({
  name: z.string(),
});

export const updateSkillDto = z.object({
  name: z.string().optional(),
});
