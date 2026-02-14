import nodemailer from "nodemailer"

// Verificar si SMTP está configurado
export function isSMTPConfigured(): boolean {
  const configured = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  )
  
  console.log("[EMAIL] Verificando configuración SMTP:", {
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_FROM: !!process.env.SMTP_FROM,
    configured,
  })
  
  return configured
}

// Crear transporter solo si las variables están configuradas
function createTransporter() {
  if (!isSMTPConfigured()) {
    const error = "SMTP no configurado. Configura SMTP_HOST, SMTP_USER, SMTP_PASSWORD en las variables de entorno"
    console.error("[EMAIL] ❌", error)
    console.error("[EMAIL] Variables actuales:", {
      SMTP_HOST: process.env.SMTP_HOST ? "✓" : "✗",
      SMTP_PORT: process.env.SMTP_PORT ? "✓" : "✗",
      SMTP_USER: process.env.SMTP_USER ? "✓" : "✗",
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? "✓" : "✗",
      SMTP_FROM: process.env.SMTP_FROM ? "✓" : "✗",
    })
    throw new Error(error)
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10)
  const config = {
    host: process.env.SMTP_HOST!,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  }

  console.log("[EMAIL] ✓ Configuración SMTP:", {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user?.substring(0, 5) + "***",
  })

  return nodemailer.createTransport(config)
}

export async function sendVerificationEmail(email: string, name?: string) {
  const userName = name || email.split("@")[0]
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`

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
            <h1>Verifica tu Email</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>Gracias por crear una cuenta en Future Task. Para completar tu registro, necesitas verificar tu dirección de correo electrónico.</p>
            
            <p>Haz clic en el botón de abajo para verificar tu email:</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verificar Email</a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${verificationLink}
            </p>
            
            <div class="warning">
              <strong>Importante:</strong> Este enlace expirará en 24 horas. Si no creaste esta cuenta, por favor ignora este email.
            </div>
            
            <p>Una vez verificado, podrás iniciar sesión con tu email y contraseña.</p>
            
            <p>¿Preguntas? Contáctanos en support@example.com</p>
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
    console.log("[EMAIL] Iniciando envío de email de verificación a:", email)
    
    if (!isSMTPConfigured()) {
      console.error("[EMAIL] ❌ SMTP no configurado")
      return { 
        success: false, 
        error: "SMTP no configurado" 
      }
    }

    const transporter = createTransporter()
    
    // Verificar conexión antes de enviar
    console.log("[EMAIL] Verificando conexión SMTP...")
    try {
      await transporter.verify()
      console.log("[EMAIL] ✓ Conexión SMTP verificada")
    } catch (verifyError: any) {
      console.error("[EMAIL] ❌ Verificación SMTP fallida:", verifyError.message)
      return { success: false, error: "Conexión SMTP fallida: " + verifyError.message }
    }
    
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Verifica tu email en Future Task",
      html: htmlContent,
    })
    
    console.log("[EMAIL] ✓ Email de verificación enviado exitosamente")
    console.log("[EMAIL] Message ID:", result.messageId)
    return { success: true }
  } catch (error: any) {
    console.error("[EMAIL] ❌ Error enviando email de verificación:", error.message)
    console.error("[EMAIL] Detalles del error:", {
      code: error.code,
      command: error.command,
      message: error.message,
    })
    return { success: false, error: error.message }
  }
}

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
    if (!isSMTPConfigured()) {
      return { success: false, error: "SMTP no configurado" }
    }

    const transporter = createTransporter()
    await transporter.verify()
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Restablecer tu contraseña",
      html: htmlContent,
    })
    console.log("[EMAIL] ✓ Email de reset de contraseña enviado a:", email)
    return { success: true }
  } catch (error: any) {
    console.error("[EMAIL] ❌ Error enviando email de reset:", error.message)
    return { success: false, error: error.message }
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
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app" class="button">Ir a Mi Dashboard</a>
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
    if (!isSMTPConfigured()) {
      return { success: false, error: "SMTP no configurado" }
    }

    const transporter = createTransporter()
    await transporter.verify()
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Bienvenido a Future Task",
      html: htmlContent,
    })
    console.log("[EMAIL] ✓ Email de bienvenida enviado a:", email)
    return { success: true }
  } catch (error: any) {
    console.error("[EMAIL] ❌ Error enviando email de bienvenida:", error.message)
    return { success: false, error: error.message }
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
            
            <p>Si fuiste tú, no necesitas hacer nada. Si no reconoces este inicio de sesión, te recomendamos cambiar tu contraseña inmediatamente.</p>
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
    if (!isSMTPConfigured()) {
      return { success: false, error: "SMTP no configurado" }
    }

    const transporter = createTransporter()
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Nuevo inicio de sesión en tu cuenta",
      html: htmlContent,
    })
    console.log("[EMAIL] ✓ Email de nuevo dispositivo enviado a:", email)
    return { success: true }
  } catch (error: any) {
    console.error("[EMAIL] ❌ Error enviando email de nuevo dispositivo:", error.message)
    return { success: false, error: error.message }
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
          .footer { text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          .warning { background: #ffe7e7; border: 1px solid #ff6b6b; color: #c92a2a; padding: 12px; border-radius: 4px; margin: 15px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Suscripción Cancelada</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>Tu suscripción a Future Task ha sido cancelada.</p>
            
            <div class="warning">
              <strong>Razón:</strong> ${cancelReason}
            </div>
            
            <p>Tus datos se conservan y puedes acceder con el plan gratuito.</p>
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
    if (!isSMTPConfigured()) {
      return { success: false, error: "SMTP no configurado" }
    }

    const transporter = createTransporter()
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Tu suscripción a Future Task ha sido cancelada",
      html: htmlContent,
    })
    console.log("[EMAIL] ✓ Email de suscripción cancelada enviado a:", email)
    return { success: true }
  } catch (error: any) {
    console.error("[EMAIL] ❌ Error enviando email de suscripción cancelada:", error.message)
    return { success: false, error: error.message }
  }
}
