import { z } from "zod";

export const createArticleDto = z.object({
  coverImage: z.string().nullish(),
  status: z.string().nullish(),
  categoryIds: z.array(z.string()).optional(),
  translations: z.array(
    z.object({
      locale: z.string().min(2).max(10),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      content: z.string().min(1),
    })
  ),
});

export const updateArticleDto = createArticleDto.partial();
