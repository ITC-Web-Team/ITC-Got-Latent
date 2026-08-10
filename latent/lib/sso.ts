const SSO_BASE_URL = "https://sso.tech-iitb.org";

export function getProjectId() {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT_ID env var is not set.");
  }
  return projectId;
}

export function ssoLoginUrl() {
  return `${SSO_BASE_URL}/project/${getProjectId()}/ssocall/`;
}

export interface SsoUser {
  name: string;
  roll: string;
  department: string;
  degree: string;
  passing_year: number;
}

/**
 * Exchanges the one-time `accessid` session key (received on the callback
 * redirect) for the authenticated user's profile, per section 7 of the ITC
 * SSO Integration Guide.
 */
export async function fetchSsoUser(sessionKey: string): Promise<SsoUser> {
  const res = await fetch(`${SSO_BASE_URL}/project/getuserdata`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: sessionKey }),
    cache: "no-store",
  });

  if (!res.ok) {
    // Per the guide: 400 = missing/invalid key, 403 = expired (1hr), 404 = invalid key/project
    throw new Error(`SSO getuserdata failed with status ${res.status}`);
  }

  return res.json();
}
