
import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeText } from '../src/lib/input-sanitization';

test('sanitizeText should strip HTML tags', () => {
  const input = '<h1>Hello</h1> <script>alert(1)</script>World';
  const expected = 'Hello alert(1)World';
  const actual = sanitizeText(input);
  // Normalize spaces for comparison as strip implementation might leave spaces
  assert.strictEqual(actual.replace(/\s+/g, ' ').trim(), expected.replace(/\s+/g, ' ').trim());
});

test('sanitizeText should decode HTML entities', () => {
  const input = 'Tom &amp; Jerry';
  const expected = 'Tom & Jerry';
  const actual = sanitizeText(input);
  assert.strictEqual(actual, expected);
});

test('sanitizeText should handle mixed content', () => {
  const input = '<p>User &lt;b&gt;Input&lt;/b&gt;</p>';
  // Strip tags: "User &lt;b&gt;Input&lt;/b&gt;"
  // Decode: "User <b>Input</b>"
  const expected = 'User <b>Input</b>';
  const actual = sanitizeText(input);
  assert.strictEqual(actual, expected);
});

test('sanitizeText should handle empty input', () => {
  assert.strictEqual(sanitizeText(''), '');
});

test('sanitizeText should not throw in Node environment', () => {
  assert.doesNotThrow(() => sanitizeText('<test>'));
});
