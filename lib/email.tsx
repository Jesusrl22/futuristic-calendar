import nodemailer from "nodemailer"

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    console.log("📧 Email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("❌ Error sending email:", error)
    return false
  }
}

// Email templates
export function generateVerificationEmail(name: string, verificationUrl: string) {
  return {
    subject: "🔐 Verifica tu cuenta en FutureTask",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu cuenta</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 FutureTask</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${name}! 👋</h2>
            <p>Bienvenido a <strong>FutureTask</strong>, tu nueva herramienta de productividad futurista.</p>
            <p>Para activar tu cuenta y comenzar a usar todas nuestras funciones, haz clic en el botón de abajo:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">✅ Verificar mi cuenta</a>
            </div>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
            <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `¡Hola ${name}! Bienvenido a FutureTask. Para verificar tu cuenta, visita: ${verificationUrl}`,
  }
}

export function generateWelcomeEmail(name: string) {
  return {
    subject: "🎉 ¡Bienvenido a FutureTask! Tu cuenta está activada",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Bienvenido!</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .feature { background-color: #f0f9ff; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Cuenta Activada!</h1>
          </div>
          <div class="content">
            <h2>¡Perfecto, ${name}! 🚀</h2>
            <p>Tu cuenta de <strong>FutureTask</strong> está ahora completamente activada. Ya puedes empezar a usar todas nuestras funciones:</p>
            
            <div class="feature">
              <h3>📅 Calendario Inteligente</h3>
              <p>Organiza tus tareas con nuestro calendario futurista y nunca pierdas una fecha importante.</p>
            </div>
            
            <div class="feature">
              <h3>🍅 Técnica Pomodoro</h3>
              <p>Mejora tu productividad con sesiones de trabajo enfocado y descansos programados.</p>
            </div>
            
            <div class="feature">
              <h3>🏆 Sistema de Logros</h3>
              <p>Gana insignias y mantén la motivación mientras completas tus objetivos.</p>
            </div>
            
            <div class="feature">
              <h3>🤖 Asistente IA</h3>
              <p>Obtén ayuda inteligente para organizar mejor tus tareas y proyectos.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">🚀 Comenzar ahora</a>
            </div>
            
            <p><strong>💡 Consejo:</strong> Explora la sección de configuración para personalizar tu experiencia y activar las notificaciones.</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
            <p>¿Necesitas ayuda? Responde a este email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `¡Bienvenido ${name}! Tu cuenta FutureTask está activada. Visita ${process.env.NEXT_PUBLIC_APP_URL} para comenzar.`,
  }
}

export function generateInvoiceEmail(name: string, planName: string, amount: string, transactionId: string) {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return {
    subject: `📄 Factura de tu suscripción ${planName} - FutureTask`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .invoice-details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .total-row { font-weight: bold; font-size: 18px; color: #1e40af; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Factura</h1>
          </div>
          <div class="content">
            <h2>¡Gracias por tu pago, ${name}! 💳</h2>
            <p>Hemos recibido correctamente el pago de tu suscripción <strong>${planName}</strong>.</p>
            
            <div class="invoice-details">
              <h3>Detalles de la factura</h3>
              <div class="detail-row">
                <span>Fecha:</span>
                <span>${currentDate}</span>
              </div>
              <div class="detail-row">
                <span>Plan:</span>
                <span>${planName}</span>
              </div>
              <div class="detail-row">
                <span>ID de transacción:</span>
                <span>${transactionId}</span>
              </div>
              <div class="detail-row total-row">
                <span>Total pagado:</span>
                <span>${amount}</span>
              </div>
            </div>
            
            <p><strong>✅ Tu suscripción está ahora activa</strong> y tienes acceso a todas las funciones premium.</p>
            
            <h3>¿Qué incluye tu plan ${planName}?</h3>
            <ul>
              <li>🤖 Asistente IA ilimitado</li>
              <li>📊 Análisis avanzados de productividad</li>
              <li>🔄 Sincronización en todos tus dispositivos</li>
              <li>🎨 Temas y personalización avanzada</li>
              <li>📧 Soporte prioritario</li>
            </ul>
            
            <p>Si tienes alguna pregunta sobre tu factura, no dudes en contactarnos.</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
            <p>Esta es tu factura oficial. Guárdala para tus registros.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Factura FutureTask - Plan ${planName}: ${amount}. ID: ${transactionId}. Fecha: ${currentDate}`,
  }
}

export function generateRenewalReminderEmail(name: string, planName: string, expiryDate: string, renewalUrl: string) {
  return {
    subject: `🔔 Tu suscripción ${planName} expira pronto - FutureTask`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de renovación</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .warning-box { background-color: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Recordatorio</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${name}! ⏰</h2>
            
            <div class="warning-box">
              <h3>⚠️ Tu suscripción ${planName} expira pronto</h3>
              <p><strong>Fecha de expiración: ${expiryDate}</strong></p>
            </div>
            
            <p>No queremos que pierdas el acceso a todas las funciones premium que has estado disfrutando:</p>
            
            <ul>
              <li>🤖 Asistente IA ilimitado</li>
              <li>📊 Análisis avanzados</li>
              <li>🔄 Sincronización completa</li>
              <li>🎨 Personalización avanzada</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${renewalUrl}" class="button">🔄 Renovar suscripción</a>
            </div>
            
            <p><strong>💡 Renueva ahora</strong> y mantén tu productividad al máximo nivel sin interrupciones.</p>
            
            <p>Si tienes alguna pregunta o necesitas ayuda, estamos aquí para ti.</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hola ${name}, tu suscripción ${planName} expira el ${expiryDate}. Renueva en: ${renewalUrl}`,
  }
}

export function generateCancellationEmail(name: string, planName: string, endDate: string) {
  return {
    subject: `🚫 Confirmación de cancelación - Plan ${planName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cancelación confirmada</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .info-box { background-color: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚫 Cancelación</h1>
          </div>
          <div class="content">
            <h2>Hola ${name},</h2>
            
            <p>Hemos procesado tu solicitud de cancelación para el plan <strong>${planName}</strong>.</p>
            
            <div class="info-box">
              <h3>📅 Información importante:</h3>
              <p><strong>Tu suscripción permanecerá activa hasta: ${endDate}</strong></p>
              <p>Seguirás teniendo acceso a todas las funciones premium hasta esa fecha.</p>
            </div>
            
            <h3>¿Qué sucede después del ${endDate}?</h3>
            <ul>
              <li>❌ Perderás el acceso al asistente IA</li>
              <li>❌ Los análisis avanzados no estarán disponibles</li>
              <li>❌ La sincronización se limitará</li>
              <li>✅ Tus datos se mantendrán seguros</li>
              <li>✅ Podrás reactivar tu suscripción en cualquier momento</li>
            </ul>
            
            <p><strong>¿Cambio de opinión?</strong> Puedes reactivar tu suscripción en cualquier momento desde tu panel de usuario.</p>
            
            <p>Lamentamos verte partir, pero esperamos que regreses pronto. 😊</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hola ${name}, tu suscripción ${planName} ha sido cancelada. Permanecerá activa hasta ${endDate}.`,
  }
}

export function generateExpirationWarningEmail(name: string, planName: string, daysLeft: number) {
  return {
    subject: `⚠️ Tu plan ${planName} expira en ${daysLeft} día${daysLeft > 1 ? "s" : ""}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aviso de expiración</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .warning-box { background-color: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Aviso Importante</h1>
          </div>
          <div class="content">
            <h2>Hola ${name},</h2>
            
            <div class="warning-box">
              <h3>🕐 Tu plan ${planName} expira en ${daysLeft} día${daysLeft > 1 ? "s" : ""}</h3>
              <p>Después de la expiración, perderás el acceso a las funciones premium.</p>
            </div>
            
            <p>Para mantener tu acceso completo a FutureTask, puedes:</p>
            
            <ul>
              <li>🔄 Reactivar tu suscripción desde tu panel de usuario</li>
              <li>📞 Contactar con nuestro equipo de soporte</li>
              <li>💾 Hacer una copia de seguridad de tus datos importantes</li>
            </ul>
            
            <p>¡No queremos que pierdas tu progreso y configuraciones!</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hola ${name}, tu plan ${planName} expira en ${daysLeft} día${daysLeft > 1 ? "s" : ""}. Reactiva tu suscripción para mantener el acceso.`,
  }
}

export function generateSubscriptionExpiredEmail(name: string, planName: string) {
  return {
    subject: `📋 Tu suscripción ${planName} ha expirado - FutureTask`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suscripción expirada</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 20px; }
          .info-box { background-color: #f3f4f6; border: 2px solid #6b7280; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Suscripción Expirada</h1>
          </div>
          <div class="content">
            <h2>Hola ${name},</h2>
            
            <p>Tu suscripción <strong>${planName}</strong> ha expirado y ahora tienes acceso limitado a FutureTask.</p>
            
            <div class="info-box">
              <h3>🔒 Funciones ahora limitadas:</h3>
              <ul>
                <li>❌ Asistente IA no disponible</li>
                <li>❌ Análisis avanzados desactivados</li>
                <li>❌ Sincronización limitada</li>
                <li>❌ Temas premium no disponibles</li>
              </ul>
            </div>
            
            <h3>✅ Aún puedes usar:</h3>
            <ul>
              <li>📅 Calendario básico</li>
              <li>✅ Gestión de tareas</li>
              <li>🍅 Técnica Pomodoro</li>
              <li>📝 Notas básicas</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">🔄 Reactivar suscripción</a>
            </div>
            
            <p><strong>¡Tus datos están seguros!</strong> Cuando reactives tu suscripción, todo volverá a estar como antes.</p>
            
            <p>Gracias por haber sido parte de FutureTask Premium. ¡Esperamos verte de vuelta pronto! 🚀</p>
          </div>
          <div class="footer">
            <p>© 2024 FutureTask. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hola ${name}, tu suscripción ${planName} ha expirado. Reactívala en ${process.env.NEXT_PUBLIC_APP_URL} para recuperar el acceso completo.`,
  }
}
