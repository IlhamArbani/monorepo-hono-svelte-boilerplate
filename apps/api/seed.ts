import { db } from "./src/lib/db";
import { users } from "./src/db/schema/users";
import { roles } from "./src/db/schema/roles";
import { userRoles } from "./src/db/schema/user-roles";
import { eq, and } from "drizzle-orm";

async function main() {
  console.log("Seeding database...");

  // 1. Create super_admin role if not exists
  let superAdminRole = await db.query.roles.findFirst({
    where: { name: "super_admin" },
  });

  if (!superAdminRole) {
    console.log("Creating super_admin role...");
    const [newRole] = await db
      .insert(roles)
      .values({
        name: "super_admin",
        description: "Super Administrator with all permissions",
      })
      .returning();
    superAdminRole = newRole;
  } else {
    console.log("Role super_admin already exists.");
  }

  // 2. Create super admin user if not exists
  const adminEmail = "admin@example.com";
  let adminUser = await db.query.users.findFirst({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    console.log("Creating super admin user...");
    // Hash password using Bun's native password hasher (Argon2id)
    const hashedPassword = await Bun.password.hash("supersecret123");

    const [newUser] = await db
      .insert(users)
      .values({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
      })
      .returning();
    adminUser = newUser;
  } else {
    console.log("User admin@example.com already exists.");
  }

  // 3. Assign role to user
  const existingUserRole = await db.query.userRoles.findFirst({
    where: {
      userId: adminUser!.id,
      roleId: superAdminRole!.id
    },
  });

  if (!existingUserRole) {
    console.log("Assigning super_admin role to user...");
    await db.insert(userRoles).values({
      userId: adminUser.id,
      roleId: superAdminRole.id,
    });
  } else {
    console.log("Role already assigned to user.");
  }

  console.log("✅ Seeding completed!");
  console.log("\n--- Login Credentials ---");
  console.log(`Email: ${adminEmail}`);
  console.log("Password: supersecret123");
  console.log("-------------------------\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
