import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createCorsOriginCheck } from '../server/security';

describe('CORS Logic', () => {
  // Mock environment variables for testing
  process.env.REPLIT_DOMAINS = 'example.com,app.replit.dev';
  process.env.NODE_ENV = 'production';

  it('allows matching REPLIT_DOMAINS', (t, done) => {
    createCorsOriginCheck('https://example.com', (err, allowed) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allowed, true);
      done();
    });
  });

  it('allows other matching REPLIT_DOMAINS', (t, done) => {
    createCorsOriginCheck('https://app.replit.dev', (err, allowed) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allowed, true);
      done();
    });
  });

  it('rejects disallowed origins', (t, done) => {
    createCorsOriginCheck('https://evil.com', (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Not allowed by CORS');
      done();
    });
  });

  it('allows requests with no origin', (t, done) => {
    createCorsOriginCheck(undefined, (err, allowed) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allowed, true);
      done();
    });
  });

  it('rejects localhost in production', (t, done) => {
    createCorsOriginCheck('http://localhost:3000', (err) => {
      assert.ok(err instanceof Error);
      done();
    });
  });

  it('allows localhost in development', (t, done) => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    createCorsOriginCheck('http://localhost:3000', (err, allowed) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allowed, true);

      // Reset environment
      process.env.NODE_ENV = originalEnv;
      done();
    });
  });
});
