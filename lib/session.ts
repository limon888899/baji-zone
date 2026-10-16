import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== 'production') return 'local-development-only-session-secret-change-me';
  throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters.');
}

export function createSessionToken(userId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${userId}.${expiresAt}`;
  const signature = createHmac('sha256', sessionSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function readSessionToken(token: string | undefined): string | null {
  if (!token || token.length > 512) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expiresText, signature] = parts;
  if (!userId || !/^[A-Za-z0-9_-]{1,128}$/.test(userId) || !/^\d+$/.test(expiresText) || !/^[a-f0-9]{64}$/.test(signature)) return null;
  if (Number(expiresText) <= Math.floor(Date.now() / 1000)) return null;
  try {
    const payload = `${userId}.${expiresText}`;
    const expected = createHmac('sha256', sessionSecret()).update(payload).digest('hex');
    const actualBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer) ? userId : null;
  } catch {
    return null;
  }
}

export { SESSION_TTL_SECONDS };
