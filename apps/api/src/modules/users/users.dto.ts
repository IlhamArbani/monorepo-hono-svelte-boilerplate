import { z } from "zod";

export const updateUserDto = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const assignRoleDto = z.object({
  roleIds: z.array(z.string()),
});
