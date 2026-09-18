import { db } from "../../lib/db";
import { portfolios } from "../../db/schema/portfolios";
import { portfolioImages } from "../../db/schema/portfolio-images";
import { portfolioCategories } from "../../db/schema/portfolio-categories";
import { eq } from "drizzle-orm";

export class PortfoliosRepository {
  async findAll() {
    return await db.query.portfolios.findMany({
      where: (fields, { eq, and, isNull }) => and(eq(fields.status, "publish"), isNull(fields.deletedAt)),
      with: {
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

  async create(data: any) {
    return await db.insert(portfolios).values(data).returning();
  }

  async createCategories(data: any[]) {
    return await db.insert(portfolioCategories).values(data);
  }

  async createImages(data: any[]) {
    return await db.insert(portfolioImages).values(data);
  }

  async update(id: string, data: any) {
    return await db.update(portfolios).set(data).where(eq(portfolios.id, id)).returning();
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
