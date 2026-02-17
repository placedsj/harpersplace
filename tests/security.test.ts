import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import { createCorsOriginCheck } from '../server/security';

const originalEnv = { ...process.env };

describe('CORS Security Check', () => {

    after(() => {
        process.env = originalEnv;
    });

  it('should allow whitelisted domains', (t, done) => {
    (process.env as any).REPLIT_DOMAINS = 'example.com,test.com';
    (process.env as any).NODE_ENV = 'production';
    const check = createCorsOriginCheck();

    check('https://example.com', (err: Error | null, allow?: boolean) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
      done();
    });
  });

  it('should block unknown domains', (t, done) => {
    (process.env as any).REPLIT_DOMAINS = 'example.com';
    (process.env as any).NODE_ENV = 'production';
    const check = createCorsOriginCheck();

    check('https://evil.com', (err: Error | null, allow?: boolean) => {
      assert.ok(err instanceof Error);
      done();
    });
  });

  it('should allow localhost in development', (t, done) => {
    (process.env as any).NODE_ENV = 'development';
    (process.env as any).REPLIT_DOMAINS = '';
    const check = createCorsOriginCheck();

    check('http://localhost:3000', (err: Error | null, allow?: boolean) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
      done();
    });
  });

   it('should block localhost in production', (t, done) => {
    (process.env as any).NODE_ENV = 'production';
    (process.env as any).REPLIT_DOMAINS = '';
    const check = createCorsOriginCheck();

    check('http://localhost:3000', (err: Error | null, allow?: boolean) => {
       assert.ok(err instanceof Error);
      done();
    });
  });

  it('should allow requests with no origin (same-origin)', (t, done) => {
    (process.env as any).NODE_ENV = 'production';
    const check = createCorsOriginCheck();

    check(undefined, (err: Error | null, allow?: boolean) => {
        assert.strictEqual(err, null);
        assert.strictEqual(allow, true);
        done();
    });
  });
});
