'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="text-gray-600">We encountered an unexpected error. Please try again.</p>
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left text-sm text-gray-500">
            <summary>Error details</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
