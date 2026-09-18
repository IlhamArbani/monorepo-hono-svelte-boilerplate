import { jwt } from "hono/jwt";
import { JWT_SECRET } from "../lib/jwt";

export const authMiddleware = jwt({
  secret: JWT_SECRET,
  alg: "HS256",
});
