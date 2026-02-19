import { test } from 'node:test';
import assert from 'node:assert';
import { createCorsOriginCheck } from '../server/security';

test('CORS: production with allowed domains', async () => {
  const domains = 'example.com,test.com';
  const corsCheck = createCorsOriginCheck(domains, 'production');

  // Should allow listed domains
  corsCheck('https://example.com', (err, allow) => {
    assert.strictEqual(err, null);
    assert.strictEqual(allow, true);
  });

  corsCheck('https://test.com', (err, allow) => {
    assert.strictEqual(err, null);
    assert.strictEqual(allow, true);
  });

  // Should block unlisted domains
  corsCheck('https://evil.com', (err, allow) => {
    assert.ok(err instanceof Error);
    assert.strictEqual(err.message, 'Not allowed by CORS');
  });

  // Should allow no origin (same-origin)
  corsCheck(undefined, (err, allow) => {
    assert.strictEqual(err, null);
    assert.strictEqual(allow, true);
  });

  // Should block localhost in production
  corsCheck('http://localhost:3000', (err, allow) => {
    assert.ok(err instanceof Error);
    assert.strictEqual(err.message, 'Not allowed by CORS');
  });
});

test('CORS: development allowances', async () => {
  const domains = 'example.com';
  const corsCheck = createCorsOriginCheck(domains, 'development');

  // Should allow localhost with strict matching
  corsCheck('http://localhost:3000', (err, allow) => {
    assert.strictEqual(err, null, 'Should allow localhost:3000');
  });

  corsCheck('http://127.0.0.1:8080', (err, allow) => {
    assert.strictEqual(err, null, 'Should allow 127.0.0.1:8080');
  });

  corsCheck('http://localhost', (err, allow) => {
    assert.strictEqual(err, null, 'Should allow localhost');
  });

  // Should block invalid localhost
  corsCheck('http://localhost.evil.com', (err, allow) => {
    assert.ok(err instanceof Error, 'Should block localhost.evil.com');
  });

  corsCheck('http://127.0.0.1.evil.com', (err, allow) => {
    assert.ok(err instanceof Error, 'Should block 127.0.0.1.evil.com');
  });

  // Should still allow listed domains
  corsCheck('https://example.com', (err, allow) => {
    assert.strictEqual(err, null);
  });
});

test('CORS: missing domains configuration', async () => {
  const corsCheck = createCorsOriginCheck(undefined, 'production');

  // Should default to secure behavior (block external)
  corsCheck('https://any.com', (err, allow) => {
    assert.ok(err instanceof Error);
  });
});
