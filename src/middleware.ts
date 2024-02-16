import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // console.log("middleware running", request);
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" || path === "/register" || path === "/";

  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// "Matching Paths"
// i.e on which paths you want your middleware to run
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/onboarding",
    "/create-post",
    "/home",
    "/post/:id*",
    "/dashboard/:path*",
    "/addTodo",
    "/editTodo",
    "/editTodo/:path*",
  ],
};
