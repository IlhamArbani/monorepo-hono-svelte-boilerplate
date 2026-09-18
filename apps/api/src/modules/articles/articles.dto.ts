import { z } from "zod";

export const createArticleDto = z.object({
  title: z.string(),
  coverImage: z.string().nullish(),
  description: z.string().nullish(),
  content: z.string().nullish(),
  status: z.string().nullish(),
  categoryIds: z.array(z.string()).optional(),
});

export const updateArticleDto = createArticleDto.partial();
