import { securityHeaders } from '../server/security';
import assert from 'assert';

console.log("Testing securityHeaders middleware...");

const req = {} as any;
const headers: Record<string, string> = {};
const res = {
  headers: headers,
  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }
} as any;

let nextCalled = false;
const next = () => {
  nextCalled = true;
};

securityHeaders(req, res, next);

// Verify headers
assert.strictEqual(res.headers['Strict-Transport-Security'], 'max-age=63072000; includeSubDomains; preload', 'Strict-Transport-Security mismatch');
assert.strictEqual(res.headers['X-Frame-Options'], 'SAMEORIGIN', 'X-Frame-Options mismatch');
assert.strictEqual(res.headers['X-Content-Type-Options'], 'nosniff', 'X-Content-Type-Options mismatch');
assert.strictEqual(res.headers['X-XSS-Protection'], '1; mode=block', 'X-XSS-Protection mismatch');
assert.strictEqual(res.headers['Referrer-Policy'], 'strict-origin-when-cross-origin', 'Referrer-Policy mismatch');

// Verify next() called
assert.strictEqual(nextCalled, true, 'next() not called');

console.log("✅ Security headers test passed!");
