import { z } from "zod";

export const createRoleDto = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateRoleDto = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const assignPermissionDto = z.object({
  permissionIds: z.array(z.string()),
});
