import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the referer header
  const referer = request.headers.get('referer');
  
  // Check if this is a video source request
  if (request.nextUrl.pathname.startsWith('/watch')) {
    // Create a new response with modified headers
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://vidsrc.to https://autoembed.co https://multiembed.mov https://*.vidsrc.to https://*.autoembed.co https://*.multiembed.mov");
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    // Headers to prevent caching and handle redirects
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  return NextResponse.next();
}