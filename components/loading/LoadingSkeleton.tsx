export function PokemonCardSkeleton() {
  return (
    <div className="p-4 bg-white rounded-lg border animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>
      
      <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg"></div>
      
      <div className="h-5 bg-gray-200 rounded mx-auto mb-2 w-20"></div>
      
      <div className="flex justify-center gap-1 mb-2">
        <div className="type-badge-placeholder"></div>
        <div className="type-badge-placeholder"></div>
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
  )
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: 24 }).map((_, index) => (
        <PokemonCardSkeleton key={index} />
      ))}
    </div>
  )
}
