import { HTTPException } from "hono/http-exception";
import { PortfoliosRepository } from "./portfolios.repository";

export class PortfoliosService {
  constructor(private readonly repository: PortfoliosRepository) {}

  async findAll() {
    const portfoliosList = await this.repository.findAll();
    return portfoliosList.map((portfolio: any) => {
      const { password: _, ...authorWithoutPassword } = portfolio.author;
      return {
        ...portfolio,
        author: authorWithoutPassword,
      };
    });
  }

  async findById(id: string) {
    const portfolio: any = await this.repository.findById(id);
    if (!portfolio) {
      throw new HTTPException(404, { message: "Portfolio not found" });
    }

    const { password: _, ...authorWithoutPassword } = portfolio.author;

    return {
      ...portfolio,
      author: authorWithoutPassword,
    };
  }

  async create(authorId: string, body: any) {
    const { title, coverImage, description, content, status, categoryIds, images } = body;

    const [newPortfolio] = await this.repository.create({
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
          portfolioId: newPortfolio.id,
          categoryId,
        }))
      );
    }

    if (images && images.length > 0) {
      await this.repository.createImages(
        images.map(
          (
            img: { url: string; alt?: string | null; sortOrder?: number | null },
            index: number
          ) => ({
            portfolioId: newPortfolio.id,
            url: img.url,
            alt: img.alt ?? undefined,
            sortOrder: img.sortOrder ?? index,
          })
        )
      );
    }

    return newPortfolio;
  }

  async update(id: string, body: any) {
    const { title, coverImage, description, content, status, categoryIds, images } = body;

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (title !== undefined) updateData.title = title;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;

    const [updatedPortfolio] = await this.repository.update(id, updateData);

    if (!updatedPortfolio) {
      throw new HTTPException(404, { message: "Portfolio not found" });
    }

    if (categoryIds !== undefined) {
      await this.repository.deleteCategoriesByPortfolioId(id);

      if (categoryIds.length > 0) {
        await this.repository.createCategories(
          categoryIds.map((categoryId: string) => ({
            portfolioId: id,
            categoryId,
          }))
        );
      }
    }

    if (images !== undefined) {
      await this.repository.deleteImagesByPortfolioId(id);

      if (images.length > 0) {
        await this.repository.createImages(
          images.map(
            (
              img: { url: string; alt?: string | null; sortOrder?: number | null },
              index: number
            ) => ({
              portfolioId: id,
              url: img.url,
              alt: img.alt ?? undefined,
              sortOrder: img.sortOrder ?? index,
            })
          )
        );
      }
    }

    return updatedPortfolio;
  }

  async delete(id: string) {
    const [deletedPortfolio] = await this.repository.softDelete(id);

    if (!deletedPortfolio) {
      throw new HTTPException(404, { message: "Portfolio not found" });
    }

    return deletedPortfolio;
  }
}
