import { users } from "../../db/schema/users";
import { db } from "../../lib/db";

export class AuthRepository {
  async createUser(data: any) {
    const [newUser] = await db
      .insert(users)
      .values(data)
      .returning();
    return newUser;
  }

  async findUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.email, email),
    });
  }

  async findUserById(id: string) {
    return await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });
  }
}
