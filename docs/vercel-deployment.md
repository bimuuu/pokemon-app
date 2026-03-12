# Vercel Deployment Guide

## Image Loading Issues on Vercel

### Common Problems
1. **CORS Issues**: External images may be blocked by Next.js image optimization
2. **Domain Restrictions**: Not all domains are whitelisted by default
3. **Optimization Failures**: Some external images can't be optimized by Next.js

### Solutions Implemented

#### 1. Custom Image Loader
Created `lib/image-loader.js` to bypass Next.js optimization for external images:
```javascript
export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('https://')) {
    return src // Return original URL for external images
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}
```

#### 2. Enhanced Next.js Configuration
Updated `next.config.js` with:
- Multiple domain configurations
- Custom image loader
- Additional fallback domains

#### 3. 4-Level Fallback System
1. GitHub Official Artwork (Primary)
2. GitHub Regular Sprites (Secondary)
3. Pokemon.com Assets (Tertiary)
4. PokemonDB Artwork (Final)

#### 4. Vercel Configuration
Created `vercel.json` with:
- Proper caching headers
- Security headers
- Function timeouts

### Deployment Steps

#### 1. Environment Variables
Set these in Vercel dashboard:
```
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_IMAGE_DOMAINS=raw.githubusercontent.com,assets.pokemon.com,img.pokemondb.net
NODE_ENV=production
```

#### 2. Build Configuration
The app automatically uses the custom image loader in production.

#### 3. Domain Verification
Ensure all image domains are accessible:
- https://raw.githubusercontent.com
- https://assets.pokemon.com  
- https://img.pokemondb.net

### Testing on Vercel

#### 1. Deploy to Preview
```bash
vercel --prod
```

#### 2. Check Image Loading
- Open browser dev tools
- Check Network tab for image requests
- Verify fallback sources are working

#### 3. Debug Mode
In development, use the "Test Images" button on Pokemon cards to verify all sources.

### Troubleshooting

#### Images Still Not Loading
1. Check Vercel function logs
2. Verify environment variables
3. Test image URLs directly
4. Check CORS policies

#### Performance Issues
1. Enable priority loading for common Pokemon
2. Use image preloading
3. Monitor load times

#### Common Errors
- **CORS Error**: Domain not whitelisted
- **404 Error**: Image URL incorrect
- **Timeout Error**: Image server slow

### Best Practices

#### 1. Image Optimization
- Use appropriate image sizes
- Enable lazy loading
- Preload critical images

#### 2. Error Handling
- Always provide fallbacks
- Show loading states
- Log errors for debugging

#### 3. Performance
- Cache images properly
- Use CDNs when possible
- Monitor load times

### Monitoring

#### 1. Vercel Analytics
Monitor image loading performance and error rates.

#### 2. Browser Dev Tools
Check Network tab for:
- Failed image requests
- Load times
- Cache status

#### 3. Console Logging
Development mode shows detailed image loading information.

### Emergency Fixes

If images fail completely:

1. **Disable Optimization**:
   ```javascript
   images: { unoptimized: true }
   ```

2. **Use Local Fallbacks**:
   ```javascript
   src={imageError ? '/placeholder.png' : imageUrl}
   ```

3. **Cache Images**:
   Consider downloading and hosting images locally.

### Support

For ongoing issues:
1. Check Vercel logs
2. Test image URLs manually
3. Verify domain accessibility
4. Monitor performance metrics
