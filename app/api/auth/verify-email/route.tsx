import { type NextRequest, NextResponse } from "next/server"
import { verifyUserEmail, sendEmail, logEmail } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 })
    }

    const user = await verifyUserEmail(token)

    if (!user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 })
    }

    // Send welcome email
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">¡Email verificado exitosamente! 🎉</h1>
        <p>Hola ${user.full_name},</p>
        <p>Tu cuenta ha sido verificada correctamente. Ya puedes acceder a todas las funciones de FutureTask:</p>
        <ul>
          <li>📅 Calendario inteligente</li>
          <li>✅ Gestión de tareas</li>
          <li>⏰ Timer Pomodoro</li>
          <li>📊 Estadísticas de productividad</li>
        </ul>
        <p>Para usuarios Premium y Pro tenemos funciones adicionales como:</p>
        <ul>
          <li>🎯 Lista de objetivos</li>
          <li>📝 Sistema de notas</li>
          <li>🤖 Asistente IA (Solo Pro)</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Acceder a FutureTask
        </a>
        <p>¡Bienvenido a bordo!<br>El equipo de FutureTask</p>
      </div>
    `

    await sendEmail(user.email, "¡Bienvenido a FutureTask!", welcomeHtml)
    await logEmail(user.id, "welcome", user.email, "¡Bienvenido a FutureTask!")

    return NextResponse.json({ success: true, message: "Email verificado exitosamente" })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Error al verificar email" }, { status: 500 })
  }
}
