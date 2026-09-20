import { db } from "../../lib/db";
import { articles } from "../../db/schema/articles";
import { articleCategories } from "../../db/schema/article-categories";
import { articleTranslations } from "../../db/schema/article-translations";
import { eq } from "drizzle-orm";

export class ArticlesRepository {
  async findAll() {
    return await db.query.articles.findMany({
      where: (fields, { eq, and, isNull }) => and(eq(fields.status, "publish"), isNull(fields.deletedAt)),
      with: {
        author: true,
        translations: true,
        articleCategories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });
  }

  async findAllByLocale(locale: string) {
    return await db.query.articles.findMany({
      where: (fields, { eq, and, isNull }) => and(eq(fields.status, "publish"), isNull(fields.deletedAt)),
      with: {
        author: true,
        translations: {
          where: (fields, { eq }) => eq(fields.locale, locale),
        },
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
        translations: true,
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

  async create(data: any, translations: any[]) {
    const [article] = await db.insert(articles).values(data).returning();
    if (translations && translations.length > 0) {
      await db.insert(articleTranslations).values(
        translations.map((t) => ({ ...t, articleId: article.id }))
      );
    }
    return [article];
  }

  async createCategories(data: any[]) {
    return await db.insert(articleCategories).values(data);
  }

  async update(id: string, data: any, translations?: any[]) {
    let updatedArticle;
    if (Object.keys(data).length > 0) {
      const updated = await db.update(articles).set(data).where(eq(articles.id, id)).returning();
      if (updated.length > 0) {
        updatedArticle = updated[0];
      }
    }
    
    if (translations !== undefined) {
      await db.delete(articleTranslations).where(eq(articleTranslations.articleId, id));
      if (translations.length > 0) {
        await db.insert(articleTranslations).values(
          translations.map((t) => ({ ...t, articleId: id }))
        );
      }
    }
    return updatedArticle ? [updatedArticle] : [];
  }

  async deleteCategoriesByArticleId(id: string) {
    return await db.delete(articleCategories).where(eq(articleCategories.articleId, id));
  }

  async softDelete(id: string) {
    return await db.update(articles).set({ deletedAt: new Date() }).where(eq(articles.id, id)).returning();
  }
}
