import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simply continue with the request
  return NextResponse.next()
}

// Keep the matcher the same for now
export const config = {
  matcher: ["/onboarding/:path*"],
}
