// Utility functions for image handling and debugging

export interface ImageLoadResult {
  success: boolean
  url: string
  error?: string
  loadTime?: number
}

// Test if an image URL loads successfully
export async function testImageLoad(url: string): Promise<ImageLoadResult> {
  const startTime = Date.now()
  
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        success: true,
        url,
        loadTime: Date.now() - startTime
      })
    }
    
    img.onerror = () => {
      resolve({
        success: false,
        url,
        error: 'Failed to load image'
      })
    }
    
    // Set a timeout to prevent hanging
    setTimeout(() => {
      resolve({
        success: false,
        url,
        error: 'Load timeout'
      })
    }, 10000) // 10 second timeout
    
    img.src = url
  })
}

// Test multiple image sources and return the first successful one
export async function findWorkingImageSource(urls: string[]): Promise<ImageLoadResult> {
  const results = await Promise.allSettled(
    urls.map(url => testImageLoad(url))
  )
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.success) {
      return result.value
    }
  }
  
  // If none succeeded, return the first result (which will be an error)
  const firstResult = results[0]
  if (firstResult.status === 'fulfilled') {
    return firstResult.value
  }
  
  return {
    success: false,
    url: urls[0],
    error: 'All image sources failed'
  }
}

// Log image loading performance for debugging
export function logImagePerformance(pokemonId: number, results: ImageLoadResult[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🖼️ Image Loading for Pokemon #${pokemonId}`)
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`✅ Source ${index + 1}: ${result.url} (${result.loadTime}ms)`)
      } else {
        console.warn(`❌ Source ${index + 1}: ${result.url} - ${result.error}`)
      }
    })
    console.groupEnd()
  }
}
