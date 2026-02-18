
import { createCorsOriginCheck } from '../server/security';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('CORS Origin Check', () => {
  it('allows requests with no origin', () => {
    const originCheck = createCorsOriginCheck({});
    originCheck(undefined, (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
  });

  it('allows localhost in development', () => {
    const originCheck = createCorsOriginCheck({ NODE_ENV: 'development' });
    originCheck('http://localhost:3000', (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
    originCheck('http://127.0.0.1:5000', (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
  });

  it('blocks localhost in production', () => {
    const originCheck = createCorsOriginCheck({ NODE_ENV: 'production' });
    originCheck('http://localhost:3000', (err, allow) => {
      assert.ok(err instanceof Error);
    });
  });

  it('allows REPLIT_DOMAINS', () => {
    const originCheck = createCorsOriginCheck({ REPLIT_DOMAINS: 'test.replit.app,foo.replit.app' });
    originCheck('https://test.replit.app', (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
    originCheck('https://foo.replit.app', (err, allow) => {
      assert.strictEqual(err, null);
      assert.strictEqual(allow, true);
    });
  });

  it('blocks unknown origins', () => {
    const originCheck = createCorsOriginCheck({ REPLIT_DOMAINS: 'test.replit.app' });
    originCheck('https://evil.com', (err, allow) => {
      assert.ok(err instanceof Error);
    });
  });
});
