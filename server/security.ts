
/**
 * Creates a CORS origin check function.
 * @param allowedDomains Array of allowed domains (e.g. ['example.com', 'localhost:3000'])
 * @returns A function compatible with the 'cors' middleware origin option.
 */
export const createCorsOriginCheck = (allowedDomains: string[]) => {
  // Pre-calculate allowed origins to avoid overhead on every request
  const allowedOrigins = allowedDomains.map((d) => {
    // Strip trailing slashes
    const normalized = d.trim().replace(/\/$/, "");

    // Handle localhost or IP addresses, assume http unless specified
    if (normalized.includes("localhost") || normalized.includes("127.0.0.1")) {
      return normalized.startsWith("http") ? normalized : `http://${normalized}`;
    }
    // Assume https for other domains unless specified
    return normalized.startsWith("http") ? normalized : `https://${normalized}`;
  });

  return (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin non-browser requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  };
};
