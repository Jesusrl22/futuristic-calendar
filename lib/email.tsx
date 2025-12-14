export async function sendWelcomeEmail(to: string, name?: string) {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !process.env.SMTP_FROM
    ) {
      console.error(
        "[v0] Missing SMTP configuration. Please configure: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM",
      )
      throw new Error("SMTP not configured")
    }

    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://future-task.com"

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Future Task</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px; text-align: center;">
              <h1 style="color: white; margin: 0 0 20px 0; font-size: 32px;">Welcome to Future Task!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0 0 30px 0;">
                ${name ? `Hi ${name},` : "Hello,"} your account has been successfully created.
              </p>
              <a href="${appUrl}/app" style="display: inline-block; background-color: white; color: #667eea; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Get Started
              </a>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #1e293b; border-radius: 8px;">
              <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">What you can do with Future Task:</p>
              <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                <li>Manage your tasks and stay organized</li>
                <li>Track time with the Pomodoro timer</li>
                <li>Keep notes and ideas in one place</li>
                <li>View your productivity statistics</li>
              </ul>
            </div>
            <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
              <p>Need help? Contact us at ${process.env.SMTP_FROM}</p>
              <p>&copy; 2025 Future Task. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Welcome to Future Task!

${name ? `Hi ${name},` : "Hello,"} your account has been successfully created.

Get started now: ${appUrl}/app

What you can do with Future Task:
- Manage your tasks and stay organized
- Track time with the Pomodoro timer
- Keep notes and ideas in one place
- View your productivity statistics

Need help? Contact us at ${process.env.SMTP_FROM}

© 2025 Future Task. All rights reserved.
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Welcome to Future Task!",
      text: textContent,
      html: htmlContent,
    })

    console.log("[v0] Welcome email sent successfully to:", to)
  } catch (error) {
    console.error("[v0] Error sending welcome email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !process.env.SMTP_FROM
    ) {
      console.error(
        "[v0] Missing SMTP configuration. Please configure: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM",
      )
      throw new Error("SMTP not configured")
    }

    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://future-task.com"
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px; text-align: center;">
              <h1 style="color: white; margin: 0 0 20px 0; font-size: 28px;">Reset Your Password</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0 0 30px 0;">
                You requested to reset your password. Click the button below to proceed.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background-color: white; color: #667eea; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #1e293b; border-radius: 8px;">
              <p style="color: #cbd5e1; margin: 0; font-size: 14px;">
                This link will expire in 1 hour. If you didn't request this, please ignore this email.
              </p>
            </div>
            <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
              <p>&copy; 2025 Future Task. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
Reset Your Password

You requested to reset your password. Visit the following link to proceed:

${resetUrl}

This link will expire in 1 hour. If you didn't request this, please ignore this email.

© 2025 Future Task. All rights reserved.
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Reset Your Password - Future Task",
      text: textContent,
      html: htmlContent,
    })

    console.log("[v0] Password reset email sent successfully to:", to)
  } catch (error) {
    console.error("[v0] Error sending password reset email:", error)
    throw error
  }
}

export async function sendTeamInvitationEmail(to: string, token: string, teamName: string, inviterName: string) {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !process.env.SMTP_FROM
    ) {
      console.error(
        "[v0] Missing SMTP configuration. Please configure: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM",
      )
      throw new Error("SMTP not configured")
    }

    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://future-task.com"
    const inviteUrl = `${appUrl}/invite/${token}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Invitation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px; text-align: center;">
              <h1 style="color: white; margin: 0 0 20px 0; font-size: 28px;">You've Been Invited!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0 0 10px 0;">
                <strong>${inviterName}</strong> has invited you to join
              </p>
              <p style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 30px 0;">
                ${teamName}
              </p>
              <a href="${inviteUrl}" style="display: inline-block; background-color: white; color: #667eea; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Accept Invitation
              </a>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #1e293b; border-radius: 8px;">
              <p style="color: #cbd5e1; margin: 0 0 10px 0; font-size: 14px;">
                Join your team on Future Task and start collaborating on:
              </p>
              <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                <li>Shared tasks and projects</li>
                <li>Team calendar and events</li>
                <li>Collaborative notes</li>
                <li>Team productivity statistics</li>
              </ul>
              <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 12px;">
                This invitation will expire in 7 days.
              </p>
            </div>
            <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
              <p>&copy; 2025 Future Task. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
You've Been Invited!

${inviterName} has invited you to join "${teamName}" on Future Task.

Accept your invitation here:
${inviteUrl}

Join your team and start collaborating on:
- Shared tasks and projects
- Team calendar and events
- Collaborative notes
- Team productivity statistics

This invitation will expire in 7 days.

© 2025 Future Task. All rights reserved.
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `You've been invited to join ${teamName} on Future Task`,
      text: textContent,
      html: htmlContent,
    })

    console.log("[v0] Team invitation email sent successfully to:", to)
  } catch (error) {
    console.error("[v0] Error sending team invitation email:", error)
    throw error
  }
}
