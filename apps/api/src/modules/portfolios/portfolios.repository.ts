import { db } from "../../lib/db";
import { portfolios } from "../../db/schema/portfolios";
import { portfolioImages } from "../../db/schema/portfolio-images";
import { portfolioCategories } from "../../db/schema/portfolio-categories";
import { portfolioTranslations } from "../../db/schema/portfolio-translations";
import { eq } from "drizzle-orm";

export class PortfoliosRepository {
  async findAll() {
    return await db.query.portfolios.findMany({
      where: (fields, { eq, and, isNull }) => and(eq(fields.status, "publish"), isNull(fields.deletedAt)),
      with: {
        translations: true,
        author: true,
        images: {
          orderBy: (fields, { asc }) => asc(fields.sortOrder),
        },
        portfolioCategories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });
  }

  async findById(id: string) {
    return await db.query.portfolios.findFirst({
      where: (fields, { eq, and, isNull }) => and(eq(fields.id, id), isNull(fields.deletedAt)),
      with: {
        translations: true,
        author: true,
        images: {
          orderBy: (fields, { asc }) => asc(fields.sortOrder),
        },
        portfolioCategories: {
          with: {
            category: true,
          },
        },
      },
    });
  }

  async create(data: any, translationsData?: any[]) {
    const [newPortfolio] = await db.insert(portfolios).values(data).returning();
    if (translationsData && translationsData.length > 0) {
      const formattedTranslations = translationsData.map(t => ({ ...t, portfolioId: newPortfolio.id }));
      await db.insert(portfolioTranslations).values(formattedTranslations);
    }
    return [newPortfolio];
  }

  async createCategories(data: any[]) {
    return await db.insert(portfolioCategories).values(data);
  }

  async createImages(data: any[]) {
    return await db.insert(portfolioImages).values(data);
  }

  async update(id: string, data: any, translationsData?: any[]) {
    const updated = await db.update(portfolios).set(data).where(eq(portfolios.id, id)).returning();
    if (translationsData) {
      await db.delete(portfolioTranslations).where(eq(portfolioTranslations.portfolioId, id));
      if (translationsData.length > 0) {
        const formattedTranslations = translationsData.map(t => ({ ...t, portfolioId: id }));
        await db.insert(portfolioTranslations).values(formattedTranslations);
      }
    }
    return updated;
  }

  async deleteCategoriesByPortfolioId(id: string) {
    return await db.delete(portfolioCategories).where(eq(portfolioCategories.portfolioId, id));
  }

  async deleteImagesByPortfolioId(id: string) {
    return await db.delete(portfolioImages).where(eq(portfolioImages.portfolioId, id));
  }

  async softDelete(id: string) {
    return await db.update(portfolios).set({ deletedAt: new Date() }).where(eq(portfolios.id, id)).returning();
  }
}
