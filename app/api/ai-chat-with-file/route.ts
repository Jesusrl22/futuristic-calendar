import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/redis"
import { createServiceRoleClient } from "@/lib/supabase/server"

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || null
  } catch {
    return null
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Simple PDF text extraction - reads text content
    const text = buffer.toString("latin1")
    const matches = text.match(/BT\s+(.*?)\s+ET/gs) || []
    return matches
      .map((m) => m.replace(/BT|ET|Tj|TJ|$$|$$|<|>|\/F\d+|[\d.]+\s+/g, " "))
      .join(" ")
      .substring(0, 4000)
  } catch {
    return buffer.toString("utf8").substring(0, 4000)
  }
}

async function processFileContent(file: File, fileType: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (fileType === "application/pdf") {
    return await extractTextFromPDF(buffer)
  } else if (fileType.startsWith("image/")) {
    // Convert image to base64 for vision
    return `[Image: ${file.name} - ${buffer.length} bytes]\n${buffer.toString("base64").substring(0, 100)}...`
  } else if (
    fileType.startsWith("text/") ||
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return buffer.toString("utf8").substring(0, 4000)
  }

  return `[File: ${file.name}]`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const message = formData.get("message") as string
    const file = formData.get("file") as File | null

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getUserIdFromToken(accessToken)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const rateLimitResult = await rateLimit(userId, "aiChat")
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many AI requests",
          message: "You're sending messages too quickly. Please wait a moment.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { status: 429 },
      )
    }

    const supabaseAdmin = await createServiceRoleClient()

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("users")
      .select("ai_credits,ai_credits_purchased,subscription_tier")
      .eq("id", userId)
      .maybeSingle()

    if (profileError || !profiles) {
      console.error("[v0] Failed to fetch profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const profile = profiles
    const monthlyCredits = profile.ai_credits || 0
    const purchasedCredits = profile.ai_credits_purchased || 0
    const totalCredits = monthlyCredits + purchasedCredits

    const creditCost = file ? 3 : 2

    if (totalCredits < creditCost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    let newMonthlyCredits = monthlyCredits
    let newPurchasedCredits = purchasedCredits

    if (monthlyCredits >= creditCost) {
      newMonthlyCredits -= creditCost
    } else if (monthlyCredits > 0) {
      const remaining = creditCost - monthlyCredits
      newMonthlyCredits = 0
      newPurchasedCredits -= remaining
    } else {
      newPurchasedCredits -= creditCost
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        ai_credits: newMonthlyCredits,
        ai_credits_purchased: newPurchasedCredits,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("[v0] Failed to update credits:", updateError)
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    let fileContent = ""
    if (file) {
      fileContent = await processFileContent(file, file.type)
    }

    const fullPrompt = fileContent
      ? `File: ${file?.name || "document"}\nContent preview:\n${fileContent}\n\nUser request: ${message}`
      : message

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: fullPrompt,
    })

    return NextResponse.json({
      response: text,
      creditsUsed: creditCost,
      creditsRemaining: newMonthlyCredits + newPurchasedCredits,
    })
  } catch (error) {
    console.error("[v0] Error in AI chat with file:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
