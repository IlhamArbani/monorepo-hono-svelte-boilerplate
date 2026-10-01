import { authMiddleware } from "../../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { createPortfolioDto, updatePortfolioDto } from "./portfolios.dto";
import { PortfoliosRepository } from "./portfolios.repository";
import { PortfoliosService } from "./portfolios.service";
import { factory } from "../../lib/factory";

const router = factory.createApp();
const repository = new PortfoliosRepository();
const service = new PortfoliosService(repository);

router.get("/", async (c) => {
  const locale = c.req.query("locale");
  const order = c.req.query("order");
  const data = await service.findAll(locale, order);
  return c.json({ data });
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const locale = c.req.query("locale");
  const data = await service.findById(id, locale);
  return c.json({ data });
});

router.post("/", authMiddleware, zValidator("json", createPortfolioDto), async (c) => {
  const payload = c.get("jwtPayload");
  const authorId = payload.sub;
  const body = c.req.valid("json");
  
  const data = await service.create(authorId, body);
  return c.json({ data }, 201);
});

router.put("/:id", authMiddleware, zValidator("json", updatePortfolioDto), async (c) => {
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
