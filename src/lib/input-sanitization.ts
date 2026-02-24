/**
 * Input sanitization utilities for Harper's Place
 * Helps prevent XSS, injection attacks, and data corruption
 */

/**
 * Sanitizes HTML by stripping all tags except safe ones
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  return sanitized;
}

/**
 * Sanitizes user input for display (strips all HTML)
 * @param input - The string to sanitize
 * @returns Plain text string
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Remove all HTML tags
  const stripped = input.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities without DOM dependency for SSR safety
  const decoded = stripped
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  return decoded.trim();
}

/**
 * Validates and sanitizes a file name
 * @param fileName - The file name to sanitize
 * @returns Safe file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return 'file';
  
  // Remove path separators and special characters
  let sanitized = fileName.replace(/[\/\\]/g, '');
  
  // Keep only alphanumeric, dots, dashes, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Prevent double extensions
  sanitized = sanitized.replace(/\.+/g, '.');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 250) + '.' + ext;
  }
  
  return sanitized;
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitizes URL to prevent javascript: and data: protocols
 * @param url - URL to sanitize
 * @returns Safe URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return '';
  }
  
  // Allow http, https, and relative URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return url.trim();
  }
  
  // Default to empty for unknown protocols
  return '';
}

/**
 * Validates and sanitizes currency amount
 * @param amount - Amount to validate
 * @returns Valid number or 0
 */
export function sanitizeCurrency(amount: string | number): number {
  if (typeof amount === 'number') {
    return Math.max(0, Math.round(amount * 100) / 100);
  }
  
  const parsed = parseFloat(amount.replace(/[^0-9.-]/g, ''));
  
  if (isNaN(parsed)) return 0;
  
  return Math.max(0, Math.round(parsed * 100) / 100);
}

/**
 * Sanitizes phone number to digits only
 * @param phone - Phone number to sanitize
 * @returns Digits only
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Validates date string
 * @param dateString - Date string to validate
 * @returns True if valid date
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Rate limiting helper - tracks requests per identifier
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000
  ) {}
  
  /**
   * Check if request should be allowed
   * @param identifier - Unique identifier (e.g., user ID, IP)
   * @returns True if request is allowed
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests outside the window
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}
