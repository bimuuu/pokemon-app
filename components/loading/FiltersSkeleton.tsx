export function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  )
}
