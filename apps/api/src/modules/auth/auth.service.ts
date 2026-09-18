import { HTTPException } from "hono/http-exception";
import { generateToken } from "../../lib/jwt";
import { AuthRepository } from "./auth.repository";
import { LoginDto, RegisterDto } from "./auth.dto";

export class AuthService {
  constructor(private repository: AuthRepository) {}

  async register(data: RegisterDto) {
    const hashedPassword = await Bun.password.hash(data.password);
    const newUser = await this.repository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: LoginDto) {
    const user = await this.repository.findUserByEmail(data.email);

    if (!user) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }

    const isValid = await Bun.password.verify(data.password, user.password);
    if (!isValid) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }

    const token = await generateToken({ sub: user.id, email: user.email });

    return {
      token,
      tokenType: "Bearer",
    };
  }

  async getMe(id: string) {
    const user = await this.repository.findUserById(id);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
