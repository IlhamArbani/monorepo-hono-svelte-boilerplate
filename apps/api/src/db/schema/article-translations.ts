import {
  pgTable,
  uuid,
  varchar,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { articles } from "./articles";

export const articleTranslations = pgTable(
  "article_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content").notNull(),
  },
  (t) => [unique().on(t.articleId, t.locale)]
);
