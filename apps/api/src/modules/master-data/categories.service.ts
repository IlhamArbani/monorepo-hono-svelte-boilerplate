import { HTTPException } from "hono/http-exception";
import { CategoriesRepository } from "./categories.repository";

export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    const data = await this.repository.findById(id);
    if (!data) {
      throw new HTTPException(404, { message: "Category not found" });
    }
    return data;
  }

  async create(data: { name: string; description?: string }) {
    return await this.repository.create(data);
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const result = await this.repository.update(id, data);
    if (!result) {
      throw new HTTPException(404, { message: "Category not found" });
    }
    return result;
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    if (!result) {
      throw new HTTPException(404, { message: "Category not found" });
    }
    return result;
  }
}
