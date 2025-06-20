import { clerkMiddleware } from "@clerk/nextjs/server"

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/api/webhook/clerk"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/healthcheck"],
} as any)

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
} 