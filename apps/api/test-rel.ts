import { defineRelations } from "drizzle-orm";
import * as schema from "./src/db/schema";
const rel = defineRelations(schema, (r) => ({
  userRoles: {
    user: r.one.users({
      from: r.userRoles.userId,
      to: r.users.id,
    }),
  },
}));
