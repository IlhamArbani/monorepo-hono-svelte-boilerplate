import { HTTPException } from "hono/http-exception";
import { ArticlesRepository } from "./articles.repository";

export class ArticlesService {
  constructor(private readonly repository: ArticlesRepository) {}

  async findAll() {
    const articleList = await this.repository.findAll();
    return articleList.map((article: any) => {
      if (article.author) {
        const { password, ...author } = article.author;
        return { ...article, author };
      }
      return article;
    });
  }

  async findById(id: string) {
    const article: any = await this.repository.findById(id);
    if (!article) {
      throw new HTTPException(404, { message: "Article not found" });
    }

    let data = article;
    if (article.author) {
      const { password, ...author } = article.author;
      data = { ...article, author };
    }
    return data;
  }

  async create(authorId: string, body: any) {
    const { title, coverImage, description, content, status, categoryIds } = body;
    const [article] = await this.repository.create({
      title,
      coverImage,
      description,
      content,
      status,
      authorId,
    });

    if (categoryIds && categoryIds.length > 0) {
      await this.repository.createCategories(
        categoryIds.map((categoryId: string) => ({
          articleId: article.id,
          categoryId,
        }))
      );
    }
    return article;
  }

  async update(id: string, body: any) {
    const { title, coverImage, description, content, status, categoryIds } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;

    let article;
    if (Object.keys(updateData).length > 0) {
      const [updated] = await this.repository.update(id, updateData);
      if (!updated) {
        throw new HTTPException(404, { message: "Article not found" });
      }
      article = updated;
    } else {
      const existing = await this.repository.findExistingById(id);
      if (!existing) {
        throw new HTTPException(404, { message: "Article not found" });
      }
      article = existing;
    }

    if (categoryIds !== undefined) {
      await this.repository.deleteCategoriesByArticleId(id);
      if (categoryIds.length > 0) {
        await this.repository.createCategories(
          categoryIds.map((categoryId: string) => ({
            articleId: id,
            categoryId,
          }))
        );
      }
    }

    return article;
  }

  async delete(id: string) {
    const [deleted] = await this.repository.softDelete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Article not found" });
    }
    return { message: "Article deleted" };
  }
}
