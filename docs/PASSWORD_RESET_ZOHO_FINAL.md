# ✅ Sistema de Reset de Contraseña - CONFIGURACIÓN ZOHO SMTP

## 📋 Resumen de Cambios

Se ha implementado un sistema completo de reset de contraseña usando tu servidor SMTP de Zoho en lugar de depender de Supabase.

### Archivos Actualizados:

1. **`/app/api/auth/forgot-password/route.ts`**
   - Usa nodemailer para conectar directamente a Zoho SMTP
   - Genera tokens aleatorios seguros (32 bytes)
   - Guarda el token en la BD con expiración de 1 hora
   - Envía email HTML profesional

2. **`/app/api/auth/reset-password/route.ts`**
   - Valida que el token exista y no haya expirado
   - Actualiza la contraseña en Supabase Auth
   - Limpia el token después del uso

3. **Base de Datos**
   - Se ejecutó migración para agregar campos:
     - `reset_token` (varchar)
     - `reset_token_expires` (timestamp)

## 🔧 VARIABLES DE ENTORNO REQUERIDAS

Agrega estas en tu proyecto Vercel o en `.env.local`:

\`\`\`env
# Configuración SMTP de Zoho
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu_email@tudominio.com
SMTP_PASSWORD=tu_contraseña_app_zoho
SMTP_FROM=tu_email@tudominio.com

# URL de la app (importante para los links en emails)
NEXT_PUBLIC_APP_URL=https://tudominio.com
\`\`\`

## 📧 ¿Cómo obtener SMTP_PASSWORD?

1. Abre https://mail.zoho.eu/u/security
2. Ve a "Connected Devices"
3. Haz clic en "Generate new app password"
4. Selecciona:
   - App type: Mail
   - Device: Other
   - Device name: Calendario App
5. Copia la contraseña generada (esta es tu `SMTP_PASSWORD`)

## 🧪 Cómo Probar

### Opción 1: Usar el formulario
1. Ve a `/forgot-password`
2. Ingresa el email de un usuario existente
3. Revisa tu bandeja en Zoho Mail
4. Deberías recibir el email con el link de reset

### Opción 2: Desde terminal (si tienes variables de entorno)
\`\`\`bash
chmod +x scripts/test-zoho-smtp.sh
./scripts/test-zoho-smtp.sh
\`\`\`

### Opción 3: Con curl
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com"}'
\`\`\`

## 📧 Flujo Completo de Usuario

\`\`\`
1. Usuario hace clic en "Olvidé contraseña" (/forgot-password)
   ↓
2. Ingresa su email registrado
   ↓
3. API genera token único: resetToken = crypto.randomBytes(32).toString('hex')
   ↓
4. Token se guarda en BD: users.reset_token + users.reset_token_expires (1 hora)
   ↓
5. Email se envía vía Zoho SMTP:
   - From: tu_email@tudominio.com
   - To: usuario@ejemplo.com
   - Link: https://tudominio.com/reset-password?token=abc123xyz...
   ↓
6. Usuario recibe email y hace clic en link
   ↓
7. Va a /reset-password?token=abc123xyz
   ↓
8. Ingresa nueva contraseña (mínimo 6 caracteres)
   ↓
9. API valida:
   - ¿Token existe en BD?
   - ¿No ha expirado?
   ↓
10. Si es válido:
    - Actualiza password en Supabase Auth
    - Limpia tokens de la BD
    - Usuario ve "Éxito"
    ↓
11. Usuario puede loguearse con nueva contraseña
\`\`\`

## 🛡️ Seguridad Implementada

✅ **Tokens Únicos**: Generados con 32 bytes de aleatoriedad criptográfica
✅ **Expiración**: Los tokens vencen en 1 hora
✅ **No Enumeration**: No se revela si un email existe (protección contra ataques)
✅ **Contraseña Segura**: No se envía por email, solo el link
✅ **Limpieza**: Los tokens se eliminan después de usar
✅ **HTTPS**: Los links se envían solo si `NEXT_PUBLIC_APP_URL` usa HTTPS

## ⚠️ Troubleshooting

### ❌ "Invalid login credentials"
- Verifica `SMTP_USER` y `SMTP_PASSWORD`
- Usa la contraseña de APP, no tu contraseña normal de Zoho

### ❌ "connect ECONNREFUSED"
- Verifica: `SMTP_HOST=smtp.zoho.eu` (exacto)
- Verifica: `SMTP_PORT=465` (no 587, debe ser SSL)

### ❌ No recibo emails
- Revisa carpeta de SPAM
- Verifica que el usuario exista en la BD
- Verifica que `SMTP_FROM` sea tu email verificado

### ❌ "Token inválido o expirado"
- El link puede tener más de 1 hora
- Solicita un nuevo reset
- Verifica que `NEXT_PUBLIC_APP_URL` sea correcta

## 📍 URLs Importantes

- Solicitar reset: `GET /forgot-password`
- API forgot: `POST /api/auth/forgot-password`
- Página reset: `GET /reset-password?token=XXX`
- API reset: `POST /api/auth/reset-password`

## ✨ Próximos Pasos

1. ✅ Configura las variables de entorno en Vercel
2. ✅ Prueba el formulario de forgot-password
3. ✅ Recibe el email y haz clic en el link
4. ✅ Restablece tu contraseña
5. ✅ Inicia sesión con la nueva contraseña

## 📚 Documentación Completa

Ver: `/docs/ZOHO_SMTP_SETUP.md`

---

¿Necesitas ayuda con algo? Los logs te mostrarán exactamente qué está pasando.
