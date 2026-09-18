import { authMiddleware } from "../../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { createExperienceDto, updateExperienceDto } from "./experiences.dto";
import { ExperiencesRepository } from "./experiences.repository";
import { ExperiencesService } from "./experiences.service";
import { factory } from "../../lib/factory";

const router = factory.createApp();
const repository = new ExperiencesRepository();
const service = new ExperiencesService(repository);

router.get("/", async (c) => {
  const data = await service.findAll();
  return c.json({ data });
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.findById(id);
  return c.json({ data });
});

router.post("/", authMiddleware, zValidator("json", createExperienceDto), async (c) => {
  const userId = c.get("jwtPayload").sub;
  const body = c.req.valid("json");
  const data = await service.create(userId, body);
  return c.json({ data }, 201);
});

router.put("/:id", authMiddleware, zValidator("json", updateExperienceDto), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");
  const data = await service.update(id, body);
  return c.json({ data });
});

router.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const data = await service.delete(id);
  return c.json({ data });
});

export default router;
