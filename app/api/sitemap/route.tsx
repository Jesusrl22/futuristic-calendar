import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://future-task.com"

  // Static pages
  const staticPages = ["", "/app", "/pricing", "/about", "/contact", "/privacy", "/terms"]

  // Blog posts
  const blogPosts = [
    "/blog/boost-productivity-ai-calendar",
    "/blog/future-task-management-trends",
    "/blog/ai-powered-scheduling-guide",
  ]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`,
    )
    .join("")}

  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}${post}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}

</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  })
}
