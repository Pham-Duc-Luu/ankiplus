// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ["/", "/(de|en)/:path*"],
// };

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";

export default async function middleware(request: NextRequest) {
  const cookies = cookie.parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const tokenFromOauth = request.cookies.get("token");

  if (request.nextUrl.pathname.includes("oauth")) {
    const oAuthToken = request.nextUrl.searchParams.get("token") || "";

    if (oAuthToken.length > 0) {
      const response = NextResponse.next();

      response.cookies.set({
        name: "token",
        value: oAuthToken.toString(),
      });
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*", "/oauth"],
};
