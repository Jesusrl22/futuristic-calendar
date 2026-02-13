# Guía Completa: Correos y Notificaciones en Future Task

## 📧 Sistema de Correos (Nodemailer + Zoho/SMTP)

### Variables de Entorno Requeridas

Configura estas variables en Vercel > Project Settings > Environment Variables:

\`\`\`env
# SMTP Configuration (Zoho o tu proveedor SMTP)
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu-email@tudominio.com
SMTP_PASSWORD=tu_app_password_de_zoho
SMTP_FROM=tu-email@tudominio.com

# URL de tu aplicación
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
\`\`\`

### Configuración de Zoho Mail

1. **Crear App Password en Zoho**:
   - Ve a https://accounts.zoho.eu/home#security/security
   - Scroll hasta "App Passwords"
   - Genera una nueva contraseña para "Other Apps"
   - Copia la contraseña generada (úsala en `SMTP_PASSWORD`)

2. **Verificar dominio** (si usas email con dominio personalizado):
   - Zoho Control Panel > Mail > Email Hosting
   - Verifica tu dominio con los registros DNS requeridos

### Tipos de Emails Implementados

El sistema envía 5 tipos de emails automáticos:

1. **Verification Email** - Al registrarse
2. **Welcome Email** - Después de verificar email
3. **Password Reset Email** - Al solicitar cambio de contraseña
4. **New Device Login** - Al detectar login desde nuevo dispositivo
5. **Subscription Cancelled** - Cuando se cancela suscripción

### Flujo de Correos

#### Registro de Usuario:
\`\`\`
Usuario se registra
  → POST /api/auth/signup
    → Crea usuario en Supabase Auth
    → Crea perfil en tabla users
    → Envía Verification Email con sendVerificationEmail()
      → Usuario recibe email con enlace de verificación
        → Usuario hace clic en enlace
          → Verifica email en Supabase
            → Envía Welcome Email con sendWelcomeEmail()
\`\`\`

#### Reset de Contraseña:
\`\`\`
Usuario solicita reset
  → POST /api/auth/forgot-password
    → Genera reset_token
    → Guarda token en DB con expiración (1 hora)
    → Envía Password Reset Email con sendPasswordResetEmail()
      → Usuario recibe email con enlace
        → Usuario hace clic y crea nueva contraseña
          → POST /api/auth/reset-password
            → Valida token
            → Actualiza contraseña
\`\`\`

### Debugging de Correos

Si los correos no se envían, revisa logs en Vercel:

\`\`\`bash
# Logs esperados al enviar email:
[EMAIL] Creando transporter con: { host: 'smtp.zoho.eu', port: 465, ... }
[EMAIL] Verification email sent successfully to: usuario@example.com

# Logs de error comunes:
[EMAIL] ❌ Variables SMTP no configuradas
# Solución: Agrega las variables de entorno en Vercel

[EMAIL] ❌ Error al enviar email: Invalid login
# Solución: Verifica SMTP_USER y SMTP_PASSWORD

[EMAIL] ❌ Error al enviar email: connect ETIMEDOUT
# Solución: Verifica SMTP_HOST y SMTP_PORT
\`\`\`

### Test de Correos

Usa el endpoint de prueba:

\`\`\`bash
curl -X POST https://tu-app.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@example.com"}'
\`\`\`

---

## 🔔 Sistema de Notificaciones Push (Web Push API + Service Worker)

### Variables de Entorno Requeridas

\`\`\`env
# VAPID Keys (para Web Push)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_clave_publica_vapid
VAPID_PRIVATE_KEY=tu_clave_privada_vapid

# Para generarlas, usa:
npx web-push generate-vapid-keys
\`\`\`

### Configuración de VAPID Keys

1. **Generar claves VAPID**:
\`\`\`bash
npm install -g web-push
web-push generate-vapid-keys
\`\`\`

2. **Agregar a Vercel**:
   - Copia la Public Key → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - Copia la Private Key → `VAPID_PRIVATE_KEY`

### Tipos de Notificaciones

1. **Task Reminders** - Recordatorios de tareas
2. **Calendar Events** - Eventos próximos del calendario
3. **Achievement Unlocked** - Logros desbloqueados
4. **Team Updates** - Actualizaciones de equipo

### Flujo de Notificaciones Push

\`\`\`
Usuario habilita notificaciones en Settings
  → usePushNotifications().enableNotifications()
    → Solicita permiso al navegador (Notification.requestPermission())
      → Registra Service Worker (/sw.js)
        → Crea suscripción push con VAPID key
          → POST /api/notifications/subscribe
            → Guarda suscripción en tabla push_subscriptions
              ✅ Usuario está suscrito

Cuando ocurre evento (tarea próxima, calendario, etc):
  → Cron job o trigger detecta evento
    → POST /api/notifications/send
      → Busca suscripciones del usuario en DB
        → Envía push notification con web-push
          → Service Worker recibe push event
            → sw.js muestra notificación al usuario
              → Usuario hace clic en notificación
                → Abre app en la página correspondiente
\`\`\`

### Service Worker (/public/sw.js)

El Service Worker maneja:
- **Push events**: Recibe y muestra notificaciones
- **Notification clicks**: Abre la app cuando se hace clic
- **Background sync**: Verifica eventos pendientes (mobile)

### Cron Jobs para Notificaciones

#### Check Upcoming Events (cada 5 minutos):
\`\`\`
Endpoint: /api/cron/check-upcoming-events
Trigger: Vercel Cron
Schedule: */5 * * * * (cada 5 minutos)

Función:
  → Busca eventos de calendario próximos (15 min antes)
  → Envía notificación push a usuarios con eventos próximos
  → Marca notificaciones como enviadas
\`\`\`

Configurar en `vercel.json`:
\`\`\`json
{
  "crons": [{
    "path": "/api/cron/check-upcoming-events",
    "schedule": "*/5 * * * *"
  }]
}
\`\`\`

### Debugging de Notificaciones

#### Verificar soporte:
\`\`\`javascript
console.log('Service Worker:', 'serviceWorker' in navigator)
console.log('Push Manager:', 'PushManager' in window)
console.log('Notification:', 'Notification' in window)
console.log('Permission:', Notification.permission)
\`\`\`

#### Logs esperados:
\`\`\`
[v0] Starting push notification setup...
[v0] Notification permission: granted
[v0] Service Worker registration: [ServiceWorkerRegistration]
[v0] VAPID Public Key configured: true
[v0] Push subscription created: true
[v0] Server response: 200
[v0] Background sync registered for mobile
\`\`\`

### Test de Notificaciones

\`\`\`bash
# Test manual de notificación
curl -X POST https://tu-app.vercel.app/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-here", "title": "Test", "message": "Hello!"}'
\`\`\`

---

## 🔧 Troubleshooting

### Problema: Los correos no llegan

**Solución 1: Verifica variables SMTP**
\`\`\`bash
# En Vercel dashboard, asegúrate que estén todas:
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=email@tudominio.com
SMTP_PASSWORD=app_password_aqui
SMTP_FROM=email@tudominio.com
\`\`\`

**Solución 2: Revisa logs de Vercel**
- Ve a Vercel > Project > Functions
- Revisa los logs de las funciones que envían emails
- Busca errores `[EMAIL]`

**Solución 3: Verifica Zoho App Password**
- Regenera App Password en Zoho
- Actualiza `SMTP_PASSWORD` en Vercel

### Problema: Las notificaciones no funcionan

**Solución 1: Verifica permisos del navegador**
\`\`\`javascript
// En Console del navegador:
Notification.permission
// Debe ser "granted"
\`\`\`

**Solución 2: Verifica VAPID keys**
\`\`\`bash
# En Vercel, asegúrate que estén:
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BNx...
VAPID_PRIVATE_KEY=cqL...
\`\`\`

**Solución 3: Verifica Service Worker**
\`\`\`javascript
// En Console:
navigator.serviceWorker.getRegistration().then(console.log)
// Debe mostrar el Service Worker registrado
\`\`\`

**Solución 4: Prueba manualmente**
- Ve a Settings en la app
- Habilita "Enable Push Notifications"
- Revisa que aparezca el permiso del navegador
- Acepta el permiso
- Usa el botón "Test Notification"

### Problema: Service Worker no se registra

**Solución: Verifica que /public/sw.js existe**
\`\`\`bash
# Debe estar en:
/public/sw.js

# Y ser accesible en:
https://tu-app.vercel.app/sw.js
\`\`\`

---

## ✅ Checklist de Configuración

### Correos:
- [ ] Variables SMTP configuradas en Vercel
- [ ] App Password generada en Zoho
- [ ] NEXT_PUBLIC_APP_URL configurada
- [ ] Email de prueba enviado exitosamente
- [ ] Logs de Vercel sin errores de email

### Notificaciones:
- [ ] VAPID keys generadas
- [ ] VAPID keys configuradas en Vercel
- [ ] Service Worker accesible en /sw.js
- [ ] Cron job configurado en vercel.json
- [ ] Test de notificación exitoso
- [ ] Permisos del navegador otorgados

### Base de Datos:
- [ ] Tabla `users` tiene columnas `reset_token` y `reset_token_expires`
- [ ] Tabla `push_subscriptions` existe
- [ ] Tabla `calendar_events` tiene columna `notification_sent`

---

## 📝 Notas Importantes

1. **Los correos se envían desde el servidor**, no desde el cliente. Por eso necesitas configurar SMTP en Vercel.

2. **Las notificaciones push requieren HTTPS**. Funciona automáticamente en Vercel porque todas las apps tienen HTTPS.

3. **iOS Safari tiene limitaciones con notificaciones push**. Solo funcionan en iOS 16.4+ y requieren que el usuario agregue la app a la pantalla de inicio (PWA).

4. **Los cron jobs solo funcionan en producción**. No funcionan en desarrollo local. Para probar, usa `curl` o Postman para llamar al endpoint manualmente.

5. **El Service Worker se cachea agresivamente**. Si haces cambios, incrementa la versión o usa "Hard Refresh" (Cmd+Shift+R / Ctrl+Shift+R).

---

## 🚀 Próximos Pasos

1. Configura todas las variables de entorno en Vercel
2. Genera y configura VAPID keys
3. Prueba el flujo de registro y verificación de email
4. Prueba el flujo de reset de contraseña
5. Habilita notificaciones en la app
6. Configura cron jobs en vercel.json
7. Monitorea logs en Vercel para detectar errores

¡Todo listo! Tu sistema de correos y notificaciones debería funcionar perfectamente.
