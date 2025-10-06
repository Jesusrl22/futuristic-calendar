import { NextResponse } from "next/server"
import { APP_VERSION } from "@/lib/version"

export async function GET() {
  return NextResponse.json({
    version: APP_VERSION.full,
    buildId: APP_VERSION.buildId,
    buildDate: APP_VERSION.buildDate,
    timestamp: new Date().toISOString(),
    status: "active",
  })
}
