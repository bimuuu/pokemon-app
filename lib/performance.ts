// Performance optimization utilities

export const PERFORMANCE_CONFIG = {
  // Image optimization
  IMAGE_SIZES: {
    THUMBNAIL: { width: 64, height: 64 },
    CARD: { width: 96, height: 96 },
    DETAIL: { width: 200, height: 200 },
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 24,
  MAX_PAGE_SIZE: 100,
  
  // Debounce delays (ms)
  DEBOUNCE_DELAYS: {
    SEARCH: 300,
    FILTER: 200,
    TYPING: 150,
  },
  
  // Loading strategies
  LOADING_STRATEGIES: {
    PROGRESSIVE: 'progressive',
    LAZY: 'lazy',
    EAGER: 'eager',
  },
  
  // Cache settings
  CACHE_SETTINGS: {
    MAX_AGE: 3600000, // 1 hour in ms
    MAX_SIZE: 100, // max cached items
  },
} as const

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  })
}

// Request debouncing utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle utility for performance-critical operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Memory management utilities
export function cleanupMemory() {
  // Force garbage collection in development
  if (typeof window !== 'undefined' && 'gc' in window) {
    (window as any).gc()
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number>()
  
  static startTimer(name: string): void {
    this.metrics.set(name, performance.now())
  }
  
  static endTimer(name: string): number {
    const startTime = this.metrics.get(name)
    if (!startTime) return 0
    
    const duration = performance.now() - startTime
    this.metrics.delete(name)
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }
  
  static measure<T>(name: string, fn: () => T): T {
    this.startTimer(name)
    try {
      return fn()
    } finally {
      this.endTimer(name)
    }
  }
}

// Bundle optimization utilities
export const BUNDLE_OPTIMIZATIONS = {
  // Dynamic imports for code splitting
  lazyLoad: <T>(importFn: () => Promise<T>) => {
    return importFn()
  },
  
  // Preload critical resources
  preloadResource: (href: string, as: string = 'script') => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  },
  
  // Prefetch next pages
  prefetchPage: (href: string) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  },
}
