import { z } from "zod";

export const portfolioImageDto = z.object({
  url: z.string(),
  alt: z.string().nullish(),
  sortOrder: z.number().nullish()
});

export const createPortfolioDto = z.object({
  coverImage: z.string().nullish(),
  status: z.string().nullish(),
  categoryIds: z.array(z.string()).optional(),
  images: z.array(portfolioImageDto).optional(),
  translations: z.array(z.object({
    locale: z.string().min(2).max(10),
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    content: z.string().min(1),
  }))
});

export const updatePortfolioDto = createPortfolioDto.partial();
