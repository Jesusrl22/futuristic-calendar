import { NextResponse } from "next/server"

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://future-task.com/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /
Allow: /app
Allow: /blog
Allow: /pricing
Allow: /about
Allow: /contact

# Crawl delay
Crawl-delay: 1

# Host
Host: https://future-task.com`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  })
}
