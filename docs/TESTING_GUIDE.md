## Guía de Testing - Notificaciones, Emails y Pagos

### PARTE 1: Testing de Emails

#### 1.1 Configurar Mailtrap (Testing SMTP gratis)

**Paso 1: Crear cuenta en Mailtrap**
- Ve a https://mailtrap.io
- Sign up gratis
- Crea un proyecto "Testing"
- Copia credenciales

**Paso 2: Agregar a `.env.local`**
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_usuario_mailtrap
SMTP_PASS=tu_password_mailtrap
SMTP_FROM=test@tuapp.com
```

**Paso 3: Reinicia la app**
```bash
npm run dev
```

---

#### 1.2 Testing Email de Forgot Password

```bash
1. Ve a http://localhost:3000/forgot-password
2. Ingresa tu email
3. Revisa en Mailtrap Inbox → Deberías ver el email
4. Click en el link del email
5. Ingresa nueva contraseña
6. Intenta login con nueva contraseña ✅
```

---

#### 1.3 Testing Email de Nuevo Dispositivo

```bash
1. Login desde tu navegador principal
   - IP guardada: la que salga de x-forwarded-for

2. Abre navegador privado / incógnito
   
3. Login con las mismas credenciales
   - Si IP es diferente → Deberías ver email en Mailtrap
   - Búsca: "Nuevo inicio de sesión"

4. Verifica email incluya:
   ✅ Tipo de dispositivo (User-Agent)
   ✅ Fecha y hora
   ✅ Link para cambiar contraseña
```

**Nota:** En localhost ambas peticiones vienen de 127.0.0.1, así que necesitarás:
- Proxy o VPN para simular IP diferente, O
- Revisar logs en consola para verificar que la lógica funciona

---

#### 1.4 Testing Email de Suscripción Cancelada

**Opción A: Simulación manual**

```javascript
// En tu console del navegador (F12):
await fetch('/api/paypal/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'test-webhook',
    event_type: 'BILLING.SUBSCRIPTION.CANCELLED',
    resource: {
      id: 'tu-paypal-subscription-id'
    }
  })
})
```

**Opción B: Usar PayPal Sandbox**
1. Ve a https://sandbox.paypal.com
2. Crea cuenta vendedor
3. Configura webhook URL
4. Usa PayPal Sandbox para testing de pagos

---

### PARTE 2: Testing de Notificaciones del Calendario

#### 2.1 Crear evento de prueba

```bash
1. Login en tu app
2. Ve a /app/calendar
3. Crea un evento con time:
   - Ahora: 2:00 PM
   - Evento: "Test event" a las 2:10 PM (10 minutos después)
4. Guarda el evento
```

#### 2.2 Verificar polling

```bash
1. Abre DevTools (F12) → Network tab
2. Filtra por "/api/cron/check-upcoming-events"
3. Deberías ver requests cada 30 segundos
4. Expera a que sea 2:05 PM
5. En 5-10 segundos deberías ver notificación push
```

#### 2.3 Verificar en consola

```bash
1. DevTools → Console
2. Busca logs: "[useCalendarEventNotifications]"
3. Deberías ver:
   ✅ Polling iniciado
   ✅ Eventos encontrados
   ✅ Notificaciones enviadas
```

---

### PARTE 3: Testing de PayPal

#### 3.1 Configurar PayPal Sandbox

**Paso 1: Crear cuenta en PayPal Developer**
- https://developer.paypal.com
- Sign in / Create account
- Ve a Dashboard

**Paso 2: Crear App**
- Sandbox → Apps & Credentials
- Create App
- Obtén: CLIENT_ID y CLIENT_SECRET

**Paso 3: Agregar a `.env.local`**
```env
PAYPAL_CLIENT_ID=tu_sandbox_client_id
PAYPAL_CLIENT_SECRET=tu_sandbox_secret
```

#### 3.2 Crear cuentas de prueba

En PayPal Developer Dashboard → Sandbox → Accounts:

**Crear 2 cuentas:**

1. **Vendedor (Receiver)**
   - Email: sbmxxxxxx-facilitator@business.example.com
   - Password: demo1234

2. **Comprador (Payer)**
   - Email: sbmxxxxxx-buyer@personal.example.com
   - Password: demo1234

---

#### 3.3 Testing de Pago

```bash
1. En tu app: Ve a /app/subscription
2. Click "Upgrade to Pro"
3. Redirige a PayPal Sandbox
4. Login con cuenta COMPRADOR
5. Aprueba el pago
6. Redirige de vuelta a tu app
7. Verifica en BD: subscription_plan = "pro"
```

**En tu DB deberías ver:**
```sql
SELECT user_id, subscription_plan, paypal_subscription_id 
FROM users 
WHERE email = 'tu-email';

-- Resultado:
-- | user_id | subscription_plan | paypal_subscription_id |
-- |---------|------------------|----------------------|
-- | xxx     | pro              | I-XXXXXXXXXXXX       |
```

---

#### 3.4 Testing de Fallo de Pago

**Opción A: Sandbox Environment (Recomendado)**

```bash
1. Crea segunda suscripción
2. En PayPal Sandbox Dashboard
3. Ve a Accounts → Tu cuenta Vendedor
4. Transactions → Subscriptions
5. Selecciona subscription
6. Action → Suspend Subscription
7. Luego → Cancel Subscription
8. PayPal envía webhook automáticamente
9. Verifica email en Mailtrap
10. Verifica BD: subscription_plan = "free"
```

**Opción B: Usar Mailtrap Webhook Simulator**

```bash
1. Mailtrap → Email Testing
2. Webhooks → Settings
3. Configura URL: https://tu-app.com/api/paypal/webhook
4. Simula evento: BILLING.SUBSCRIPTION.CANCELLED
5. Verifica que tu endpoint lo procesa
```

---

#### 3.5 Testing de Webhook

**Verificar que webhooks llegan:**

```javascript
// En tu console (F12):
// Haz una petición de prueba

const payload = {
  id: 'WH-test-123',
  event_type: 'BILLING.SUBSCRIPTION.CREATED',
  resource: {
    id: 'I-test-subscription',
    status: 'ACTIVE'
  }
};

fetch('/api/paypal/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(console.log);
```

**Respuesta esperada:**
```json
{ "success": true, "processedAt": "2026-02-10T..." }
```

---

### PARTE 4: Testing de Cron Job

#### 4.1 Testing local (sin Vercel)

```bash
# Simular cron job
curl -X GET http://localhost:3000/api/cron/check-upcoming-events \
  -H "Authorization: Bearer test-secret"

# Deberías ver:
# [v0] Is Vercel cron: false
# [v0] Client-side polling - no CRON_SECRET required
```

#### 4.2 Testing en Vercel

```bash
1. Deploya tu app a Vercel
2. En vercel.json agrega:
{
  "crons": [{
    "path": "/api/cron/check-upcoming-events",
    "schedule": "*/5 * * * *"
  }]
}

3. Deploy y genera CRON_SECRET en Vercel console
4. Espera 5 minutos
5. Verifica logs en Vercel → Function Logs
6. Deberías ver: "[v0] CRON_SECRET validated successfully"
```

---

### PARTE 5: Checklist de Testing

```
EMAILS
[ ] Forgot password email se envía
[ ] Email tiene link funcional
[ ] New device email se envía en login diferente
[ ] Subscription cancelled email se envía

CALENDARIO
[ ] Hook polling inicia automáticamente
[ ] Peticiones al /api/cron cada 30 segundos
[ ] Notificación push cuando evento está próximo (15 min)
[ ] Notificación incluye: título, descripción, acción

PAGOS
[ ] Crear suscripción exitosa en PayPal
[ ] Usuario recibe: subscription_plan = "pro"
[ ] Usuario recibe créditos mensuales
[ ] Cancelar suscripción manualmente funciona
[ ] Webhook de cancelación procesa correctamente
[ ] Email de cancelación se envía

SEGURIDAD
[ ] Último IP se guarda después de login
[ ] Nuevo dispositivo es detectado
[ ] Email de seguridad se envía
[ ] Link de cambiar contraseña funciona

CRON JOB
[ ] Endpoint responde sin CRON_SECRET (client-side)
[ ] Endpoint valida CRON_SECRET (Vercel)
[ ] Job ejecuta cada 5 minutos
[ ] Usuarios sin app abierta reciben notificaciones
```

---

### PARTE 6: Debugging

#### 6.1 Ver logs de SMTP

```javascript
// En lib/email.tsx, busca:
console.log("[EMAIL] Sending email to:", email)
console.error("[EMAIL] Error sending email:", error)
```

#### 6.2 Ver logs de PayPal

```javascript
// En app/api/paypal/webhook/route.ts:
console.log("[PAYPAL] Webhook received:", eventType)
console.log("[PAYPAL] Processing subscription...")
```

#### 6.3 Ver logs de Calendar

```javascript
// En hooks/useCalendarEventNotifications.ts:
console.log("[v0] Calendar polling started")
console.log("[v0] Found X upcoming events")
```

#### 6.4 Activar debug mode

En tu `.env.local`:
```env
DEBUG=*
LOG_LEVEL=debug
```

---

### PARTE 7: Troubleshooting Común

**Problema: Emails no se envían**
- Verifica SMTP credenciales en Mailtrap
- Revisa que SMTP_HOST y SMTP_PORT son correctos
- Busca logs "[EMAIL]" en console

**Problema: PayPal webhook no procesa**
- Verifica PAYPAL_WEBHOOK_ID en env
- Revisa que endpoint es accesible públicamente
- Usa PayPal webhook simulator para testing

**Problema: Notificaciones no se envían**
- Verifica Service Worker está registrado
- Revisa que usuario subscribed a push notifications
- Verifica que evento está dentro de 15 minutos

**Problema: Fallo de email no bloquea operación**
- Esto es INTENCIONAL (seguridad)
- Login funciona aunque email falle
- Verifica logs para error específico
