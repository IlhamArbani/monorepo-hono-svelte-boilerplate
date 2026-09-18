import { HTTPException } from "hono/http-exception";
import { RolesRepository } from "./roles.repository";

export class RolesService {
  constructor(private repository: RolesRepository) {}

  async getAllRoles() {
    return await this.repository.findAllRoles();
  }

  async getRoleById(id: string) {
    const role = await this.repository.findRoleById(id);
    if (!role) {
      throw new HTTPException(404, { message: "Role not found" });
    }
    return role;
  }

  async createRole(data: any) {
    return await this.repository.createRole(data);
  }

  async updateRole(id: string, data: any) {
    const updatedRole = await this.repository.updateRole(id, data);
    if (!updatedRole) {
      throw new HTTPException(404, { message: "Role not found" });
    }
    return updatedRole;
  }

  async deleteRole(id: string) {
    const deletedRole = await this.repository.deleteRole(id);
    if (!deletedRole) {
      throw new HTTPException(404, { message: "Role not found" });
    }
    return deletedRole;
  }

  async assignPermissions(id: string, permissionIds: string[]) {
    if (permissionIds && permissionIds.length > 0) {
      await this.repository.assignPermissions(id, permissionIds);
    }
    return { message: "Permissions assigned" };
  }

  async removePermissions(id: string, permissionIds: string[]) {
    if (permissionIds && permissionIds.length > 0) {
      await this.repository.removePermissions(id, permissionIds);
    }
    return { message: "Permissions removed" };
  }
}
