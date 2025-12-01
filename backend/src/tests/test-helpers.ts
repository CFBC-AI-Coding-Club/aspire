import { app } from '../index';
import db from '../services/db';
import { Role } from '../db/generated/enums';
import { getSessionTokenFromCookie, setUserRole } from '../utils/auth-helpers';

/**
 * Helper to register a user via better-auth and set their role
 */
export async function registerUser(email: string, password: string, name: string, role: Role = Role.PARENT) {
  // Register via better-auth - uses /sign-up/email endpoint
  const registerRes = await app.request(new Request('http://localhost/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  }));

  if (registerRes.status !== 200) {
    const error = await registerRes.json();
    throw new Error(`Registration failed: ${JSON.stringify(error)}`);
  }

  const registerData = await registerRes.json() as any;
  const userId = registerData.user?.id;

  if (!userId) {
    throw new Error('User ID not found in registration response');
  }

  // Set the role
  await setUserRole(userId, role);

  // Login to get session token - uses /sign-in/email endpoint
  const loginRes = await app.request(new Request('http://localhost/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }));

  if (loginRes.status !== 200) {
    throw new Error('Login failed after registration');
  }

  const setCookie = loginRes.headers.get('set-cookie');
  const sessionToken = getSessionTokenFromCookie(setCookie);

  if (!sessionToken) {
    throw new Error('Session token not found in cookies');
  }

  return {
    userId,
    sessionToken,
    cookies: `better-auth.session_token=${sessionToken}`,
  };
}

/**
 * Helper to login a user and get session token
 */
export async function loginUser(email: string, password: string) {
  const loginRes = await app.request(new Request('http://localhost/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }));

  if (loginRes.status !== 200) {
    const error = await loginRes.json();
    throw new Error(`Login failed: ${JSON.stringify(error)}`);
  }

  const setCookie = loginRes.headers.get('set-cookie');
  const sessionToken = getSessionTokenFromCookie(setCookie);

  if (!sessionToken) {
    throw new Error('Session token not found in cookies');
  }

  // Get user ID from session
  const session = await loginRes.json() as any;
  const userId = session.user?.id;

  return {
    userId: userId || '',
    sessionToken,
    cookies: `better-auth.session_token=${sessionToken}`,
  };
}

/**
 * Helper to make authenticated requests with cookies
 */
export function authenticatedRequest(url: string, options: RequestInit & { cookies?: string } = {}) {
  const { cookies, ...restOptions } = options;
  return new Request(url, {
    ...restOptions,
    headers: {
      ...restOptions.headers,
      Cookie: cookies || '',
    },
  });
}

