import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { factory } from "./lib/factory";

import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import rolesRoutes from "./modules/roles/roles.routes";
import articlesRoutes from "./modules/articles/articles.routes";
import portfoliosRoutes from "./modules/portfolios/portfolios.routes";
import experiencesRoutes from "./modules/experiences/experiences.routes";
import categoriesRoutes from "./modules/master-data/categories.routes";
import skillsRoutes from "./modules/master-data/skills.routes";
import permissionsRoutes from "./modules/master-data/permissions.routes";

const app = factory.createApp();

// --- Global Middleware ---
app.use("*", logger());
app.use("*", cors());

// --- Global Error Handler ---
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// --- Health Check ---
app.get("/health", (c) => c.json({ status: "ok" }));

// --- API Routes ---
const api = factory.createApp();

api.route("/auth", authRoutes);
api.route("/users", usersRoutes);
api.route("/roles", rolesRoutes);
api.route("/articles", articlesRoutes);
api.route("/portfolios", portfoliosRoutes);
api.route("/experiences", experiencesRoutes);
api.route("/categories", categoriesRoutes);
api.route("/skills", skillsRoutes);
api.route("/permissions", permissionsRoutes);

app.route("/api", api);

export default app;
