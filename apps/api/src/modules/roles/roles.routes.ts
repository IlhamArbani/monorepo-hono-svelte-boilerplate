import { authMiddleware } from "../../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { createRoleDto, updateRoleDto, assignPermissionDto } from "./roles.dto";
import { RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";
import { factory } from "../../lib/factory";

const rolesRoutes = factory.createApp();
const repository = new RolesRepository();
const service = new RolesService(repository);

rolesRoutes.use(authMiddleware);

rolesRoutes.get("/", async (c) => {
  const data = await service.getAllRoles();
  return c.json({ data });
});

rolesRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.getRoleById(id);
  return c.json({ data });
});

rolesRoutes.post("/", zValidator("json", createRoleDto), async (c) => {
  const body = c.req.valid("json");
  const data = await service.createRole(body);
  return c.json({ data }, 201);
});

rolesRoutes.put("/:id", zValidator("json", updateRoleDto), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");
  const data = await service.updateRole(id, body);
  return c.json({ data });
});

rolesRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.deleteRole(id);
  return c.json({ data });
});

rolesRoutes.post("/:id/permissions", zValidator("json", assignPermissionDto), async (c) => {
  const id = c.req.param("id");
  const { permissionIds } = c.req.valid("json");
  const data = await service.assignPermissions(id, permissionIds);
  return c.json({ data });
});

rolesRoutes.delete("/:id/permissions", async (c) => {
  const id = c.req.param("id");
  const { permissionIds } = await c.req.json<{ permissionIds: string[] }>();
  const data = await service.removePermissions(id, permissionIds);
  return c.json({ data });
});

export default rolesRoutes;
