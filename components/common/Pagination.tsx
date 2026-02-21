import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useLanguage()
  const pages = []
  const showPages = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  let endPage = Math.min(totalPages, startPage + showPages - 1)
  
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          aria-label={t('pagination.previousPage')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm font-medium"
              aria-label={t('pagination.goToPage').replace('{pageNumber}', '1')}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-gray-400 text-sm" aria-hidden="true">...</span>
            )}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg border transition-all duration-200 shadow-sm text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
            }`}
            aria-label={t('pagination.goToPage').replace('{pageNumber}', page.toString())}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-400 text-sm" aria-hidden="true">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm text-sm font-medium"
              aria-label={t('pagination.goToPage').replace('{pageNumber}', totalPages.toString())}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          aria-label={t('pagination.nextPage')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
      </div>
    </div>
  )
}
