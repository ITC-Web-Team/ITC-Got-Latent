import { cookies } from "next/headers";
import { sessionCookieName, verifySessionToken, type SessionPayload } from "@/lib/session";

/**
 * Reads and verifies the session cookie for the current request.
 * Returns null when there is no session or it's invalid/expired —
 * callers decide whether that means "show login" or "redirect".
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
