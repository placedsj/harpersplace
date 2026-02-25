import assert from 'node:assert';
import { test } from 'node:test';
import { sanitizeText, sanitizeUrl, sanitizeHtml } from '../src/lib/input-sanitization';

test('sanitizeText should work in Node.js environment and decode entities', async (t) => {
  const input = '<p>Test &amp; <b>Bold</b></p>';
  const expected = 'Test & Bold';

  // This call should NOT throw "document is not defined" and should correctly decode entities
  const output = sanitizeText(input);

  assert.strictEqual(output, expected);
});

test('sanitizeUrl should remove dangerous protocols', async (t) => {
  assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='), '');
  assert.strictEqual(sanitizeUrl('https://example.com'), 'https://example.com');
  assert.strictEqual(sanitizeUrl('/relative/path'), '/relative/path');
});

test('sanitizeHtml should remove script tags', async (t) => {
  const input = '<script>alert(1)</script><p>Safe</p>';
  const output = sanitizeHtml(input);

  assert.strictEqual(output.includes('<script>'), false);
  assert.strictEqual(output.includes('alert(1)'), false);
  assert.strictEqual(output.includes('<p>Safe</p>'), true);
});
