export const STATIC_CREDENTIALS = {
  username: "admin",
  password: "Admin@123",
} as const;

export function verifyCredentials(username: string, password: string): boolean {
  return username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password;
}

export function createSession(): string {
  return "static-session-token-" + Date.now();
}

export function verifySession(token: string): boolean {
  return token.startsWith("static-session-token-");
}
