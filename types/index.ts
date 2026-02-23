// Export all types from the project
export * from './item'
export * from './pokemon'

// Common utility types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface FilterOptions {
  search?: string
  type?: string
  generation?: string
  rarity?: string
  location?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
  data?: any
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
}

// Form types
export interface FormField<T = any> {
  name: keyof T
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: Array<{ value: any; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    custom?: (value: any) => string | undefined
  }
}

export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// Navigation types
export interface NavigationItem {
  href: string
  label: string
  icon?: React.ComponentType<any>
  badge?: string | number
  active?: boolean
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
}

// Performance types
export interface PerformanceMetrics {
  renderTime: number
  loadTime: number
  memoryUsage?: number
  bundleSize?: number
}

export interface CacheConfig {
  maxAge: number
  maxSize: number
  strategy: 'lru' | 'fifo' | 'custom'
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
  stack?: string
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}
