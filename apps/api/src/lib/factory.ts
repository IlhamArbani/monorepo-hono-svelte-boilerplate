import { createFactory } from "hono/factory";
import type { JwtVariables } from "hono/jwt";

export type AppEnv = {
  Bindings: {};
  Variables: JwtVariables;
};

export const factory = createFactory<AppEnv>();
