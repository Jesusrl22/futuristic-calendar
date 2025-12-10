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

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    console.log("[SERVER] Preparing to send welcome email to:", email)

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("[SERVER] SMTP credentials not configured, skipping email")
      return { success: false, error: "SMTP not configured" }
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Future Task</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to Future Task! 🚀</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #333333; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #666666; line-height: 1.6;">
                Thank you for joining Future Task! We're excited to help you boost your productivity and achieve your goals.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #666666; line-height: 1.6;">
                Get started with these powerful features:
              </p>
              
              <!-- Features List -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      ✅ <strong>Smart Task Management</strong> - Organize your work with priorities and due dates
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      🍅 <strong>Pomodoro Timer</strong> - Stay focused with proven time management techniques
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      📝 <strong>Notes & Calendar</strong> - Keep everything organized in one place
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      🤖 <strong>AI Assistant</strong> - Get intelligent help when you need it
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com"}/app" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      Get Started Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                Need help? Contact us at <a href="mailto:support@future-task.com" style="color: #667eea; text-decoration: none;">support@future-task.com</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © 2025 Future Task. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const textContent = `
Welcome to Future Task!

Hi ${name},

Thank you for joining Future Task! We're excited to help you boost your productivity and achieve your goals.

Get started with these powerful features:

✅ Smart Task Management - Organize your work with priorities and due dates
🍅 Pomodoro Timer - Stay focused with proven time management techniques
📝 Notes & Calendar - Keep everything organized in one place
🤖 AI Assistant - Get intelligent help when you need it

Get started: ${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com"}/app

Need help? Contact us at support@future-task.com

© 2025 Future Task. All rights reserved.
`

    const info = await transporter.sendMail({
      from: `"Future Task" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Future Task! 🚀",
      text: textContent,
      html: htmlContent,
    })

    console.log("[SERVER] Welcome email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("[SERVER] Error sending welcome email:", error)
    return { success: false, error: error.message }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    console.log("[SERVER] Preparing to send password reset email to:", email)

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("[SERVER] SMTP credentials not configured, skipping email")
      return { success: false, error: "SMTP not configured" }
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com"}/reset-password?token=${resetToken}`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Reset Your Password 🔐</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #666666; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; font-size: 14px; color: #999999; line-height: 1.6;">
                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                Need help? Contact us at <a href="mailto:support@future-task.com" style="color: #667eea; text-decoration: none;">support@future-task.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const textContent = `
Reset Your Password

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

Need help? Contact us at support@future-task.com
`

    const info = await transporter.sendMail({
      from: `"Future Task" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password - Future Task",
      text: textContent,
      html: htmlContent,
    })

    console.log("[SERVER] Password reset email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("[SERVER] Error sending password reset email:", error)
    return { success: false, error: error.message }
  }
}
