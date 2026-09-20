import {
  pgTable,
  uuid,
  varchar,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { experiences } from "./experiences";

export const experienceTranslations = pgTable(
  "experience_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experienceId: uuid("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    jobTitle: varchar("job_title", { length: 255 }).notNull(),
    highlights: text("highlights"),
  },
  (t) => [unique().on(t.experienceId, t.locale)]
);
