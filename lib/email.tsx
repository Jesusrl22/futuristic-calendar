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
