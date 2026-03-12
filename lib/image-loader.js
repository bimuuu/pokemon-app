'use client'

export default function imageLoader({ src, width, quality }) {
  // For external images, return the original URL without Next.js optimization
  if (src.startsWith('https://')) {
    return src
  }
  
  // For local images, use Next.js optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}
