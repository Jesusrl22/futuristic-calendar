# Configurar Reseteo de Contraseña en Supabase

## Problema
Los correos de reseteo de contraseña no se envían correctamente.

## Solución

### Paso 1: Verificar Configuración de Email en Supabase

1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. Ve a **Authentication** → **Email Templates**
3. Verifica que estas plantillas estén habilitadas:
   - ✓ Confirm signup (debe estar ON)
   - ✓ Invite user (debe estar ON)
   - ✓ Magiclink (opcional)
   - ✓ Change email address (debe estar ON)
   - ✓ Reset Password (DEBE ESTAR ON - esto es lo importante)

### Paso 2: Configurar Plantilla de Reset Password

Si tienes SMTP personalizado (SendGrid, Resend, etc):

1. En Supabase Dashboard:
   - Ve a **Authentication** → **Email Templates**
   - Busca "Reset Password" template
   - Personaliza el contenido si deseas
   - IMPORTANTE: Asegúrate que el token `{{ .ConfirmationURL }}` esté en el email

2. Si usas el email predeterminado de Supabase:
   - La plantilla ya está configurada
   - Solo necesitas asegurar que Email Auth esté habilitado

### Paso 3: Prueba el Flujo Completo

1. **Solicitar Reset:**
   \`\`\`bash
   curl -X POST http://localhost:3000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   \`\`\`

2. **Verifica tu consola de Supabase:**
   - Ve a **Logs** → **Auth Logs**
   - Deberías ver un evento de "send_email" o similar

3. **Revisa tu bandeja de entrada** (o spam)

### Paso 4: Si Aún No Funciona

**Opción A: Verificar logs**
\`\`\`sql
-- En SQL Editor de Supabase:
SELECT * FROM auth.audit_log_entries 
WHERE event = 'mail_send' 
ORDER BY created_at DESC 
LIMIT 10;
\`\`\`

**Opción B: Verificar configuración SMTP**
- Ve a **Authentication** → **Providers** → **Email**
- Si ves "Supabase Email", está usando el servicio predeterminado ✓
- Si ves un proveedor personalizado (SendGrid, etc), verifica credenciales

**Opción C: Habilitar "Email Auth"**
1. Ve a **Authentication** → **Providers**
2. Asegúrate que "Email" esté habilitado (ON)
3. Haz clic en el ícono de engranaje para ver configuración

### Paso 5: Variables de Entorno Necesarias

En tu Vercel/proyecto, asegúrate de tener:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000  # o tu URL de producción
\`\`\`

## Flujo de Funcionamiento

\`\`\`
Usuario hace clic "Olvidé contraseña"
    ↓
Ingresa email → POST /api/auth/forgot-password
    ↓
Backend: supabase.auth.resetPasswordForEmail()
    ↓
Supabase genera token + envía email
    ↓
Email contiene: https://app.com/reset-password?access_token=...&type=recovery
    ↓
Usuario hace clic en link
    ↓
Página carga con token en URL
    ↓
Usuario ingresa nueva contraseña 2 veces
    ↓
JavaScript: supabase.auth.updateUser({ password })
    ↓
Contraseña se actualiza en BD
    ↓
Redirige a /login
    ↓
Usuario puede loguear con nueva contraseña ✓
\`\`\`

## Debugging

Si recibes errores, agrega estos logs:

\`\`\`typescript
// En /app/api/auth/forgot-password/route.ts
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
})

if (error) {
  console.error("[v0] Error details:", {
    message: error.message,
    status: error.status,
    code: error.code,
  })
}
\`\`\`

Si error.code es `"email_disabled"` → Email Auth no está habilitado en Supabase
Si error.message contiene `SMTP` → Problema con tu proveedor de email
Si no hay error pero no llega email → Revisar carpeta SPAM o logs de Supabase
