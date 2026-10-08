import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // 1. Resolve Multi-Tenant Clinic from Subdomain or Custom Domain
  // e.g., smiles.konnectordental.app -> clinic-in-01 or clinic-us-01
  let tenantSubdomain = "";
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("run.app")) {
    tenantSubdomain = "default";
  } else {
    const parts = hostname.split(".");
    if (parts.length > 2) {
      tenantSubdomain = parts[0];
    }
  }

  // 2. Attach Multi-Tenant Context to Request Headers for Downstream Handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-subdomain", tenantSubdomain);
  requestHeaders.set("x-request-id", `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 3. Commercial-Grade Security Headers
  // Strict Transport Security (HSTS)
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Prevent clickjacking on admin dashboard while allowing framing on patient portals
  if (!url.pathname.startsWith("/portal")) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
  }
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Cross-Site Scripting (XSS) Filter
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Permissions Policy
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (.png, .jpg, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
