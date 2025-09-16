import { type NextRequest, NextResponse } from "next/server"
import { updateUser } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId, updates } = await request.json()

    if (!userId || !updates) {
      return NextResponse.json({ error: "Missing userId or updates" }, { status: 400 })
    }

    const updatedUser = await updateUser(userId, updates)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
