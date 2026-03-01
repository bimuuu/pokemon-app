'use client'

export function CategoryPageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Category Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-96"></div>
          </div>
          <div className="text-right">
            <div className="h-6 bg-white/20 rounded w-24 mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Filter Section Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          <div className="h-8 bg-gray-200 rounded-full w-28"></div>
          <div className="h-8 bg-gray-200 rounded-full w-32"></div>
          <div className="h-8 bg-gray-200 rounded-full w-28"></div>
          <div className="h-8 bg-gray-200 rounded-full w-36"></div>
        </div>
      </div>

      {/* Pokemon Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="p-4 bg-white rounded-lg border animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            
            <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg"></div>
            
            <div className="h-5 bg-gray-200 rounded mx-auto mb-2 w-20"></div>
            
            <div className="flex justify-center gap-1 mb-2">
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-10"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-8"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
        <div className="h-8 bg-blue-500 rounded w-8"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  )
}

export function CategoryPageLoadingSkeletonWithFilters() {
  return (
    <div className="space-y-6">
      {/* Category Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-96"></div>
          </div>
          <div className="text-right">
            <div className="h-6 bg-white/20 rounded w-24 mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Multiple Filter Sections Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          <div className="h-8 bg-gray-200 rounded-full w-28"></div>
          <div className="h-8 bg-gray-200 rounded-full w-32"></div>
          <div className="h-8 bg-gray-200 rounded-full w-28"></div>
          <div className="h-8 bg-gray-200 rounded-full w-36"></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 bg-gray-200 rounded-full w-20"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          <div className="h-8 bg-gray-200 rounded-full w-28"></div>
          <div className="h-8 bg-gray-200 rounded-full w-20"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>

      {/* Pokemon Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="p-4 bg-white rounded-lg border animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            
            <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg"></div>
            
            <div className="h-5 bg-gray-200 rounded mx-auto mb-2 w-20"></div>
            
            <div className="flex justify-center gap-1 mb-2">
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-10"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-8"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
        <div className="h-8 bg-blue-500 rounded w-8"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  )
}
