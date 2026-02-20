import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createCorsOriginCheck } from '../server/security';

describe('CORS Origin Check', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset env before each test
    process.env = { ...originalEnv };
  });

  after(() => {
    // Restore env after all tests
    process.env = originalEnv;
  });

  test('allows exact match from REPLIT_DOMAINS', (t) => {
    const domains = 'example.com,myapp.replit.app';
    const check = createCorsOriginCheck(domains);

    const checkFn = check as (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void;

    checkFn('https://example.com', (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });

    checkFn('https://myapp.replit.app', (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
  });

  test('blocks non-matching domains', (t) => {
    const domains = 'example.com';
    const check = createCorsOriginCheck(domains) as Function;

    check('https://evil.com', (err: Error | null, allow?: boolean) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Not allowed by CORS');
    });
  });

  test('allows localhost in development', (t) => {
    const domains = 'example.com';
    (process.env as any).NODE_ENV = 'development';
    const check = createCorsOriginCheck(domains) as Function;

    check('http://localhost:3000', (err: Error | null, allow?: boolean) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });

    check('http://127.0.0.1:8080', (err: Error | null, allow?: boolean) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
  });

  test('blocks localhost in production', (t) => {
    const domains = 'example.com';
    (process.env as any).NODE_ENV = 'production';
    const check = createCorsOriginCheck(domains) as Function;

    check('http://localhost:3000', (err: Error | null, allow?: boolean) => {
       assert.ok(err instanceof Error);
    });
  });

  test('allows requests with no origin (same-origin)', (t) => {
    const domains = 'example.com';
    const check = createCorsOriginCheck(domains) as Function;

    check(undefined, (err: Error | null, allow?: boolean) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
  });

  test('blocks everything external if REPLIT_DOMAINS is missing', (t) => {
    const check = createCorsOriginCheck(undefined) as Function;

    check('https://example.com', (err: Error | null, allow?: boolean) => {
       assert.ok(err instanceof Error);
    });

    // Still allows no origin
    check(undefined, (err: Error | null, allow?: boolean) => {
       assert.strictEqual(err, null);
       assert.strictEqual(allow, true);
    });
  });
});
