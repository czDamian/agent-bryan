import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from onboard page
  if (token && pathname === "/onboard") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // Protect /chat and /personalize (require authentication)
  if (!token && ["/chat", "/personalize"].includes(pathname)) {
    return NextResponse.redirect(new URL("/onboard", request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to /chat, /personalize, and /onboard
export const config = {
  matcher: ["/chat", "/personalize", "/onboard"],
};
