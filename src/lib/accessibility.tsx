/**
 * Accessibility utilities for Harper's Place
 * Helps ensure WCAG 2.1 AA compliance
 */

/**
 * Generate unique ID for form elements
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ARIA live region announcer for screen readers
 */
export class LiveAnnouncer {
  private container: HTMLElement | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }
  
  private initialize() {
    // Create aria-live region if it doesn't exist
    let existing = document.getElementById('aria-live-region');
    if (!existing) {
      const div = document.createElement('div');
      div.id = 'aria-live-region';
      div.setAttribute('aria-live', 'polite');
      div.setAttribute('aria-atomic', 'true');
      div.className = 'sr-only';
      div.style.position = 'absolute';
      div.style.left = '-10000px';
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.overflow = 'hidden';
      document.body.appendChild(div);
      existing = div;
    }
    this.container = existing;
  }
  
  /**
   * Announce a message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.container) {
      this.initialize();
    }
    
    if (this.container) {
      this.container.setAttribute('aria-live', priority);
      this.container.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.container) {
          this.container.textContent = '';
        }
      }, 1000);
    }
  }
}

// Global instance
let announcer: LiveAnnouncer | null = null;

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof window === 'undefined') return;
  
  if (!announcer) {
    announcer = new LiveAnnouncer();
  }
  announcer.announce(message, priority);
}

/**
 * Focus trap for modal dialogs
 */
export class FocusTrap {
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;
  
  constructor(private container: HTMLElement) {
    this.previouslyFocused = document.activeElement as HTMLElement;
    this.updateFocusableElements();
  }
  
  private updateFocusableElements() {
    const focusableElements = this.container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const visible = Array.from(focusableElements).filter(el => {
      return el.offsetParent !== null && !el.hasAttribute('disabled');
    });
    
    this.firstFocusable = visible[0] || null;
    this.lastFocusable = visible[visible.length - 1] || null;
  }
  
  /**
   * Trap focus within container
   */
  activate() {
    this.container.addEventListener('keydown', this.handleKeyDown);
    if (this.firstFocusable) {
      this.firstFocusable.focus();
    }
  }
  
  /**
   * Release focus trap
   */
  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }
  
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  };
}

/**
 * Keyboard navigation helper
 */
export const keyboardNav = {
  /**
   * Check if key is navigation key
   */
  isNavigationKey(key: string): boolean {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key);
  },
  
  /**
   * Check if key is action key
   */
  isActionKey(key: string): boolean {
    return ['Enter', ' ', 'Space'].includes(key);
  },
  
  /**
   * Check if escape key
   */
  isEscapeKey(key: string): boolean {
    return key === 'Escape' || key === 'Esc';
  },
};

/**
 * Color contrast checker (WCAG 2.1)
 */
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; passes: { normal: boolean; large: boolean } } {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio,
    passes: {
      normal: ratio >= 4.5, // WCAG AA for normal text
      large: ratio >= 3, // WCAG AA for large text (18pt+)
    },
  };
}

/**
 * Skip to content link helper
 */
export function addSkipLink() {
  if (typeof window === 'undefined') return;
  
  const existing = document.getElementById('skip-to-content');
  if (existing) return;
  
  const skipLink = document.createElement('a');
  skipLink.id = 'skip-to-content';
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Screen reader only text utility
 */
export function srOnly(text: string): React.ReactNode {
  return (
    <span className="sr-only">{text}</span>
  );
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Manage document title for SPA navigation
 */
export function setDocumentTitle(title: string, appName = "Harper's Place") {
  if (typeof window === 'undefined') return;
  document.title = `${title} | ${appName}`;
  announce(`Navigated to ${title}`);
}

/**
 * Validate form field with custom error message
 */
export function validateField(
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
  }
): string | null {
  if (rules.required && !value) {
    return 'This field is required';
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`;
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }
  
  if (rules.custom && !rules.custom(value)) {
    return 'Invalid value';
  }
  
  return null;
}
