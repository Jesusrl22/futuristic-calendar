import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    console.log("[TEST-EMAIL] Enviando email de prueba a:", email)

    // Usar nuestro sistema SMTP personalizado
    const result = await sendVerificationEmail(email, "Usuario de Prueba")

    if (result.success) {
      console.log("[TEST-EMAIL] ✓ Email enviado exitosamente")
      return NextResponse.json({
        success: true,
        message: "Email de prueba enviado exitosamente! Revisa tu bandeja de entrada.",
        details: result,
      })
    } else {
      console.error("[TEST-EMAIL] ❌ Error al enviar email:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: "Error al enviar email",
          details: result.error,
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("[TEST-EMAIL] Error no controlado:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Error al enviar email de prueba"
      },
      { status: 500 }
    )
  }
}
