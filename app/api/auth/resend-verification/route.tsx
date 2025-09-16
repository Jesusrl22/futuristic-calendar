import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, sendEmail, logEmail } from "@/lib/db"
import { generateVerificationToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "Email ya verificado" }, { status: 400 })
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken()
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Verificación de Email - FutureTask</h1>
        <p>Hola ${user.full_name},</p>
        <p>Has solicitado un nuevo enlace de verificación. Haz clic en el siguiente enlace para verificar tu email:</p>
        <a href="${verificationUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Verificar Email
        </a>
        <p>Este enlace expirará en 24 horas.</p>
        <p>¡Gracias!<br>El equipo de FutureTask</p>
      </div>
    `

    await sendEmail(email, "Verificación de Email - FutureTask", emailHtml)
    await logEmail(user.id, "verification_resend", email, "Verificación de Email - FutureTask")

    return NextResponse.json({
      success: true,
      message: "Email de verificación reenviado",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Error al reenviar verificación" }, { status: 500 })
  }
}
