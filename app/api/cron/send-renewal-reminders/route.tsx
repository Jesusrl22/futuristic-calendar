import { type NextRequest, NextResponse } from "next/server"
import { getSubscriptionsExpiringIn, sendEmail, logEmail } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get subscriptions expiring in 3 days
    const expiringUsers = await getSubscriptionsExpiringIn(3)

    for (const user of expiringUsers) {
      const expiryDate = new Date(user.subscription_ends_at).toLocaleDateString("es-ES")

      const reminderHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">⚠️ Tu suscripción expira pronto</h1>
          <p>Hola ${user.full_name},</p>
          <p>Tu suscripción de FutureTask ${user.is_pro ? "Pro" : "Premium"} expirará el <strong>${expiryDate}</strong>.</p>
          <p>Para continuar disfrutando de todas las funciones premium, renueva tu suscripción:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Renovar Suscripción
          </a>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>¡Gracias!<br>El equipo de FutureTask</p>
        </div>
      `

      await sendEmail(user.email, "Tu suscripción expira pronto - FutureTask", reminderHtml)
      await logEmail(user.id, "renewal_reminder", user.email, "Tu suscripción expira pronto - FutureTask")
    }

    return NextResponse.json({
      success: true,
      processed: expiringUsers.length,
    })
  } catch (error) {
    console.error("Renewal reminder cron error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
