# Guía Rápida: Correos y Notificaciones

## 🚀 Test Rápido

### 1. Accede a la página de test
```
https://tu-app.vercel.app/test-config
```

O ejecuta el endpoint directamente:
```bash
curl https://tu-app.vercel.app/api/test-config
```

Esto verificará automáticamente:
- ✅ Variables de entorno
- ✅ Conexión a Supabase
- ✅ Configuración SMTP
- ✅ VAPID keys

---

## 📧 Configurar Correos (SMTP)

### Opción 1: Zoho Mail (Recomendado)

#### Paso 1: Crear App Password en Zoho
1. Ve a https://accounts.zoho.eu/home
2. Seguridad → App Passwords
3. Crea una nueva contraseña de aplicación
4. Copia la contraseña generada

#### Paso 2: Configura las variables en Vercel
```env
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu-email@tudominio.com
SMTP_PASSWORD=la_app_password_que_copiaste
SMTP_FROM=tu-email@tudominio.com
```

### Opción 2: Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu_app_password_de_gmail
SMTP_FROM=tu-email@gmail.com
```

**Nota**: En Gmail necesitas habilitar "App Passwords" en la configuración de seguridad.

### Opción 3: Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASSWORD=tu_contraseña
SMTP_FROM=tu-email@outlook.com
```

---

## 🔔 Configurar Notificaciones Push

### Paso 1: Generar VAPID Keys

Ejecuta este comando en tu terminal local:
```bash
npx web-push generate-vapid-keys
```

Obtendrás algo como:
```
=======================================

Public Key:
BNxN8fVYYYqF3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ...

Private Key:
cqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYq...

=======================================
```

### Paso 2: Configura las variables en Vercel

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BNxN8fVYYYqF3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ...
VAPID_PRIVATE_KEY=cqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYq...
VAPID_SUBJECT=mailto:support@futuretask.app
```

**Importante**: 
- La pública debe tener el prefijo `NEXT_PUBLIC_` 
- La privada NO debe tener ese prefijo
- NUNCA compartas la clave privada

---

## ✅ Verificar que Funciona

### Test de Correos

1. **Signup**: Crea una nueva cuenta
   - Deberías recibir un email de verificación
   - Si no lo recibes, revisa la consola de Vercel para ver los logs

2. **Password Reset**: Solicita reset de contraseña
   - Deberías recibir un email con el link

3. **Logs**: Revisa los logs en Vercel
   ```
   [EMAIL] ✓ Email de verificación enviado exitosamente a: email@example.com
   ```

### Test de Notificaciones

1. **Accede a la app** y habilita notificaciones
2. **Crea una tarea** con recordatorio
3. **Espera** a que llegue la notificación

---

## 🐛 Troubleshooting

### Los correos no se envían

**Síntoma**: En los logs ves:
```
[EMAIL] ❌ Variables SMTP no configuradas
```

**Solución**:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Asegúrate de tener TODAS las variables:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASSWORD
   - SMTP_FROM

4. **Redeploy** la aplicación después de añadir variables

### Las notificaciones no llegan

**Síntoma**: En los logs ves:
```
[WEBPUSH] ❌ VAPID keys no configuradas
```

**Solución**:
1. Genera las VAPID keys: `npx web-push generate-vapid-keys`
2. Añádelas en Vercel Environment Variables
3. **Redeploy** la aplicación
4. Habilita notificaciones en el navegador de nuevo

### Error de autenticación SMTP

**Síntoma**:
```
[EMAIL] ❌ Error: Invalid login
```

**Soluciones**:
- **Zoho**: Asegúrate de usar App Password, NO tu contraseña normal
- **Gmail**: Habilita "App Passwords" en seguridad de Google
- **Outlook**: Verifica que el puerto sea 587

---

## 📊 Códigos de Estado

Cuando ejecutes `/api/test-config`, verás:

- `✓ Configurado` = Todo bien
- `✗ No configurado` = Faltan variables
- `⚠️ Error de conexión` = Variables configuradas pero no funciona

---

## 🔧 Variables Completas (Resumen)

```env
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SMTP - Correos (OPCIONAL pero recomendado)
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu-email@tudominio.com
SMTP_PASSWORD=app_password_zoho
SMTP_FROM=tu-email@tudominio.com

# VAPID - Notificaciones Push (OPCIONAL)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BNxN8fVYYYqF3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ...
VAPID_PRIVATE_KEY=cqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYq...
VAPID_SUBJECT=mailto:support@futuretask.app

# App URL
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

---

## 📝 Notas Importantes

1. **Redeploy es obligatorio** después de añadir/cambiar variables de entorno
2. **Los correos son opcionales** - la app funciona sin ellos, pero los usuarios no recibirán emails
3. **Las notificaciones son opcionales** - la app funciona sin ellas
4. **Supabase es obligatorio** - sin él, la app no funciona

---

## 🆘 ¿Todavía no funciona?

1. Ejecuta el test: `/test-config`
2. Revisa los logs en Vercel
3. Verifica que redesplegaste después de añadir variables
4. Prueba enviando un email de test directamente desde Vercel Functions

**Logs en Vercel**:
- Ve a tu proyecto → Deployments
- Click en el deployment actual
- Pestaña "Functions" → Click en una función
- Mira los logs en tiempo real
