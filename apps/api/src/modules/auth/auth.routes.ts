import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../../middleware/auth";
import { registerDto, loginDto } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { factory } from "../../lib/factory";

const router = factory.createApp();
const repository = new AuthRepository();
const service = new AuthService(repository);

router.post("/register", zValidator("json", registerDto), async (c) => {
  const data = c.req.valid("json");
  const user = await service.register(data);
  return c.json({ data: user }, 201);
});

router.post("/login", zValidator("json", loginDto), async (c) => {
  const data = c.req.valid("json");
  const tokenData = await service.login(data);
  return c.json({ data: tokenData });
});

router.get("/me", authMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const sub = payload.sub;
  const user = await service.getMe(sub);
  return c.json({ data: user });
});

export default router;
