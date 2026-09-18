import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const locationTypeEnum = pgEnum("location_type", [
  "onsite",
  "remote",
  "hybrid",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
]);

export const experiences = pgTable("experiences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }).notNull(),
  highlights: text("highlights"),
  location: varchar("location", { length: 255 }),
  locationType: locationTypeEnum("location_type").notNull().default("onsite"),
  employmentType: employmentTypeEnum("employment_type")
    .notNull()
    .default("full_time"),
  startMonth: integer("start_month").notNull(),
  startYear: integer("start_year").notNull(),
  endMonth: integer("end_month"),
  endYear: integer("end_year"),
  isCurrentlyWork: boolean("is_currently_work").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
