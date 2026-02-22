import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeText } from '../src/lib/input-sanitization';

test('sanitizeText should be SSR safe', () => {
  const input = '<p>Hello</p>';
  // This should throw 'document is not defined' if the function uses document directly
  try {
      const output = sanitizeText(input);
      assert.strictEqual(output, 'Hello');
  } catch (error: any) {
      if (error.message.includes('document is not defined')) {
          assert.fail('sanitizeText failed: document is not defined (SSR unsafe)');
      }
      throw error;
  }
});
