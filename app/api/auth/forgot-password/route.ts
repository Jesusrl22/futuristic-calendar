import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    console.log("[v0] Solicitud de cambio de contraseña para:", email)

    // Usar SERVICE_ROLE_KEY para evitar RLS recursion - esto bypasa las políticas RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
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

    // Crear URL de reset
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    console.log("[v0] Token guardado, enviando email...")

    // Enviar email usando la función de la librería
    try {
      await sendPasswordResetEmail(email, resetUrl)
      console.log("[v0] Email de reset enviado exitosamente")

      return NextResponse.json({
        success: true,
        message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
      })
    } catch (emailError: any) {
      console.error("[v0] Error al enviar email:", emailError.message)
      
      // Aún así retornar éxito por seguridad
      return NextResponse.json({
        success: true,
        message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
      })
    }
  } catch (error: any) {
    console.error("[v0] Error en forgot password:", error.message)
    return NextResponse.json({
      success: true,
      message: "Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.",
    })
  }
}
