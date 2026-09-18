import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { skills } from "../../db/schema/skills";

export class SkillsRepository {
  async findAll() {
    return await db.query.skills.findMany();
  }

  async findById(id: string) {
    return await db.query.skills.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });
  }

  async create(data: { name: string }) {
    const [result] = await db
      .insert(skills)
      .values(data)
      .returning();
    return result;
  }

  async update(id: string, data: { name?: string }) {
    const [result] = await db
      .update(skills)
      .set(data)
      .where(eq(skills.id, id))
      .returning();
    return result;
  }

  async delete(id: string) {
    const [result] = await db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning();
    return result;
  }
}
