// Common hooks for pagination and filtering
import { useState, useEffect } from 'react'

interface UsePaginationProps {
  totalPages: number
  initialPage?: number
}

export function usePagination({ totalPages, initialPage = 1 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    goToPage(currentPage + 1)
  }

  const prevPage = () => {
    goToPage(currentPage - 1)
  }

  const resetPage = () => {
    setCurrentPage(1)
  }

  return {
    currentPage,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    resetPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
  }
}

interface UseFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function useFilters<T extends Record<string, any>>(initialFilters: T, { onFiltersChange }: UseFiltersProps = {}) {
  const [filters, setFilters] = useState<T>(initialFilters)

  const updateFilter = (key: keyof T, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const updateFilters = (newFilters: Partial<T>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    onFiltersChange?.(initialFilters)
  }

  const clearFilter = (key: keyof T) => {
    updateFilter(key, initialFilters[key])
  }

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters: Object.keys(filters).some(key => filters[key] !== initialFilters[key]),
  }
}
