# 🚀 SETUP RÁPIDO - Emails en Supabase

## ⚡ TL;DR (30 segundos)

Tu código YA FUNCIONA. Solo debes hacer esto en Supabase:

### 1. **URLs** (1 minuto)
\`\`\`
Project Settings → Auth → URL Configuration

Site URL: https://future-task.com

Redirect URLs:
https://future-task.com/auth/callback
https://future-task.com/reset-password
\`\`\`

### 2. **Email Provider** (2 minutos)
- Opción A: **SMTP** (SendGrid/Mailgun) → Mejor
- Opción B: **Email Services** de Supabase (limitado)

### 3. **Templates** (5 minutos)
Ve a Auth → Email Templates

- **Confirm Signup:** Copia el HTML de `SUPABASE_EMAIL_CONFIGURATION.md`
- **Reset Password:** Copia el HTML de `SUPABASE_EMAIL_CONFIGURATION.md`

---

## ✅ Qué he arreglado en el código:

| Feature | Estado |
|---------|--------|
| Página `/auth/callback` | ✅ Creada |
| Route forgot-password | ✅ Usa `resetPasswordForEmail()` |
| Página `/reset-password` | ✅ Usa token de Supabase |
| Notificaciones calendario | ✅ Autenticación arreglada |

---

## 🎯 Flujos que funcionan:

### 📝 Registro + Confirmación
\`\`\`
Signup → Email confirmación → Clic → /auth/callback → Dashboard
\`\`\`

### 🔑 Recuperar Contraseña
\`\`\`
Forgot Password → Email reset → Clic → /reset-password → Cambiar → Dashboard
\`\`\`

---

## ⚠️ Importante

**NO** necesitas hacer nada más en el código. Solo configura Supabase.

Lee el archivo completo: `/docs/SUPABASE_EMAIL_CONFIGURATION.md`
