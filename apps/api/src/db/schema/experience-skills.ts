import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { experiences } from "./experiences";
import { skills } from "./skills";

export const experienceSkills = pgTable(
  "experience_skills",
  {
    experienceId: uuid("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.experienceId, table.skillId] })]
);
