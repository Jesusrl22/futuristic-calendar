import nodemailer from "nodemailer"

// Create reusable transporter using SMTP transport
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error("[EMAIL] Missing SMTP configuration. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD")
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "465"),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      return { success: false, error: "SMTP not configured" }
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Welcome to Future Task! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Future Task</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff;">
                          Welcome to Future Task
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">
                          Hi ${name}! 👋
                        </h2>
                        
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                          Thank you for creating your account! We're excited to have you on board.
                        </p>
                        
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                          With Future Task, you can:
                        </p>
                        
                        <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #e0e0e0;">
                          <li>📝 Manage your tasks efficiently</li>
                          <li>📅 Organize your calendar</li>
                          <li>⏱️ Track time with Pomodoro timer</li>
                          <li>🤖 Get AI assistance for productivity</li>
                          <li>📊 View detailed statistics</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com"}/app" 
                             style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            Get Started
                          </a>
                        </div>
                        
                        <p style="margin: 30px 0 0; padding-top: 30px; border-top: 1px solid #333; font-size: 14px; color: #888;">
                          Need help? Contact us at 
                          <a href="mailto:support@future-task.com" style="color: #667eea; text-decoration: none;">support@future-task.com</a>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px; text-align: center; background-color: #0a0a0a; border-top: 1px solid #333;">
                        <p style="margin: 0; font-size: 12px; color: #666;">
                          © ${new Date().getFullYear()} Future Task. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Hi ${name}!

Thank you for creating your account with Future Task! We're excited to have you on board.

With Future Task, you can:
- Manage your tasks efficiently
- Organize your calendar
- Track time with Pomodoro timer
- Get AI assistance for productivity
- View detailed statistics

Get started: ${process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com"}/app

Need help? Contact us at support@future-task.com

© ${new Date().getFullYear()} Future Task. All rights reserved.
      `.trim(),
    }

    await transporter.sendMail(mailOptions)
    console.log("[EMAIL] Welcome email sent successfully to:", email)
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error sending welcome email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      return { success: false, error: "SMTP not configured" }
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com"}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password - Future Task",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                          Reset Your Password
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                          We received a request to reset your password for your Future Task account.
                        </p>
                        
                        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                          Click the button below to reset your password. This link will expire in 1 hour.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${resetUrl}" 
                             style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            Reset Password
                          </a>
                        </div>
                        
                        <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #888;">
                          If you didn't request a password reset, you can safely ignore this email.
                        </p>
                        
                        <p style="margin: 20px 0 0; padding-top: 30px; border-top: 1px solid #333; font-size: 14px; color: #888;">
                          Need help? Contact us at 
                          <a href="mailto:support@future-task.com" style="color: #667eea; text-decoration: none;">support@future-task.com</a>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px; text-align: center; background-color: #0a0a0a; border-top: 1px solid #333;">
                        <p style="margin: 0; font-size: 12px; color: #666;">
                          © ${new Date().getFullYear()} Future Task. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Reset Your Password

We received a request to reset your password for your Future Task account.

Click the link below to reset your password (expires in 1 hour):
${resetUrl}

If you didn't request a password reset, you can safely ignore this email.

Need help? Contact us at support@future-task.com

© ${new Date().getFullYear()} Future Task. All rights reserved.
      `.trim(),
    }

    await transporter.sendMail(mailOptions)
    console.log("[EMAIL] Password reset email sent successfully to:", email)
    return { success: true }
  } catch (error) {
    console.error("[EMAIL] Error sending password reset email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
