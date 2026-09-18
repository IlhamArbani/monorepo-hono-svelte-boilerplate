import { z } from "zod";

export const createPermissionDto = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const updatePermissionDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
