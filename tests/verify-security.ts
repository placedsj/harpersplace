import { setupSecurity } from '../server/security';
import { type Request, type Response, type NextFunction } from 'express';

// Mock Express app
const appMock = {
  use: (middleware: any) => {
    middlewares.push(middleware);
  }
} as any;

const middlewares: any[] = [];

// Helper to simulate request
function simulateRequest(req: any, res: any) {
  let idx = 0;
  const next = (err?: any) => {
    if (err) {
      // console.error("Middleware error:", err);
      // For testing, we might expect errors (CORS)
      return;
    }
    if (idx < middlewares.length) {
      const mw = middlewares[idx++];
      mw(req, res, next);
    }
  };
  next();
}

console.log("Running security verification...");

// Setup security
setupSecurity(appMock);

if (middlewares.length < 2) {
  throw new Error("Expected at least 2 middlewares (CORS and Headers)");
}

console.log("Middlewares registered:", middlewares.length);

// Test 1: Verify Security Headers
const reqMock = {} as Request;
const headers: Record<string, string> = {};
const resMock = {
  setHeader: (key: string, value: string) => {
    headers[key] = value;
  }
} as any as Response;

// Run all middlewares (this might fail if CORS blocks the mock request with no origin, let's see)
// My CORS logic: if (!origin) return callback(null, true); -> allows no-origin requests.
simulateRequest(reqMock, resMock);

const expectedHeaders = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

let headersOk = true;
for (const [key, value] of Object.entries(expectedHeaders)) {
  if (headers[key] !== value) {
    console.error(`Missing or incorrect header: ${key}. Expected ${value}, got ${headers[key]}`);
    headersOk = false;
  }
}

if (!headersOk) {
  throw new Error("Security headers verification failed");
}

console.log("✅ Security Headers verified.");

// Test 2: Verify CORS logic in Production
const originalEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'production';
process.env.REPLIT_DOMAINS = 'example.com';

// Re-setup security for production test
middlewares.length = 0;
setupSecurity(appMock);
const prodCorsMiddleware = middlewares[0]; // Assuming first is CORS

// Test with invalid origin
const invalidCorsReq = {
  headers: {
    origin: 'https://evil.com'
  },
  method: 'GET'
} as any;

let corsError: any = null;
const nextCorsInvalid = (err?: any) => {
  if (err) corsError = err;
};

// cors middleware signature: (req, res, next)
prodCorsMiddleware(invalidCorsReq, resMock, nextCorsInvalid);

if (!corsError) {
  throw new Error("CORS did not block invalid origin in production.");
} else {
  console.log("✅ CORS correctly blocked invalid origin in production.");
}

// Test with valid origin
const validCorsReq = {
  headers: {
    origin: 'https://example.com'
  },
  method: 'GET'
} as any;

let validCorsError: any = null;
const nextCorsValid = (err?: any) => {
  if (err) validCorsError = err;
};

prodCorsMiddleware(validCorsReq, resMock, nextCorsValid);

if (validCorsError) {
  throw new Error(`CORS blocked valid origin: ${validCorsError}`);
} else {
  console.log("✅ CORS allowed valid origin.");
}

// Restore env
process.env.NODE_ENV = originalEnv;
