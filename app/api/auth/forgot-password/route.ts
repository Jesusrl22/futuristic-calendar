import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    console.log("[v0] Solicitud de cambio de contraseña para:", email)

    // Crear cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verificar si el usuario existe
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    if (userError || !users) {
      console.log("[v0] Usuario no encontrado:", email)
      // No revelar si el email existe por seguridad
      return NextResponse.json({
        success: true,
        message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
      })
    }

    // Generar token de reset seguro
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60) // 1 hora

    // Guardar el token en la base de datos
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires.toISOString(),
      })
      .eq("email", email.toLowerCase())

    if (updateError) {
      console.error("[v0] Error al guardar token de reset:", updateError.message)
      return NextResponse.json({
        success: true,
        message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
      })
    }

    // Configurar transporte de nodemailer con Zoho
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.eu",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Crear URL de reset
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    // HTML del email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Restablecer tu contraseña</h2>
        <p style="color: #666;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
        </div>
        <p style="color: #999; font-size: 12px;">O copia y pega este enlace en tu navegador: ${resetUrl}</p>
        <p style="color: #999; font-size: 12px;">Este enlace expirará en 1 hora.</p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste este cambio, ignora este email.</p>
      </div>
    `

    // Enviar email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Restablecer tu contraseña",
      html: htmlContent,
      text: `Restablecer tu contraseña: ${resetUrl}`,
    })

    console.log("[v0] Email de reset enviado exitosamente:", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
    })
  } catch (error: any) {
    console.error("[v0] Error en forgot password:", error.message)
    return NextResponse.json({
      success: true,
      message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
    })
  }
}
