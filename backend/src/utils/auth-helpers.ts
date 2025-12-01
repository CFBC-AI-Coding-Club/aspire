import db from "../services/db";
import { Role } from "../db/generated/enums";

/**
 * Sets the role for a user after better-auth registration
 * This is needed because better-auth doesn't know about our custom role field
 */
export async function setUserRole(userId: string, role: Role) {
  return await db.user.update({
    where: { id: userId },
    data: { role },
  });
}

/**
 * Gets session token from Set-Cookie header
 */
export function getSessionTokenFromCookie(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(/better-auth\.session_token=([^;]+)/);
  return match ? match[1] : null;
}

