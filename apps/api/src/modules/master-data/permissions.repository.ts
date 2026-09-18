import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { permissions } from "../../db/schema/permissions";

export class PermissionsRepository {
  async findAll() {
    return await db.query.permissions.findMany();
  }

  async findById(id: string) {
    return await db.query.permissions.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
    });
  }

  async create(data: { name: string; description?: string }) {
    const [result] = await db
      .insert(permissions)
      .values(data)
      .returning();
    return result;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const [result] = await db
      .update(permissions)
      .set(data)
      .where(eq(permissions.id, id))
      .returning();
    return result;
  }

  async delete(id: string) {
    const [result] = await db
      .delete(permissions)
      .where(eq(permissions.id, id))
      .returning();
    return result;
  }
}
