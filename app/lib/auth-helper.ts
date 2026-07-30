import { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";
import { Role } from "../generated/prisma";
import { measureSpan } from "./perf-logger";

export async function getAuthenticatedUser(request: NextRequest): Promise<{ userId: string; role: Role } | null> {
  return measureSpan("AUTH", "getAuthenticatedUser", async () => {
    // 1. Check for x-user-id and x-user-role headers
    const xUserId = request.headers.get("x-user-id");
    const xUserRole = request.headers.get("x-user-role");
    if (xUserId) {
      return {
        userId: xUserId,
        role: (xUserRole as Role) || Role.MEMBER,
      };
    }

    // 2. Check for Authorization: Bearer token
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || "secret";
        const decoded = await decode({ token, secret });
        if (decoded && typeof decoded === "object") {
          const userId = decoded.userId || decoded.id || decoded.sub;
          if (userId) {
            return {
              userId: userId as string,
              role: (decoded.role as Role) || Role.MEMBER,
            };
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    // 3. Check for cookies
    const tokenCookie =
      request.cookies.get("token")?.value ||
      request.cookies.get("session")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;
    if (tokenCookie) {
      try {
        const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || "secret";
        const decoded = await decode({ token: tokenCookie, secret });
        if (decoded && typeof decoded === "object") {
          const userId = decoded.userId || decoded.id || decoded.sub;
          if (userId) {
            return {
              userId: userId as string,
              role: (decoded.role as Role) || Role.MEMBER,
            };
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    return null;
  });
}

