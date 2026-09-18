import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../../middleware/auth";
import { createSkillDto, updateSkillDto } from "./skills.dto";
import { SkillsRepository } from "./skills.repository";
import { SkillsService } from "./skills.service";
import { factory } from "../../lib/factory";

const skillsRoutes = factory.createApp();
const repository = new SkillsRepository();
const service = new SkillsService(repository);

skillsRoutes.get("/", async (c) => {
  const data = await service.findAll();
  return c.json({ data });
});

skillsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await service.findById(id);
  return c.json({ data });
});

skillsRoutes.post("/", authMiddleware, zValidator("json", createSkillDto), async (c) => {
  const { name } = c.req.valid("json");
  const data = await service.create({ name });
  return c.json({ data }, 201);
});

skillsRoutes.put("/:id", authMiddleware, zValidator("json", updateSkillDto), async (c) => {
  const id = c.req.param("id");
  const { name } = c.req.valid("json");
  const data = await service.update(id, { name });
  return c.json({ data });
});

skillsRoutes.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const data = await service.delete(id);
  return c.json({ data });
});

export default skillsRoutes;
