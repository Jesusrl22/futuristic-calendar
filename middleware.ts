import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Solo maneja rutas básicas, sin internacionalización compleja
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
}
