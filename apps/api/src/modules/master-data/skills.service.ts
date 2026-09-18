import { HTTPException } from "hono/http-exception";
import { SkillsRepository } from "./skills.repository";

export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    const data = await this.repository.findById(id);
    if (!data) {
      throw new HTTPException(404, { message: "Skill not found" });
    }
    return data;
  }

  async create(data: { name: string }) {
    return await this.repository.create(data);
  }

  async update(id: string, data: { name?: string }) {
    const result = await this.repository.update(id, data);
    if (!result) {
      throw new HTTPException(404, { message: "Skill not found" });
    }
    return result;
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    if (!result) {
      throw new HTTPException(404, { message: "Skill not found" });
    }
    return result;
  }
}
