import { roles } from "../../db/schema/roles";
import { rolePermissions } from "../../db/schema/role-permissions";
import { db } from "../../lib/db";
import { and, eq, inArray } from "drizzle-orm";

export class RolesRepository {
  async findAllRoles() {
    return await db.query.roles.findMany({
      with: {
        rolePermissions: {
          with: {
            permission: true,
          },
        },
      },
    });
  }

  async findRoleById(id: string) {
    return await db.query.roles.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        rolePermissions: {
          with: {
            permission: true,
          },
        },
      },
    });
  }

  async createRole(data: any) {
    const [newRole] = await db.insert(roles).values(data).returning();
    return newRole;
  }

  async updateRole(id: string, data: any) {
    const [updatedRole] = await db
      .update(roles)
      .set(data)
      .where(eq(roles.id, id))
      .returning();
    return updatedRole;
  }

  async deleteRole(id: string) {
    const [deletedRole] = await db
      .delete(roles)
      .where(eq(roles.id, id))
      .returning();
    return deletedRole;
  }

  async assignPermissions(id: string, permissionIds: string[]) {
    await db
      .insert(rolePermissions)
      .values(
        permissionIds.map((permissionId: string) => ({
          roleId: id,
          permissionId,
        }))
      )
      .onConflictDoNothing();
  }

  async removePermissions(id: string, permissionIds: string[]) {
    await db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, id),
          inArray(rolePermissions.permissionId, permissionIds)
        )
      );
  }
}
