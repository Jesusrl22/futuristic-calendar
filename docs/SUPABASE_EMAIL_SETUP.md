# Guía: Configurar Emails en Supabase

## El Problema: No Llegan Emails

Cuando intentas usar "Olvidé mi contraseña" o confirmar la cuenta, Supabase necesita enviar emails. Por defecto, puede no estar configurado correctamente.

## Solución: Pasos para Configurar

### Opción 1: Usar el Dashboard de Supabase (Recomendado para Desarrollo)

#### 1. Ir a Email Templates

1. Abre [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a: **Authentication → Email Templates**

#### 2. Configurar "Confirm Signup"

**Para el template "Confirm Signup":**

1. Haz clic en **"Confirm Signup"**
2. Busca la sección **"Redirect URL"** o **"Link"**
3. Copia y pega esta URL exactamente:

\`\`\`
http://localhost:3000/auth/confirm?token={{ .ConfirmationURL }}
\`\`\`

O si ya tienes un dominio en producción:

\`\`\`
https://tudominio.com/auth/confirm?token={{ .ConfirmationURL }}
\`\`\`

4. Haz clic en **"Save Template"** o **"Update"**

#### 3. Configurar "Reset Password"

**Para el template "Reset Password" (Olvidé mi contraseña):**

1. Haz clic en **"Reset Password"** o **"Password Recovery"**
2. Busca la sección **"Redirect URL"**
3. Copia y pega esta URL exactamente:

\`\`\`
http://localhost:3000/auth/reset?token={{ .RecoveryURL }}
\`\`\`

O en producción:

\`\`\`
https://tudominio.com/auth/reset?token={{ .RecoveryURL }}
\`\`\`

4. Haz clic en **"Save Template"** o **"Update"**

### Opción 2: Configurar SMTP Externo (Recomendado para Producción)

Supabase tiene límites de emails diarios. Para producción, usa un proveedor SMTP:

#### Usando SendGrid (Recomendado)

1. Crea una cuenta gratis en [SendGrid](https://sendgrid.com)
2. Obtén tu **API Key** (Settings → API Keys)
3. En Supabase Dashboard → Project Settings → Email:
   - Proveedor: **SMTP**
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `tu_api_key_aqui`
   - From Email: `noreply@tudominio.com`
   - From Name: `Tu App`

#### Usando AWS SES

1. Configura AWS SES en tu región
2. Verifica tu dominio de email
3. Obtén credenciales SMTP desde AWS
4. En Supabase Dashboard:
   - Proveedor: **SMTP**
   - Host: `email-smtp.us-east-1.amazonaws.com` (tu región)
   - Port: `587`
   - Username: Tu username de SES
   - Password: Tu password de SES

### Opción 3: Usar el Servidor de Emails de Supabase (Default)

Si no configuras nada personalizado, Supabase usa su propio servidor. Esto funciona pero:
- Puede ser lento (hasta 1 minuto)
- Tiene límites diarios
- No es ideal para producción

## Verificar que Está Funcionando

### Test 1: Desde la Interfaz

1. Ve a tu aplicación
2. Intenta **"Olvidé mi contraseña"**
3. Espera **2-5 minutos** (los emails pueden tardarse)
4. Revisa tu email (incluyendo Spam/Basura)

### Test 2: Ver Logs en Supabase

1. Ve a Supabase Dashboard → Logs
2. Busca errores de email (keyword: "email")
3. Si ves errores, revisa la causa

## Troubleshooting: Si No Llegan Emails

### Problema 1: Email en Spam

**Solución:**
- Añade el email de tu app a contactos
- Revisa las reglas de filtro

### Problema 2: Template URLs Incorrectas

**Revisa:**
\`\`\`
Authentication → Email Templates

Confirm Signup → Redirect URL debe ser:
http://localhost:3000/auth/confirm?token={{ .ConfirmationURL }}

Reset Password → Redirect URL debe ser:
http://localhost:3000/auth/reset?token={{ .RecoveryURL }}
\`\`\`

### Problema 3: SMTP No Funciona

**Revisa:**
- Credenciales SMTP correctas
- Puerto correcto (587 o 465)
- El dominio de "From" está verificado

### Problema 4: Límite de Emails Excedido

**Solución:**
- Espera 24 horas
- O usa SMTP externo (SendGrid, AWS SES)

## URLs Correctas para tu Aplicación

Cuando estés en desarrollo:
\`\`\`
Confirm Signup: http://localhost:3000/auth/confirm?token={{ .ConfirmationURL }}
Reset Password: http://localhost:3000/auth/reset?token={{ .RecoveryURL }}
\`\`\`

Cuando despliegues a producción:
\`\`\`
Confirm Signup: https://tudominio.com/auth/confirm?token={{ .ConfirmationURL }}
Reset Password: https://tudominio.com/auth/reset?token={{ .RecoveryURL }}
\`\`\`

## Ejemplos de Proveedores SMTP

| Proveedor | Costo | Ventajas | Desventajas |
|-----------|-------|----------|-------------|
| SendGrid | $0-99/mes | Fácil, confiable, gratis hasta 100/día | Requiere cuenta |
| AWS SES | $0.10 por 1000 | Muy barato, escalable | Requiere AWS account |
| Mailgun | $0-35/mes | Good docs, flexible | Requiere cuenta |
| Supabase Default | Incluido | Sin configuración | Lento, límites bajos |

## Referencia de Variables en Templates

Supabase usa estas variables en los templates:

- `{{ .ConfirmationURL }}` - URL completa para confirmar email
- `{{ .RecoveryURL }}` - URL completa para reset de contraseña
- `{{ .Email }}` - Email del usuario
- `{{ .ConfirmationLink }}` - Solo el link (sin protocolo)
- `{{ .RecoveryLink }}` - Solo el link (sin protocolo)

Nuestras páginas usan:
- `/app/auth/confirm` - Para confirmación de email
- `/app/auth/reset` - Para reset de contraseña

Ambas soportan multiidioma automáticamente.

## Support

Si aún tienes problemas:

1. Revisa los logs en Supabase Dashboard → Logs
2. Verifica que el email sea correcto
3. Usa un cliente SMTP (SendGrid, AWS SES)
4. Abre un ticket en [Supabase Support](https://supabase.com/support)
