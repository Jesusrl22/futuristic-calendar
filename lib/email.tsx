import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "support@future-task.com",
      to: email,
      subject: "Welcome to Future Task! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #84fab0; font-size: 32px; margin-bottom: 10px;">Future Task</h1>
            <p style="color: #666; font-size: 16px;">Smart Task Management Platform</p>
          </div>
          
          <div style="background: #f5f5f5; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Welcome, ${name}! 👋</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for creating an account with Future Task. We're excited to help you boost your productivity!
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Your account has been successfully created and you can now access all features:
            </p>
            
            <ul style="color: #666; line-height: 1.8;">
              <li>📅 Full calendar access</li>
              <li>✅ Unlimited tasks</li>
              <li>📝 Notes & wishlist</li>
              <li>⏰ Pomodoro timer</li>
              <li>🎨 Multiple themes</li>
            </ul>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://future-task.com"}/app" 
                 style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>Need help? Contact us at <a href="mailto:support@future-task.com" style="color: #84fab0;">support@future-task.com</a></p>
            <p>© 2025 Future Task. All rights reserved.</p>
          </div>
        </div>
      `,
    })
    console.log("[SERVER][v0] Welcome email sent to:", email)
    return { success: true }
  } catch (error) {
    console.error("[SERVER][v0] Failed to send welcome email:", error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://future-task.com"}/reset-password?token=${resetToken}`

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "support@future-task.com",
      to: email,
      subject: "Reset Your Password - Future Task",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #84fab0; font-size: 32px; margin-bottom: 10px;">Future Task</h1>
            <p style="color: #666; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="background: #f5f5f5; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password 🔐</h2>
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
            
            <p style="color: #999; line-height: 1.6; font-size: 12px; margin-top: 20px;">
              Or copy and paste this URL into your browser:<br>
              <span style="color: #84fab0;">${resetUrl}</span>
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>Need help? Contact us at <a href="mailto:support@future-task.com" style="color: #84fab0;">support@future-task.com</a></p>
            <p>© 2025 Future Task. All rights reserved.</p>
          </div>
        </div>
      `,
    })
    console.log("[SERVER][v0] Password reset email sent to:", email)
    return { success: true }
  } catch (error) {
    console.error("[SERVER][v0] Failed to send password reset email:", error)
    return { success: false, error }
  }
}
