import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email: string, resetLink: string, name?: string) {
  const userName = name || email.split("@")[0]

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #84ff65 0%, #65d9ff 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .button { display: inline-block; background: #84ff65; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 12px; border-radius: 4px; margin: 15px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Restablecer Contraseña</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Restablecer Contraseña</a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>Seguridad:</strong> Este enlace expirará en 24 horas. Si no solicitaste restablecer tu contraseña, ignora este email.
            </div>
            
            <p>Si tienes problemas, contáctanos en support@example.com</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Future Task. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "Restablecer tu contraseña",
      html: htmlContent,
    })
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error sending password reset email:", error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const userName = name || email.split("@")[0]

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #84ff65 0%, #65d9ff 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .button { display: inline-block; background: #84ff65; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenido a Future Task</h1>
          </div>
          
          <div class="content">
            <p>¡Hola <strong>${userName}</strong>!</p>
            
            <p>Gracias por crear una cuenta en Future Task. Estamos emocionados de tenerte aquí.</p>
            
            <p>Con Future Task puedes:</p>
            <ul>
              <li>Gestionar tareas y proyectos eficientemente</li>
              <li>Colaborar con tu equipo en tiempo real</li>
              <li>Usar IA para optimizar tu productividad</li>
              <li>Mantener tu calendario sincronizado</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://future-task.com/app" class="button">Ir a Mi Dashboard</a>
            </div>
            
            <p>Si tienes preguntas, estamos aquí para ayudarte.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Future Task. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "Bienvenido a Future Task",
      html: htmlContent,
    })
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error sending welcome email:", error)
    throw error
  }
}

export async function sendNewDeviceLoginEmail(email: string, name?: string, deviceInfo?: string) {
  const userName = name || email.split("@")[0]
  const device = deviceInfo || "dispositivo desconocido"

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #84ff65 0%, #65d9ff 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .button { display: inline-block; background: #84ff65; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 12px; border-radius: 4px; margin: 15px 0; font-size: 12px; }
          .info-box { background: #e7f3ff; border-left: 4px solid #84ff65; padding: 12px; margin: 15px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo Inicio de Sesión</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>Detectamos un inicio de sesión en tu cuenta desde un dispositivo nuevo:</p>
            
            <div class="info-box">
              <strong>Dispositivo:</strong> ${device}<br>
              <strong>Fecha/Hora:</strong> ${new Date().toLocaleString('es-ES')}<br>
              <strong>Acción:</strong> Inicio de sesión exitoso
            </div>
            
            <p>Si fuiste tú, no necesitas hacer nada. Si no reconoces este inicio de sesión, te recomendamos:</p>
            <ul>
              <li>Cambiar tu contraseña inmediatamente</li>
              <li>Revisar tu actividad reciente</li>
              <li>Habilitar autenticación de dos factores (si está disponible)</li>
            </ul>
            
            <div class="warning">
              <strong>Seguridad:</strong> Nunca compartamos tu contraseña por email. Si recibiste un email pidiendo tu contraseña, repórtalo como phishing.
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://future-task.com'}/app/settings" class="button">Gestionar Seguridad</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2026 Future Task. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "Nuevo inicio de sesión en tu cuenta",
      html: htmlContent,
    })
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error sending new device login email:", error)
    throw error
  }
}

export async function sendSubscriptionCancelledEmail(email: string, name?: string, reason?: string) {
  const userName = name || email.split("@")[0]
  const cancelReason = reason || "Fallo en el procesamiento del pago"

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .button { display: inline-block; background: #84ff65; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .button-secondary { display: inline-block; background: #65d9ff; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 10px 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          .warning { background: #ffe7e7; border: 1px solid #ff6b6b; color: #c92a2a; padding: 12px; border-radius: 4px; margin: 15px 0; font-size: 12px; }
          .info-box { background: #e7f3ff; border-left: 4px solid #65d9ff; padding: 12px; margin: 15px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Suscripción Cancelada</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>Tu suscripción a Future Task ha sido cancelada. Aquí te mostramos qué cambió:</p>
            
            <div class="warning">
              <strong>Razón:</strong> ${cancelReason}
            </div>
            
            <div class="info-box">
              <strong>Cambios en tu cuenta:</strong><br>
              ✗ Acceso a características premium removido<br>
              ✗ Créditos mensuales: 0<br>
              ✓ Acceso gratuito aún disponible<br>
              ✓ Tus datos se conservan
            </div>
            
            <p>¿Qué puedes hacer ahora?</p>
            <ul>
              <li><strong>Actualiza tu método de pago:</strong> Si fue un error, actualiza tu tarjeta en PayPal y reinicia tu suscripción</li>
              <li><strong>Continúa gratis:</strong> Usa Future Task sin límites con el plan gratuito</li>
              <li><strong>Reactiva premium:</strong> Cuando quieras, puedes reactivar tu suscripción</li>
            </ul>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://future-task.com'}/app/subscription" class="button">Ver Opciones de Suscripción</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://future-task.com'}/app/settings" class="button-secondary">Gestionar Cuenta</a>
            </div>
            
            <p>Si tienes preguntas sobre la cancelación, contáctanos en support@example.com</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Future Task. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "Tu suscripción a Future Task ha sido cancelada",
      html: htmlContent,
    })
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error sending subscription cancelled email:", error)
    throw error
  }
}
