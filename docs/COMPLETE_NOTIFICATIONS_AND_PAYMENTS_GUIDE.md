## Sistema Completo de Notificaciones, Emails y Pagos

### 1. NOTIFICACIONES DEL CALENDARIO 📅

#### ¿Cómo funciona?

**Opción A: Polling en tiempo real (cuando el usuario tiene la app abierta)**
```
Usuario abre la app → Hook useCalendarEventNotifications se activa
↓
Cada 30 segundos: GET /api/cron/check-upcoming-events
↓
Verifica eventos en los próximos 15 minutos
↓
Si encuentra evento próximo → Envía notificación push al usuario
```

**Opción B: Cron Job automático (cuando el usuario está offline)**
```
Vercel Cron Job (configurable) → GET /api/cron/check-upcoming-events con CRON_SECRET
↓
Verifica TODOS los usuarios
↓
Envía notificaciones push a quienes tengan eventos próximos
```

#### Para activar el Cron Job automático:

1. **Agregar a `vercel.json`:**
```json
{
  "crons": [{
    "path": "/api/cron/check-upcoming-events",
    "schedule": "*/5 * * * *"
  }]
}
```

2. **Generar CRON_SECRET (en Vercel Console):**
   - Dashboard → Settings → Environment Variables
   - Agregar: `CRON_SECRET=<valor-seguro-aleatorio>`

3. **En tu código:**
```bash
curl -X GET "https://tu-app.vercel.app/api/cron/check-upcoming-events" \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

---

### 2. SISTEMA DE EMAILS 📧

#### A. EMAIL DE RECUPERACIÓN DE CONTRASEÑA (Olvide contraseña)

**¿Cómo funciona actualmente?**

Usa **Supabase Auth nativo** (sin SMTP necesario):

```
Usuario click "Forgot Password" → POST /api/auth/forgot-password
↓
Supabase genera enlace mágico automáticamente
↓
Supabase envía email con el enlace
↓
Usuario click en enlace → Redirige a /reset-password
↓
Usuario ingresa nueva contraseña → Se actualiza en Supabase
```

**Estado:** ✅ YA FUNCIONA (Supabase lo hace automáticamente)

---

#### B. EMAIL DE BIENVENIDA

**¿Cómo funciona?**

```
Usuario sign up → POST /api/auth/signup
↓
Se crea usuario en Supabase
↓
Se intenta enviar email de bienvenida (si SMTP está configurado)
↓
Si SMTP falla, no bloquea el signup (el usuario aún se crea)
```

**Para que funcione, necesitas SMTP configurado.**

---

#### C. EMAIL DE NUEVO DISPOSITIVO (NUEVO - Acabo de agregar)

**¿Cómo funciona?**

```
Usuario login con credenciales correctas → POST /api/auth/login
↓
Se valida el email y contraseña
↓
Se verifica la IP del usuario (x-forwarded-for header)
↓
Si la IP es DIFERENTE a last_login_ip:
  → Es un nuevo dispositivo
  → Envía email: "Nuevo inicio de sesión detectado"
  → Incluye: Device Info (User-Agent), Fecha/Hora, IP
↓
Se actualiza last_login_ip y last_login_at en la BD
```

**Email incluye:**
- Tipo de dispositivo
- Fecha y hora del login
- Opción para cambiar contraseña si no lo reconoce

**Estado:** ✅ IMPLEMENTADO (ejecuta con cada login)

---

#### D. EMAIL DE SUSCRIPCIÓN CANCELADA (NUEVO - Acabo de agregar)

**¿Cómo funciona?**

**Escenario 1: Falla de pago en PayPal**
```
1. Usuario tiene suscripción activa
2. PayPal intenta cobro mensual → FALLA (tarjeta vencida, sin fondos, etc.)
3. PayPal envía webhook: BILLING.SUBSCRIPTION.CANCELLED
4. Tu servidor recibe webhook en /api/paypal/webhook
5. Busca al usuario con ese subscription_id
6. Envía email: "Tu suscripción ha sido cancelada"
7. Actualiza BD: subscription_plan = "free", ai_credits_monthly = 0
8. Usuario sigue pudiendo usar la app versión gratuita
```

**Escenario 2: Usuario cancela manualmente**
```
1. Usuario en /app/subscription → click "Cancel Subscription"
2. POST /api/subscription/cancel
3. Cancela en PayPal API
4. PayPal envía webhook BILLING.SUBSCRIPTION.CANCELLED
5. Se ejecuta el mismo flujo anterior
```

**Estado:** ✅ IMPLEMENTADO

---

### 3. SISTEMA DE PAGOS Y CANCELACIÓN 💳

#### ¿Cómo funciona PayPal en tu app?

```
FLUJO DE SUSCRIPCIÓN
═══════════════════

1. CREAR ORDEN (Checkout)
   Usuario click "Upgrade" → POST /api/paypal/create-order
   ↓
   Retorna order_id y enlaces de aprobación

2. APROBAR EN PAYPAL
   Usuario aprueba en PayPal → Redirige a tu app

3. PROCESAR PAGO
   POST /api/paypal/subscription-success
   ↓
   Crea subscription en PayPal
   ↓
   Guarda subscription_id en BD
   ↓
   Actualiza plan a "pro" o "premium"
   ↓
   Asigna créditos mensuales

4. PAGOS RECURRENTES
   Cada mes PayPal cobra automáticamente
   ↓
   Si ÉXITO: webhook BILLING.SUBSCRIPTION.UPDATED
   ↓
   Si FALLO: webhook BILLING.SUBSCRIPTION.CANCELLED
```

---

### 4. ¿QUÉ PASA CUANDO FALLA UN PAGO? 🔴

**En PayPal Business:**
1. PayPal intenta cobro el día de renovación
2. Si falla → Reintenta (normalmente 3 veces más en días posteriores)
3. Después de fallos → Cancela la subscription automáticamente
4. PayPal envía webhook `BILLING.SUBSCRIPTION.CANCELLED` a tu servidor

**En tu app:**
1. Recibes webhook en `/api/paypal/webhook`
2. Procesas evento `BILLING.SUBSCRIPTION.CANCELLED`
3. Envías email al usuario: "Tu suscripción fue cancelada"
4. Actualizas usuario: `subscription_plan = "free"`
5. Usuario pierde acceso a premium pero puede seguir usando versión gratuita

**Verificar en PayPal Business:**
- Dashboard → Subscriptions
- Ver historial de intentos de cobro
- Manual refund si es necesario

---

### 5. CONFIGURACIÓN NECESARIA

#### Para SMTP (emails):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM=noreply@tuapp.com
```

#### Para PayPal:
```env
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...
```

#### Para Calendar Notifications (Cron):
```env
CRON_SECRET=algo-muy-seguro-aleatorio
```

---

### 6. TABLA: ESTADO DE CADA FEATURE

| Feature | Estado | Requiere | Automático |
|---------|--------|----------|-----------|
| Forgot Password | ✅ Funciona | Supabase Auth | Sí |
| Welcome Email | ⚠️ Requiere SMTP | SMTP configurado | Con signup |
| New Device Login | ✅ Acabo de agregar | SMTP (opcional) | Con login |
| Subscription Cancelled | ✅ Acabo de agregar | SMTP (opcional) | Cuando PayPal cancela |
| Calendar Notifications | ✅ Funciona | Push Notifications | Polling o Cron |

---

### 7. PRÓXIMOS PASOS RECOMENDADOS

1. **Configura SMTP** para que los emails se envíen
   - Gmail, SendGrid, Mailgun, etc.
   
2. **Prueba webhook de PayPal**
   - Usa PayPal Sandbox para pruebas
   - Verifica que los webhooks lleguen a tu servidor

3. **Configura Cron Job** (opcional)
   - Habilita notificaciones automáticas cuando la app está cerrada

4. **Monitorea logs**
   - Verifica que los emails se envíen
   - Revisa logs de errores en SMTP

---

### 8. TROUBLESHOOTING

**¿Los emails no se envían?**
- Verifica SMTP_HOST, PORT, USER, PASS
- Revisa logs en console: `[EMAIL] Error sending...`
- Prueba credenciales SMTP manualmente

**¿Las notificaciones del calendario no funcionan?**
- Verifica que el usuario está subscrito a push notifications
- Revisa que los eventos estén guardados en la BD
- Verifica que el Service Worker está registrado

**¿PayPal webhook no se procesa?**
- Verifica PAYPAL_WEBHOOK_ID en Vercel
- Revisa que el endpoint está públicamente accesible
- Prueba con PayPal Sandbox webhook simulator

---

### 9. FLUJO COMPLETO DE UN USUARIO

```
DÍA 1: Registro
├─ Usuario signup
├─ Email bienvenida (opcional)
└─ Cuenta creada, plan free

DÍA 1: Primer login en Desktop
├─ Login desde desktop
├─ IP: 192.168.1.100
└─ Se guarda como last_login_ip

DÍA 3: Login desde celular
├─ Login desde celular (IP: 190.x.x.x)
├─ IP ≠ last_login_ip → Nuevo dispositivo detectado
├─ EMAIL: "Nuevo inicio de sesión desde iPhone"
└─ last_login_ip se actualiza

DÍA 5: Upgrade a Premium
├─ Usuario paga con PayPal
├─ subscription_plan = "pro"
├─ ai_credits_monthly = 100

DÍA 35: Renovación automática
├─ PayPal intenta cobrar
├─ ✅ Cobro exitoso
├─ Subscription se renueva
└─ Créditos se resetean a 100

DÍA 65: Fallo de pago
├─ PayPal intenta cobrar → FALLA
├─ Reintenta 3 veces más
├─ Después: Cancela subscription
├─ Envía webhook BILLING.SUBSCRIPTION.CANCELLED
├─ EMAIL: "Tu suscripción ha sido cancelada"
├─ subscription_plan = "free"
└─ Usuario puede seguir usando versión free
```
