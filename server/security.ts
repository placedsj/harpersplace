export function createCorsOriginCheck(domainsStr: string | undefined, nodeEnv: string | undefined = 'development') {
  if (!domainsStr) {
    // Log a warning if no domains are configured
    console.warn("REPLIT_DOMAINS is not defined. CORS will block external requests.");
  }

  const allowedOrigins = domainsStr ? domainsStr.split(',').map(d => `https://${d.trim()}`) : [];

  return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Dev environment allowances
    if (nodeEnv !== 'production') {
      // Allow localhost with strict matching
      // Matches http://localhost, http://localhost:3000, http://127.0.0.1, http://127.0.0.1:8080
      const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/;
      if (localhostRegex.test(origin)) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'));
  };
}
