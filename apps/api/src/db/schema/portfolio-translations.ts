import {
  pgTable,
  uuid,
  varchar,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios";

export const portfolioTranslations = pgTable(
  "portfolio_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content").notNull(),
  },
  (t) => [unique().on(t.portfolioId, t.locale)]
);
