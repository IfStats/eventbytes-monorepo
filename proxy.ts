import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

import { updateSession } from './lib/supabase/middleware'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/events/create(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth().protect()

  return updateSession(req)
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
