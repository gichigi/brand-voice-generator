import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if we're on an onboarding page
  const isOnboardingPage = path.startsWith("/onboarding")

  // Get onboarding status from cookies (more reliable than localStorage in middleware)
  const onboardingCompleted = request.cookies.get("onboardingCompleted")?.value === "true"

  // If trying to access onboarding but already completed, redirect to dashboard
  if (isOnboardingPage && onboardingCompleted) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Only run middleware on onboarding pages
export const config = {
  matcher: ["/onboarding/:path*"],
}
