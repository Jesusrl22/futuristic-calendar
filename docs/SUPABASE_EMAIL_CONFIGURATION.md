# Configuración de Supabase para Emails (Confirmación y Reset de Contraseña)

## 📌 IMPORTANTE
Tu app ya está lista en el código. Ahora SOLO falta configurar Supabase para enviar los emails.

---

## ✅ PASO 1: URLs de Configuración

Ve a tu dashboard de Supabase → **Project Settings** → **Auth** → **URL Configuration**

### Configura estas URLs:

1. **Site URL**
   \`\`\`
   https://future-task.com
   \`\`\`
   (O tu dominio actual en desarrollo: `http://localhost:3000`)

2. **Redirect URLs** (copia y pega EXACTAMENTE):
   \`\`\`
   https://future-task.com/auth/callback
   https://future-task.com/reset-password
   http://localhost:3000/auth/callback
   http://localhost:3000/reset-password
   \`\`\`

---

## 📧 PASO 2: Configurar Email Templates

### 📨 Template 1: CONFIRMACIÓN DE REGISTRO

Ve a **Auth** → **Email Templates** → **Confirm Signup**

**Asunto:**
\`\`\`
Confirma tu cuenta en Future Task
\`\`\`

**Plantilla HTML:**
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
      
      <p style="color: #999; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
        O copia y pega este enlace en tu navegador:<br/>
        {{ .ConfirmationURL }}
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Future Task<br/>
        Organiza tu tiempo. Mejora tu enfoque.
      </p>
      
    </div>
  </body>
</html>
\`\`\`

---

### 🔑 Template 2: RECUPERAR CONTRASEÑA

Ve a **Auth** → **Email Templates** → **Reset Password**

**Asunto:**
\`\`\`
Restablece tu contraseña en Future Task
\`\`\`

**Plantilla HTML:**
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
      
      <p style="color: #999; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
        O copia y pega este enlace en tu navegador:<br/>
        {{ .RecoveryURL }}
      </p>
      
      <p style="color: #ff6b6b; font-size: 13px; margin-bottom: 20px;">
        ⚠️ Este enlace es válido por 24 horas solamente.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Si no solicitaste cambiar tu contraseña, puedes ignorar este correo. Tu cuenta está segura.
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Future Task<br/>
        Tu productividad, bajo control.
      </p>
      
    </div>
  </body>
</html>
\`\`\`

---

## 🌐 PASO 3: Configurar el Provider de Email

### Opción A: SMTP Personalizado (Recomendado)

Si tienes un proveedor SMTP (SendGrid, Mailgun, Gmail, etc.):

1. Ve a **Project Settings** → **Email** → **SMTP Settings**
2. **Enable Custom SMTP**
3. Rellena:
   - **Sender Name:** `Future Task`
   - **Sender Email:** `support@future-task.com`
   - **SMTP Host:** (de tu proveedor)
   - **SMTP Port:** `587` (o `465`)
   - **SMTP User:** (credenciales)
   - **SMTP Password:** (credenciales)
   - **Encryption:** `TLS` (o `SSL`)

### Opción B: Email Supabase (Limitado)

Si no tienes SMTP configurado, Supabase tiene límites:
1. Ve a **Project Settings** → **Email**
2. Verifica que **Enable Email Services** está ON
3. Esto solo funciona para confirmación automática (limitado)

---

## 🔄 PASO 4: Verificar que funciona

### Prueba de Confirmación de Registro:
1. Ve a `https://future-task.com/signup`
2. Regístrate con un email real
3. Revisa tu email → deberías recibir "Confirma tu cuenta en Future Task"
4. Haz clic en "Confirmar mi cuenta"
5. Deberías ser redirigido a `/auth/callback` → `/app`

### Prueba de Reset de Contraseña:
1. Ve a `https://future-task.com/forgot-password`
2. Ingresa tu email
3. Revisa tu email → deberías recibir "Restablece tu contraseña en Future Task"
4. Haz clic en "Cambiar mi contraseña"
5. Deberías ver la página de `/reset-password`
6. Ingresa nueva contraseña → se actualiza
7. Redirigido a `/app`

---

## 🚨 Si los emails NO llegan

### Checklist:

✅ **¿Está habilitado "Enable Email Services"?**
- Ve a Project Settings → Email → On/Off

✅ **¿Tienes SMTP configurado?**
- Si no, ve a Opción B arriba

✅ **¿Las URLs están configuradas?**
- Site URL debe ser tu dominio
- Redirect URLs deben tener `/auth/callback` y `/reset-password`

✅ **¿Estás usando un email real en el formulario?**
- Los emails a `test@test.com` podrían no funcionar

✅ **¿Has esperado 2-3 minutos?**
- Supabase puede tardar un poco

✅ **¿Revisaste SPAM?**
- A veces los emails automáticos van a Spam

---

## 📋 Checklist Final

- [ ] Site URL configurada
- [ ] Redirect URLs añadidas (`/auth/callback`, `/reset-password`)
- [ ] Template de Confirmación configurado
- [ ] Template de Reset de Contraseña configurado
- [ ] SMTP habilitado (o Email Services)
- [ ] Email sender establecido a `support@future-task.com`
- [ ] Probé registro y recibí email de confirmación
- [ ] Probé forgot-password y recibí email de reset

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs de Supabase → Auth → Users (verifica intentos)
2. Revisa tu email SPAM/Promotions
3. Prueba con un email real (no de prueba)
4. Asegúrate de tener SMTP funcionando

**¡Debería funcionar! 🚀**
