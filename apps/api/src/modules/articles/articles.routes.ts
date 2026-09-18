import { authMiddleware } from "../../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { createArticleDto, updateArticleDto } from "./articles.dto";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesService } from "./articles.service";
import { factory } from "../../lib/factory";

const articlesRoutes = factory.createApp();
const repository = new ArticlesRepository();
const service = new ArticlesService(repository);

articlesRoutes.get("/", async (c) => {
  const data = await service.findAll();
  return c.json({ data });
});

articlesRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.findById(id);
  return c.json({ data });
});

articlesRoutes.post("/", authMiddleware, zValidator("json", createArticleDto), async (c) => {
  const authorId = c.get("jwtPayload").sub;
  const body = c.req.valid("json");
  const data = await service.create(authorId, body);
  return c.json({ data }, 201);
});

articlesRoutes.put("/:id", authMiddleware, zValidator("json", updateArticleDto), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");
  const data = await service.update(id, body);
  return c.json({ data });
});

articlesRoutes.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const data = await service.delete(id);
  return c.json({ data });
});

export default articlesRoutes;
