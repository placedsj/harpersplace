
import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeText, sanitizeHtml, sanitizeUrl } from '../src/lib/input-sanitization';

test('sanitizeText - Server environment', async (t) => {
  await t.test('should strip HTML tags', () => {
    const input = '<p>Hello <b>World</b></p>';
    const output = sanitizeText(input);
    assert.strictEqual(output, 'Hello World');
  });

  await t.test('should decode basic entities', () => {
    const input = 'Hello &amp; &lt;World&gt;';
    const output = sanitizeText(input);
    assert.strictEqual(output, 'Hello & <World>');
  });

  await t.test('should handle empty input', () => {
    assert.strictEqual(sanitizeText(''), '');
  });
});

test('sanitizeHtml - Server environment', async (t) => {
  await t.test('should strip script tags', () => {
    const input = '<script>alert(1)</script>Hello';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, 'Hello');
  });
});

test('sanitizeUrl - Server environment', async (t) => {
  await t.test('should allow http/https', () => {
    assert.strictEqual(sanitizeUrl('https://example.com'), 'https://example.com');
  });

  await t.test('should block javascript:', () => {
    assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
  });
});
