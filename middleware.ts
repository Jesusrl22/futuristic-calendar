import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "es",
  // Esto redirigirá automáticamente "/" a "/es"
  localePrefix: "always",
})

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
