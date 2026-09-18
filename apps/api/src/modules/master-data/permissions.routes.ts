import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../../middleware/auth";
import { createPermissionDto, updatePermissionDto } from "./permissions.dto";
import { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";
import { factory } from "../../lib/factory";

const permissionsRoutes = factory.createApp();
const repository = new PermissionsRepository();
const service = new PermissionsService(repository);

permissionsRoutes.use(authMiddleware);

permissionsRoutes.get("/", async (c) => {
  const data = await service.findAll();
  return c.json({ data });
});

permissionsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.findById(id);
  return c.json({ data });
});

permissionsRoutes.post("/", zValidator("json", createPermissionDto), async (c) => {
  const { name, description } = c.req.valid("json");
  const data = await service.create({ name, description });
  return c.json({ data }, 201);
});

permissionsRoutes.put("/:id", zValidator("json", updatePermissionDto), async (c) => {
  const id = c.req.param("id");
  const { name, description } = c.req.valid("json");
  const data = await service.update(id, { name, description });
  return c.json({ data });
});

permissionsRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.delete(id);
  return c.json({ data });
});

export default permissionsRoutes;
