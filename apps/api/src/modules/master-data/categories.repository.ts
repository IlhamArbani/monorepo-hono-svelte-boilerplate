import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { categories } from "../../db/schema/categories";

export class CategoriesRepository {
  async findAll() {
    return await db.query.categories.findMany();
  }

  async findById(id: string) {
    return await db.query.categories.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });
  }

  async create(data: { name: string; description?: string }) {
    const [result] = await db
      .insert(categories)
      .values(data)
      .returning();
    return result;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const [result] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return result;
  }

  async delete(id: string) {
    const [result] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result;
  }
}
