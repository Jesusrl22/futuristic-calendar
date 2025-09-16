import { type NextRequest, NextResponse } from "next/server"
import { updateUserSubscription, sendEmail, logEmail, getUserById } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify PayPal webhook signature here in production

    const { event_type, resource } = body

    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const { custom_id, amount } = resource

      if (!custom_id) {
        return NextResponse.json({ error: "Missing custom_id" }, { status: 400 })
      }

      const [userId, planType] = custom_id.split("_")
      const user = await getUserById(userId)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Update user subscription
      const updates = {
        subscription_status: "active",
        is_premium: true,
        is_pro: planType === "pro",
        premium_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      }

      if (planType === "pro") {
        updates.ai_credits = 1000
        updates.ai_credits_used = 0
      }

      await updateUserSubscription(userId, updates)

      // Send invoice email
      const invoiceHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Factura - FutureTask ${planType === "pro" ? "Pro" : "Premium"}</h1>
          <p>Hola ${user.full_name},</p>
          <p>Tu pago ha sido procesado exitosamente:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalles del pago:</h3>
            <p><strong>Plan:</strong> FutureTask ${planType === "pro" ? "Pro" : "Premium"}</p>
            <p><strong>Monto:</strong> €${amount.value}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
            <p><strong>ID de transacción:</strong> ${resource.id}</p>
          </div>
          <p>Tu suscripción está activa y expira el ${new Date(updates.premium_expiry).toLocaleDateString("es-ES")}.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Acceder a FutureTask
          </a>
          <p>¡Gracias por tu confianza!<br>El equipo de FutureTask</p>
        </div>
      `

      await sendEmail(user.email, `Factura - FutureTask ${planType === "pro" ? "Pro" : "Premium"}`, invoiceHtml)
      await logEmail(userId, "invoice", user.email, `Factura - FutureTask ${planType === "pro" ? "Pro" : "Premium"}`)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
