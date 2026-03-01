'use client'

export function CategoryCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border-2 animate-pulse">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg"></div>
      
      <div className="h-6 bg-gray-200 rounded mx-auto mb-2 w-32"></div>
      
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export function CategoriesLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center animate-pulse">
        <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64"></div>
        <div className="space-y-2 max-w-3xl mx-auto">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>

      {/* Information Section Skeleton */}
      <div className="bg-gray-50 p-6 rounded-lg border animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
