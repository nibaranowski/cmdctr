import { clerkMiddleware } from "@clerk/nextjs/server"

// Check if Clerk is properly configured
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_key' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_your_clerk_publishable_key'

// Export the appropriate middleware based on Clerk configuration
export default isClerkConfigured 
  ? clerkMiddleware({
      // Routes that can be accessed while signed out
      publicRoutes: ["/", "/api/webhook/clerk"],
      // Routes that can always be accessed, and have
      // no authentication information
      ignoredRoutes: ["/api/healthcheck"],
    } as any)
  : function middleware() {
      // No-op middleware when Clerk is not configured
      return
    }

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
} 