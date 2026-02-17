
// Helper for CORS configuration
export const createCorsOriginCheck = (origin: string | undefined, callback: (err: Error | null, origin?: boolean | string) => void) => {
  const allowedOrigins: string[] = [];

  // Add REPLIT_DOMAINS if available
  if (process.env.REPLIT_DOMAINS) {
    process.env.REPLIT_DOMAINS.split(',').forEach(domain => {
      // Normalize domain just in case (though usually clean from env)
      const cleanDomain = domain.trim();
      if (cleanDomain) {
        allowedOrigins.push(`https://${cleanDomain}`);
      }
    });
  }

  // Always allow localhost in development
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push(
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000'
    );
  }

  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);

  if (allowedOrigins.indexOf(origin) !== -1) {
    return callback(null, true);
  } else {
    // If not in allowedOrigins, reject.
    // To allow requests to fail gracefully (without crashing), we return an error.
    // However, for security, we want to block it.
    return callback(new Error('Not allowed by CORS'));
  }
};
