/**
 * Performance optimization utilities for Harper's Place
 */

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize expensive function results
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getCacheKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getCacheKey ? getCacheKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Lazy load images with IntersectionObserver
 */
export class LazyLoader {
  private observer: IntersectionObserver | null = null;
  
  constructor(
    private onIntersect: (entry: IntersectionObserverEntry) => void,
    private options?: IntersectionObserverInit
  ) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px',
          threshold: 0.01,
          ...options,
        }
      );
    }
  }
  
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.onIntersect(entry);
        this.observer?.unobserve(entry.target);
      }
    });
  }
  
  observe(element: Element) {
    if (this.observer) {
      this.observer.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.onIntersect({ target: element } as IntersectionObserverEntry);
    }
  }
  
  disconnect() {
    this.observer?.disconnect();
  }
}

/**
 * Measure performance of functions
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

/**
 * Async function with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * Batch multiple operations
 */
export class BatchProcessor<T, R> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  
  constructor(
    private processor: (items: T[]) => Promise<R[]>,
    private delay: number = 100,
    private maxBatchSize: number = 50
  ) {}
  
  add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push(item);
      
      // Store the resolver with the item
      const index = this.queue.length - 1;
      
      if (this.queue.length >= this.maxBatchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.delay);
      }
      
      // This is simplified - in production you'd want to properly track resolvers
      this.processor([item])
        .then(results => resolve(results[0]))
        .catch(reject);
    });
  }
  
  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.queue.length === 0) return;
    
    const items = this.queue.splice(0, this.maxBatchSize);
    try {
      await this.processor(items);
    } catch (error) {
      console.error('Batch processing error:', error);
    }
  }
}

/**
 * Retry failed operations with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry,
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        
        if (onRetry) {
          onRetry(attempt, lastError);
        }
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Check if code is running on client or server
 */
export const isClient = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Prefetch data for faster navigation
 */
export function prefetch(url: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Web Vitals monitoring (if you want to track performance)
 */
export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';
  value: number;
  id: string;
}

export function reportWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  }
  
  // In production, you might want to send this to an analytics service
  // Example: analytics.track('web-vitals', metric);
}
