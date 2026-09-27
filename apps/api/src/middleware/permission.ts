import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db } from "../lib/db";
import { userRoles } from "../db/schema/user-roles";
import { rolePermissions } from "../db/schema/role-permissions";
import { permissions } from "../db/schema/permissions";
import { eq, inArray, and } from "drizzle-orm";
import type { AppEnv } from "../lib/factory";

/**
 * Middleware to check if the authenticated user has a specific permission.
 * MUST be used AFTER `authMiddleware`.
 *
 * @param requiredPermission The name of the permission (e.g. "articles:create")
 */
export const requirePermission = (requiredPermission: string) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const jwtPayload = c.get("jwtPayload");

    if (!jwtPayload || typeof jwtPayload.sub !== "string") {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const userId = jwtPayload.sub;

    // 1. Get all roles for this user
    const userRoleRecords = await db.query.userRoles.findMany({
      where: eq(userRoles.userId, userId),
    });

    if (userRoleRecords.length === 0) {
      throw new HTTPException(403, { message: "Forbidden: No roles assigned" });
    }

    const roleIds = userRoleRecords.map((ur) => ur.roleId);

    // 2. Get all permission IDs for those roles
    const rolePermRecords = await db.query.rolePermissions.findMany({
      where: inArray(rolePermissions.roleId, roleIds),
    });

    if (rolePermRecords.length === 0) {
      throw new HTTPException(403, { message: "Forbidden: No permissions granted" });
    }

    const permissionIds = rolePermRecords.map((rp) => rp.permissionId);

    // 3. Check if the required permission is in the list
    const hasPermission = await db.query.permissions.findFirst({
      where: and(
        inArray(permissions.id, permissionIds),
        eq(permissions.name, requiredPermission)
      ),
    });

    if (!hasPermission) {
      throw new HTTPException(403, {
        message: `Forbidden: Requires '${requiredPermission}' permission`,
      });
    }

    await next();
  });
