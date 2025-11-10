import createMiddleware from 'next-intl/middleware';
import { routing } from './shared/config/i18n';

export default createMiddleware(routing);

export const config = {
  // Matcher ignoring `/_next`, `/api`, `/static`, `/favicon.ico` and all root files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
