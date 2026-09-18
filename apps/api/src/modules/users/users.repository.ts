import { users } from "../../db/schema/users";
import { userRoles } from "../../db/schema/user-roles";
import { db } from "../../lib/db";
import { eq, and, inArray } from "drizzle-orm";

export class UsersRepository {
  async findAllUsers() {
    return await db.query.users.findMany({
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });
  }

  async findUserById(id: string) {
    return await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });
  }

  async updateUser(id: string, body: any) {
    const [updatedUser] = await db
      .update(users)
      .set(body)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: string) {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return deletedUser;
  }

  async assignRoles(id: string, roleIds: string[]) {
    await db
      .insert(userRoles)
      .values(roleIds.map((roleId) => ({ userId: id, roleId })))
      .onConflictDoNothing();
  }

  async removeRoles(id: string, roleIds: string[]) {
    await db
      .delete(userRoles)
      .where(
        and(eq(userRoles.userId, id), inArray(userRoles.roleId, roleIds))
      );
  }
}
