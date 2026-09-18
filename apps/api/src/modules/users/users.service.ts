import { HTTPException } from "hono/http-exception";
import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private repository: UsersRepository) {}

  async getAllUsers() {
    const allUsers = await this.repository.findAllUsers();

    return allUsers.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
  }

  async getUserById(id: string) {
    const user = await this.repository.findUserById(id);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const { password, ...rest } = user;
    return rest;
  }

  async updateUser(id: string, data: { name?: string; email?: string }) {
    const body: { name?: string; email?: string } = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.email !== undefined) body.email = data.email;

    const updatedUser = await this.repository.updateUser(id, body);

    if (!updatedUser) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const { password, ...rest } = updatedUser;
    return rest;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.repository.deleteUser(id);

    if (!deletedUser) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return { message: "User deleted" };
  }

  async assignRoles(id: string, roleIds: string[]) {
    if (roleIds && roleIds.length > 0) {
      await this.repository.assignRoles(id, roleIds);
    }
    return { message: "Roles assigned" };
  }

  async removeRoles(id: string, roleIds: string[]) {
    if (roleIds && roleIds.length > 0) {
      await this.repository.removeRoles(id, roleIds);
    }
    return { message: "Roles removed" };
  }
}
