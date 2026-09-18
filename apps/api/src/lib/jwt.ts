import { sign } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export { JWT_SECRET };

export async function generateToken(payload: {
  sub: string;
  email: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return sign(
    {
      ...payload,
      iat: now,
      exp: now + 60 * 60 * 24, // 24 hours
    },
    JWT_SECRET,
    "HS256"
  );
}
