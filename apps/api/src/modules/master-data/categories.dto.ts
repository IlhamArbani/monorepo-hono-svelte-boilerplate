import { z } from "zod";

export const createCategoryDto = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const updateCategoryDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
