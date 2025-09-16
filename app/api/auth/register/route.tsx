import { type NextRequest, NextResponse } from "next/server"
import { createUser, sendEmail, logEmail } from "@/lib/db"
import { generateVerificationToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Hash password and generate verification token
    const passwordHash = await hashPassword(password)
    const verificationToken = generateVerificationToken()

    // Create user
    const user = await createUser({
      email,
      password_hash: passwordHash,
      full_name: name,
      email_verification_token: verificationToken,
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">¡Bienvenido a FutureTask!</h1>
        <p>Hola ${name},</p>
        <p>Gracias por registrarte en FutureTask. Para completar tu registro, por favor verifica tu email haciendo clic en el siguiente enlace:</p>
        <a href="${verificationUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Verificar Email
        </a>
        <p>Este enlace expirará en 24 horas.</p>
        <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
        <p>¡Gracias!<br>El equipo de FutureTask</p>
      </div>
    `

    await sendEmail(email, "Verifica tu cuenta de FutureTask", emailHtml)
    await logEmail(user.id, "verification", email, "Verifica tu cuenta de FutureTask")

    return NextResponse.json({
      success: true,
      message: "Usuario creado. Revisa tu email para verificar tu cuenta.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
