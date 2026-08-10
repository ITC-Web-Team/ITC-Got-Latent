import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  rollNo: string;
  name: string;
  branch: string | null;
  isVerified: boolean;
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set to a random string of at least 32 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

export function sessionCookieName() {
  return "itc_session";
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
