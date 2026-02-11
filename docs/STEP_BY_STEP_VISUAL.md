# 🎬 PASO A PASO VISUAL - Configurar Supabase

## PASO 1: URL Configuration (2 minutos)

### 1.1 Abre Supabase Dashboard
- Ve a: https://app.supabase.com
- Selecciona tu proyecto: `futuristic-calendar`

### 1.2 Project Settings
\`\`\`
Dashboard → Project Settings (⚙️ en la esquina)
\`\`\`

### 1.3 Auth → URL Configuration
\`\`\`
Left sidebar: Auth → URL Configuration
\`\`\`

### 1.4 Site URL
\`\`\`
Campo: Site URL
Valor: https://future-task.com

(En desarrollo: http://localhost:3000)

Click: Save
\`\`\`

### 1.5 Redirect URLs
\`\`\`
Campo: Redirect URLs (con botón +)

Agrega estas URLs:
✅ https://future-task.com/auth/callback
✅ https://future-task.com/reset-password
✅ http://localhost:3000/auth/callback
✅ http://localhost:3000/reset-password

Click: Save
\`\`\`

---

## PASO 2: Email Templates (5 minutos)

### 2.1 Ir a Email Templates
\`\`\`
Left sidebar: Auth → Email Templates
\`\`\`

### 2.2 Confirm Signup Template

**Busca el botón:** "Confirm Signup"

**Llena estos campos:**

1. **Subject (Asunto):**
\`\`\`
Confirma tu cuenta en Future Task
\`\`\`

2. **Template Body:**
Copia y pega esto:
\`\`\`html
<html>
  <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #333; margin-bottom: 20px;">Bienvenido a Future Task</h2>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        Gracias por registrarte en <strong>Future Task</strong>. Para confirmar tu cuenta y empezar a organizar tus tareas, haz clic en el botón de abajo:
      </p>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Confirmar mi cuenta
        </a>
      </div>
      
      <p style="color: #999; font-size: 12px; line-height: 1.6;">
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Future Task - Organiza tu tiempo. Mejora tu enfoque.
      </p>
      
    </div>
  </body>
</html>
\`\`\`

**Click:** Save

### 2.3 Reset Password Template

**Busca el botón:** "Reset Password"

**Llena estos campos:**

1. **Subject (Asunto):**
\`\`\`
Restablece tu contraseña en Future Task
\`\`\`

2. **Template Body:**
Copia y pega esto:
\`\`\`html
<html>
  <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #333; margin-bottom: 20px;">Restablecer Contraseña</h2>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Future Task</strong>. Para crear una nueva contraseña, haz clic en el botón de abajo:
      </p>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="{{ .RecoveryURL }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Cambiar mi contraseña
        </a>
      </div>
      
      <p style="color: #ff6b6b; font-size: 13px; margin-bottom: 20px;">
        ⚠️ Este enlace es válido por 24 horas solamente.
      </p>
      
      <p style="color: #999; font-size: 12px;">
        Si no solicitaste cambiar tu contraseña, puedes ignorar este correo.
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Future Task - Tu productividad, bajo control.
      </p>
      
    </div>
  </body>
</html>
\`\`\`

**Click:** Save

---

## PASO 3: Email Provider (2 minutos)

### 3.1 Email Configuration
\`\`\`
Project Settings → Email
\`\`\`

### 3.2 Opción A: SMTP (RECOMENDADO)

**¿Tienes cuenta en SendGrid, Mailgun, o similar?**

\`\`\`
1. Enable Custom SMTP: ON
2. SMTP Host: tu-proveedor.com
3. SMTP Port: 587
4. SMTP User: tu-email@example.com
5. SMTP Password: contraseña-smtp
6. Sender Email: support@future-task.com
7. Sender Name: Future Task
8. Click: Save
\`\`\`

### 3.2 Opción B: Email Services Supabase

**Si NO tienes SMTP:**

\`\`\`
1. Email Services: ON
2. Las confirmaciones funcionarán automáticamente
3. Limitado pero funciona para beta
\`\`\`

---

## PASO 4: Prueba (3 minutos)

### 4.1 Prueba Confirmación de Email

1. Abre: `https://future-task.com/signup`
   (O `http://localhost:3000/signup` en desarrollo)

2. Registrate con tu email real:
   \`\`\`
   Email: tu-email@example.com
   Password: Test1234!
   \`\`\`

3. **Revisa tu email**
   - Mira en INBOX
   - Mira en SPAM/PROMOTIONS
   - Espera 2-3 minutos

4. **Deberías recibir:**
   - Asunto: "Confirma tu cuenta en Future Task"
   - Botón: "Confirmar mi cuenta"

5. **Click en el botón**
   - Deberías ir a `/auth/callback`
   - Luego a `/app` (dashboard)
   - ✅ ¡Cuenta confirmada!

### 4.2 Prueba Reset de Contraseña

1. Abre: `https://future-task.com/forgot-password`

2. Ingresa tu email:
   \`\`\`
   Email: tu-email@example.com
   \`\`\`

3. **Revisa tu email**
   - Mira en INBOX
   - Mira en SPAM/PROMOTIONS

4. **Deberías recibir:**
   - Asunto: "Restablece tu contraseña en Future Task"
   - Botón: "Cambiar mi contraseña"

5. **Click en el botón**
   - Abre `/reset-password`
   - Ingresa nueva contraseña
   - Click "Restablecer Contraseña"
   - ✅ Redirige a `/app`

---

## ✅ Checklist Final

\`\`\`
[ ] Site URL configurada
[ ] Redirect URLs añadidas (4 URLs)
[ ] Confirm Signup template configurado
[ ] Reset Password template configurado
[ ] SMTP habilitado (o Email Services)
[ ] Sender: support@future-task.com
[ ] Prueba signup: recibí email
[ ] Prueba forgot: recibí email
[ ] Ambos flujos funcionan
\`\`\`

---

## 🆘 Si NO funcionan los emails

### Checklist de Debug:

1. **¿Esperaste 5 minutos?**
   - Supabase puede tardar

2. **¿Reviaste SPAM?**
   - A veces van a spam

3. **¿El email es REAL?**
   - test@test.com podría no recibir

4. **¿SMTP está habilitado?**
   - Project Settings → Email → Custom SMTP: ON

5. **¿Las variables están correctas?**
   - SMTP User
   - SMTP Password
   - SMTP Host
   - SMTP Port (587 o 465)

6. **¿Supabase Auth está ON?**
   - Project Settings → Auth → Authentication: ON

---

## 📞 Soporte Rápido

| Problema | Solución |
|----------|----------|
| No llegan emails | Revisa SMTP config + credentials |
| Email va a SPAM | Agrega a contactos confiables |
| Link no abre | Revisa Redirect URLs en Supabase |
| Error "Invalid token" | El token expiró (24h max) |
| Error en callback | Revisa NEXT_PUBLIC_SUPABASE_URL |

---

**¡Con esto debería funcionar todo! 🚀**

Si algo no funciona, revisa:
1. `/docs/SUPABASE_EMAIL_CONFIGURATION.md` (guía completa)
2. `/docs/CHANGES_SUMMARY.md` (qué cambié en el código)
3. Supabase Dashboard → Logs → Auth
