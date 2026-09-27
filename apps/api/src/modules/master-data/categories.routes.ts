import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../../middleware/auth";
import { createCategoryDto, updateCategoryDto } from "./categories.dto";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { factory } from "../../lib/factory";

import { requirePermission } from "../../middleware/permission";

const categoriesRoutes = factory.createApp();
const repository = new CategoriesRepository();
const service = new CategoriesService(repository);

categoriesRoutes.get("/", async (c) => {
  const data = await service.findAll();
  return c.json({ data });
});

categoriesRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.findById(id);
  return c.json({ data });
});

categoriesRoutes.post("/", authMiddleware, requirePermission("categories:create"), zValidator("json", createCategoryDto), async (c) => {
  const { name, description } = c.req.valid("json");
  const data = await service.create({ name, description });
  return c.json({ data }, 201);
});

categoriesRoutes.put("/:id", authMiddleware, requirePermission("categories:update"), zValidator("json", updateCategoryDto), async (c) => {
  const id = c.req.param("id");
  const { name, description } = c.req.valid("json");
  const data = await service.update(id, { name, description });
  return c.json({ data });
});

categoriesRoutes.delete("/:id", authMiddleware, requirePermission("categories:delete"), async (c) => {
  const id = c.req.param("id");
  const data = await service.delete(id);
  return c.json({ data });
});

export default categoriesRoutes;
