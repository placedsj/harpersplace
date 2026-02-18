
/**
 * Creates a CORS origin check function that validates incoming requests.
 * Relying on REPLIT_DOMAINS for production allowed origins.
 */
export const createCorsOriginCheck = (env: NodeJS.ProcessEnv) => {
  const allowedOrigins = (env.REPLIT_DOMAINS || "")
    .split(",")
    .map(d => d.trim())
    .filter(d => d.length > 0)
    .map(d => `https://${d}`);

  return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // allow localhost in development
    if (env.NODE_ENV !== "production") {
       if (origin.match(/^https?:\/\/localhost(:\d+)?$/) || origin.match(/^https?:\/\/127\.0\.0\.1(:\d+)?$/)) {
         return callback(null, true);
       }
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  };
};
