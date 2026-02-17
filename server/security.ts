/**
 * Security middleware and helpers
 */

/**
 * Creates a CORS origin check function
 * Validates against REPLIT_DOMAINS and allows localhost in development
 */
export function createCorsOriginCheck() {
  const allowedOrigins: string[] = [];

  // Add Replit domains if available
  if (process.env.REPLIT_DOMAINS) {
    process.env.REPLIT_DOMAINS.split(',').forEach(domain => {
      allowedOrigins.push(`https://${domain.trim()}`);
    });
  }

  // Allow localhost in development
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:5000');
    allowedOrigins.push('http://127.0.0.1:3000');
    allowedOrigins.push('http://127.0.0.1:5000');
  }

  return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Log blocked origin in development for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Blocked CORS request from origin: ${origin}`);
    }

    callback(new Error('Not allowed by CORS'));
  };
}
