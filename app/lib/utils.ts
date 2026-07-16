import { clsx, type ClassValue } from "clsx";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Custom Error Classes
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

// Authentication Extraction Helper
export function getAuthenticatedUser(request: NextRequest): { userId: string; role: Role } | null {
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
      const decoded = jwt.decode(token) as any;
      if (decoded && typeof decoded === "object") {
        const userId = decoded.userId || decoded.id || decoded.sub;
        if (userId) {
          return {
            userId,
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
    request.cookies.get("next-auth.session-token")?.value;
  if (tokenCookie) {
    try {
      const decoded = jwt.decode(tokenCookie) as any;
      if (decoded && typeof decoded === "object") {
        const userId = decoded.userId || decoded.id || decoded.sub;
        if (userId) {
          return {
            userId,
            role: (decoded.role as Role) || Role.MEMBER,
          };
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  return null;
}

