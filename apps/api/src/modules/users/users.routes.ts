import { authMiddleware } from "../../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { updateUserDto, assignRoleDto } from "./users.dto";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { factory } from "../../lib/factory";

const usersRoutes = factory.createApp();
const repository = new UsersRepository();
const service = new UsersService(repository);

usersRoutes.use(authMiddleware);

// GET / - List all users (without password)
usersRoutes.get("/", async (c) => {
  const data = await service.getAllUsers();
  return c.json({ data });
});

// GET /:id - Get user by ID with roles
usersRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.getUserById(id);
  return c.json({ data });
});

// PUT /:id - Update user
usersRoutes.put("/:id", zValidator("json", updateUserDto), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");
  const data = await service.updateUser(id, body);
  return c.json({ data });
});

// DELETE /:id - Delete user
usersRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.deleteUser(id);
  return c.json({ data });
});

// POST /:id/roles - Assign roles to user
usersRoutes.post("/:id/roles", zValidator("json", assignRoleDto), async (c) => {
  const id = c.req.param("id");
  const { roleIds } = c.req.valid("json");
  const data = await service.assignRoles(id, roleIds);
  return c.json({ data });
});

// DELETE /:id/roles - Remove roles from user
usersRoutes.delete("/:id/roles", async (c) => {
  const id = c.req.param("id");
  const { roleIds } = await c.req.json<{ roleIds: string[] }>();
  const data = await service.removeRoles(id, roleIds);
  return c.json({ data });
});

export default usersRoutes;
