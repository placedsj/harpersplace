import type { CorsOptions } from "cors";

/**
 * Creates a CORS origin check function based on the REPLIT_DOMAINS environment variable.
 *
 * @param replitDomains - Comma-separated list of allowed domains (e.g., "app.replit.com,myapp.replit.app")
 * @returns A CORS origin validation function suitable for `cors` middleware.
 */
export function createCorsOriginCheck(
  replitDomains: string | undefined
): CorsOptions["origin"] {
  if (!replitDomains) {
    // If no domains are configured, block all cross-origin requests.
    // Allow same-origin (no Origin header) requests.
    return (requestOrigin, callback) => {
      if (!requestOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    };
  }

  const allowedOrigins = replitDomains.split(",").map((d) => `https://${d.trim()}`);

  return (requestOrigin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!requestOrigin) {
      return callback(null, true);
    }

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(requestOrigin)) {
      return callback(null, true);
    }

    // Allow localhost in development
    if (
      process.env.NODE_ENV !== "production" &&
      (requestOrigin.startsWith("http://localhost") ||
        requestOrigin.startsWith("http://127.0.0.1"))
    ) {
      return callback(null, true);
    }

    // Block everything else
    return callback(new Error("Not allowed by CORS"));
  };
}
