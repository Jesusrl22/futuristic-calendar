import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    console.log("[v0] Solicitud de cambio de contraseña para:", email)

    // Usar cliente Supabase para enviar el link de reset
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Supabase enviará automáticamente el email usando su proveedor de email configurado
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    })

    if (error) {
      console.error("[v0] Error en reset de contraseña:", error.message)
    } else {
      console.log("[v0] Email de reset enviado para:", email)
    }

    // Siempre devolver éxito por seguridad (no revelar si el email existe)
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
