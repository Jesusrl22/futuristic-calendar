# Configuración SMTP con Zoho Mail

## 📋 Variables de Entorno Requeridas

Necesitas agregar estas variables en tu proyecto Vercel:

\`\`\`
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu_email@tudominio.com
SMTP_PASSWORD=tu_contraseña_app
SMTP_FROM=noreply@tudominio.com
NEXT_PUBLIC_APP_URL=https://tuapp.com
\`\`\`

## 🔧 Pasos para Configurar

### 1. Obtener Contraseña de Aplicación en Zoho

1. Ve a [Zoho Mail Security](https://mail.zoho.eu/u/security)
2. En la sección **Connected Devices**, haz clic en **Generate new app password**
3. Selecciona:
   - **App type**: Mail
   - **Device type**: Other
   - **Device name**: Calendario App (o tu nombre)
4. Copia la contraseña generada

### 2. Agregar Variables en Vercel

1. Ve a tu proyecto en Vercel
2. Abre **Settings → Environment Variables**
3. Agrega estas variables:

| Variable | Valor |
|----------|-------|
| `SMTP_HOST` | `smtp.zoho.eu` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | Tu email de Zoho (ej: calendario@empresa.com) |
| `SMTP_PASSWORD` | La contraseña de app generada |
| `SMTP_FROM` | Tu email de Zoho |
| `NEXT_PUBLIC_APP_URL` | Tu URL de producción (ej: https://calendario.vercel.app) |

### 3. Para Desarrollo Local

Crea o actualiza tu archivo `.env.local`:

\`\`\`
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu_email@tudominio.com
SMTP_PASSWORD=tu_contraseña_app
SMTP_FROM=tu_email@tudominio.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## ✅ Verificar la Configuración

### Test Manual

1. Ve a `/forgot-password`
2. Ingresa el email de un usuario existente
3. Revisa tu bandeja de entrada en Zoho Mail
4. Verifica que recibas el email de reset

### Logs en Consola

Cuando se envíe un email, deberías ver algo como:

\`\`\`
[v0] Email de reset enviado exitosamente: <email-id>
\`\`\`

Si hay error:

\`\`\`
[v0] Error en forgot password: [error details]
\`\`\`

## 🔍 Troubleshooting

### Error: "Invalid login credentials"
- Verifica que `SMTP_USER` y `SMTP_PASSWORD` sean correctos
- Asegúrate de usar la **contraseña de app**, no tu contraseña normal

### Error: "connect ECONNREFUSED"
- Verifica que `SMTP_HOST` sea correcto: `smtp.zoho.eu`
- Verifica que `SMTP_PORT` sea `465` (SSL)

### No recibo emails
- Revisa el spam/correo no deseado
- Verifica que `SMTP_FROM` sea tu email verificado en Zoho
- Comprueba que el usuario exista en la base de datos

## 📧 Flujo Completo

\`\`\`
1. Usuario hace clic en "Olvidé contraseña"
   ↓
2. Ingresa su email
   ↓
3. Sistema verifica que el usuario existe
   ↓
4. Sistema genera token único seguro (válido 1 hora)
   ↓
5. Token se guarda en BD con timestamp de expiración
   ↓
6. Email se envía vía SMTP a Zoho
   ↓
7. Usuario recibe email con link de reset
   ↓
8. Usuario hace clic en link y va a /reset-password?token=XXX
   ↓
9. Usuario ingresa nueva contraseña
   ↓
10. Sistema valida token (no expirado, existe)
    ↓
11. Contraseña se actualiza en Supabase Auth
    ↓
12. Token se limpia de la BD
    ↓
13. Usuario puede hacer login con nueva contraseña
\`\`\`

## 🛡️ Seguridad

✅ Implementado:
- Tokens de reset únicos y aleatorios (32 bytes)
- Expiración de token (1 hora)
- No se revela si el email existe (previene enumeration attacks)
- Contraseña no se envía por email
- Token se limpia después de usar

## 📞 Soporte Zoho

- [Documentación SMTP de Zoho](https://www.zoho.com/mail/help/zoho-mail-smtp.html)
- Email: support@zoho.com
