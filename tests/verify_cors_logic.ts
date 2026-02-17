
import { createCorsOriginCheck } from '../server/security';
import assert from 'assert';

console.log('Running CORS verification tests...');

// Mock REPLIT_DOMAINS
process.env.REPLIT_DOMAINS = 'example.com,app.replit.dev';
process.env.NODE_ENV = 'production'; // Test prod behavior first

// Test case 1: Allowed origin
createCorsOriginCheck('https://example.com', (err, allowed) => {
  assert.strictEqual(err, null, 'Should not error for allowed origin');
  assert.strictEqual(allowed, true, 'Should allow example.com');
  console.log('✅ Allowed origin (example.com) passed');
});

createCorsOriginCheck('https://app.replit.dev', (err, allowed) => {
  assert.strictEqual(err, null, 'Should not error for allowed origin');
  assert.strictEqual(allowed, true, 'Should allow app.replit.dev');
  console.log('✅ Allowed origin (app.replit.dev) passed');
});

// Test case 2: Disallowed origin
createCorsOriginCheck('https://evil.com', (err, allowed) => {
  assert.ok(err instanceof Error, 'Should error for disallowed origin');
  assert.strictEqual(err.message, 'Not allowed by CORS');
  console.log('✅ Disallowed origin (evil.com) rejected');
});

// Test case 3: No origin
createCorsOriginCheck(undefined, (err, allowed) => {
  assert.strictEqual(err, null, 'Should not error for no origin');
  assert.strictEqual(allowed, true, 'Should allow no origin');
  console.log('✅ No origin allowed');
});

// Test case 4: Localhost in production (should fail)
createCorsOriginCheck('http://localhost:3000', (err, allowed) => {
  assert.ok(err instanceof Error, 'Should error for localhost in production');
  console.log('✅ Localhost rejected in production');
});

// Test case 5: Localhost in development
process.env.NODE_ENV = 'development';
createCorsOriginCheck('http://localhost:3000', (err, allowed) => {
  assert.strictEqual(err, null, 'Should not error for localhost in dev');
  assert.strictEqual(allowed, true, 'Should allow localhost in dev');
  console.log('✅ Localhost allowed in development');
});

console.log('All tests passed!');
