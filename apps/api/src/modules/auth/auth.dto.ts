import { z } from "zod";

export const registerDto = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export const loginDto = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof loginDto>;
export type RegisterDto = z.infer<typeof registerDto>;
