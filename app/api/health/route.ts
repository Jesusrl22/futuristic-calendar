import { NextResponse } from "next/server"

export async function GET() {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    domain: "future-task.com",
    version: "1.0.0",
    services: {
      database: "operational",
      analytics: "operational",
      api: "operational",
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
    environment: process.env.NODE_ENV || "development",
  }

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/json",
    },
  })
}
