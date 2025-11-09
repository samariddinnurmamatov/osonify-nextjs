import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './shared/config/i18n';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Get pathname and locale first (before intl middleware)
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ru|uz)/, '') || '/';
  const locale = pathname.split('/')[1] || 'en';
  
  // Check for access token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  // If has token and on login page, redirect to home FIRST (before intl middleware)
  if (accessToken && pathnameWithoutLocale === '/login') {
    const homeUrl = new URL(`/${locale}/`, request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // First, handle i18n routing
  const response = intlMiddleware(request);
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathnameWithoutLocale.startsWith(route));
  
  // Skip auth check for public routes and API routes
  if (isPublicRoute || pathname.startsWith('/api/')) {
    return response;
  }
  
  // If no token and not on public route, redirect to login
  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return response;
}

export const config = {
  // Matcher ignoring `/_next`, `/api`, `/static`, `/favicon.ico` and all root files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
