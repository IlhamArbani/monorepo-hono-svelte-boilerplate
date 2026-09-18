import { z } from "zod";

export const portfolioImageDto = z.object({
  url: z.string(),
  alt: z.string().nullish(),
  sortOrder: z.number().nullish()
});

export const createPortfolioDto = z.object({
  title: z.string(),
  coverImage: z.string().nullish(),
  description: z.string().nullish(),
  content: z.string().nullish(),
  status: z.string().nullish(),
  categoryIds: z.array(z.string()).optional(),
  images: z.array(portfolioImageDto).optional()
});

export const updatePortfolioDto = createPortfolioDto.partial();
