import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(req: NextRequest) {
  try {
    const { fileContent, fileName, fileType } = await req.json()

    if (!fileContent) {
      return NextResponse.json({ error: "File content is required" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured", message: "Service temporarily unavailable" },
        { status: 500 },
      )
    }

    const groq = new Groq({ apiKey })

    console.log("[v0] Processing document:", fileName, "Type:", fileType)

    let systemPrompt =
      "You are an expert study assistant. Analyze the provided document and create a comprehensive study guide."

    if (fileType === "image") {
      systemPrompt +=
        " This appears to be an image (possibly a photo of notes or a whiteboard). Extract the text and concepts you can identify."
    } else if (fileType === "text") {
      systemPrompt += " This is a text document with study notes."
    } else if (fileType === "pdf") {
      systemPrompt += " This is content extracted from a PDF document."
    }

    systemPrompt +=
      " Include: 1) Main concepts summary, 2) Key points list, 3) Important definitions, 4) Study questions. Format your response clearly with sections."

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please analyze this ${fileType} document and create a study guide:\n\n${fileContent.substring(0, 4000)}`,
        },
      ],
      temperature: 0.5,
    })

    const analysis = response.choices[0]?.message?.content || "Unable to analyze document"

    console.log("[v0] Document analysis completed")

    return NextResponse.json({
      analysis,
      fileName,
      fileType,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Document Processing Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        error: "Failed to process document",
        message: "Unable to analyze the file. Please try again.",
      },
      { status: 500 },
    )
  }
}
