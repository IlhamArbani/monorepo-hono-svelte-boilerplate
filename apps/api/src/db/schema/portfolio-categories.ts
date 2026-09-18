import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios";
import { categories } from "./categories";

export const portfolioCategories = pgTable(
  "portfolio_categories",
  {
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.portfolioId, table.categoryId] })]
);
