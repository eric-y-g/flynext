import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

// Custom type for your payload
export interface UserPayload {
  userId: string;
  email: string;
}

// Type guards to ensure presence of env vars
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing required environment variables: ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET"
  );
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRATION = "1d";

// --- Verify Access Token ---
export function verifyToken(request: NextRequest): UserPayload | null {
  try {
    const authorizationHeader = request.headers.get("Authorization");
    if (!authorizationHeader) {
      return null;
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (
      typeof decoded === "object" &&
      "userId" in decoded &&
      "email" in decoded
    ) {
      return decoded as UserPayload;
    }

    return null;
  } catch {
    return null;
  }
}

// --- Verify Refresh Token ---
export function verifyRefreshToken(
  refreshToken: string
): UserPayload | null {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    if (
      typeof decoded === "object" &&
      "userId" in decoded &&
      "email" in decoded
    ) {
      return decoded as UserPayload;
    }
    return null;
  } catch {
    return null;
  }
}

// --- Generate Access Token ---
export function generateAccessToken(userPayload: UserPayload): string {
  return jwt.sign(userPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
}
