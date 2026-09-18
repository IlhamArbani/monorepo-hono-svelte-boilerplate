import { db } from "../../lib/db";
import { articles } from "../../db/schema/articles";
import { articleCategories } from "../../db/schema/article-categories";
import { eq } from "drizzle-orm";

export class ArticlesRepository {
  async findAll() {
    return await db.query.articles.findMany({
      where: (fields, { eq, and, isNull }) => and(eq(fields.status, "publish"), isNull(fields.deletedAt)),
      with: {
        author: true,
        articleCategories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });
  }

  async findById(id: string) {
    return await db.query.articles.findFirst({
      where: (fields, { eq, and, isNull }) => and(eq(fields.id, id), isNull(fields.deletedAt)),
      with: {
        author: true,
        articleCategories: {
          with: {
            category: true,
          },
        },
      },
    });
  }

  async findExistingById(id: string) {
    return await db.query.articles.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });
  }

  async create(data: any) {
    return await db.insert(articles).values(data).returning();
  }

  async createCategories(data: any[]) {
    return await db.insert(articleCategories).values(data);
  }

  async update(id: string, data: any) {
    return await db.update(articles).set(data).where(eq(articles.id, id)).returning();
  }

  async deleteCategoriesByArticleId(id: string) {
    return await db.delete(articleCategories).where(eq(articleCategories.articleId, id));
  }

  async softDelete(id: string) {
    return await db.update(articles).set({ deletedAt: new Date() }).where(eq(articles.id, id)).returning();
  }
}
