
import { createCorsOriginCheck } from '../server/security';
import { strict as assert } from 'assert';

const allowedDomains = ['example.com', 'localhost:3000', 'https://api.test.com', 'slash.com/'];
// Note: createCorsOriginCheck adds https:// unless http is specified for localhost/IPs
const checkFunction = createCorsOriginCheck(allowedDomains);

// Helper to wrap the callback-based check function
const testCheck = (origin: string | undefined): Promise<boolean | Error> => {
    return new Promise((resolve) => {
        checkFunction(origin, (err, allow) => {
            if (err) resolve(err);
            else resolve(allow || false);
        });
    });
};

const runTests = async () => {
    try {
        console.log('Running CORS logic verification...');

        // 1. Test undefined origin (same-origin usually) - SHOULD ALLOW
        const res1 = await testCheck(undefined);
        assert.equal(res1, true, 'Should allow undefined origin');
        console.log('✅ Undefined origin allowed');

        // 2. Test exact match (https://example.com) - SHOULD ALLOW
        const res2 = await testCheck('https://example.com');
        assert.equal(res2, true, 'Should allow https://example.com');
        console.log('✅ https://example.com allowed');

        // 3. Test exact match (http://localhost:3000) - SHOULD ALLOW
        const res3 = await testCheck('http://localhost:3000');
        assert.equal(res3, true, 'Should allow http://localhost:3000');
        console.log('✅ http://localhost:3000 allowed');

        // 4. Test exact match (https://api.test.com) - SHOULD ALLOW
        const res4 = await testCheck('https://api.test.com');
        assert.equal(res4, true, 'Should allow https://api.test.com');
        console.log('✅ https://api.test.com allowed');

        // 4b. Test trailing slash handling (slash.com/) -> https://slash.com
        const resSlash = await testCheck('https://slash.com');
        assert.equal(resSlash, true, 'Should strip trailing slash from config');
        console.log('✅ Trailing slash in config handled');

        // 5. Test mismatch (https://evil.com) - SHOULD ERROR
        const res5 = await testCheck('https://evil.com');
        assert(res5 instanceof Error, 'Should error for evil.com');
        assert.equal((res5 as Error).message, 'Not allowed by CORS');
        console.log('✅ https://evil.com blocked');

        // 6. Test mismatch (http://example.com - wrong protocol) - SHOULD ERROR
        const res6 = await testCheck('http://example.com');
        assert(res6 instanceof Error, 'Should error for http://example.com');
        console.log('✅ http://example.com blocked (protocol mismatch)');

        // 7. Test mismatch (https://sub.example.com - subdomain not allowed unless explicit) - SHOULD ERROR
        const res7 = await testCheck('https://sub.example.com');
        assert(res7 instanceof Error, 'Should error for sub.example.com');
        console.log('✅ https://sub.example.com blocked');

        console.log('✅ All CORS tests passed!');
    } catch (error) {
        console.error('❌ CORS tests failed:', error);
        process.exit(1);
    }
};

runTests();
