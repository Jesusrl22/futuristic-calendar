## Guía de Configuración - Variables de Ambiente

### SMTP: Opciones y Configuración

#### Opción 1: Gmail (Recomendado para testing)

**Paso 1: Obtener App Password**
```
1. Ve a: https://myaccount.google.com/security
2. Busca "Contraseñas de aplicaciones"
3. Selecciona: Mail + Linux
4. Copias la contraseña (16 caracteres)
```

**Paso 2: Agregar a Vercel**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-16-caracteres
SMTP_FROM=tu-email@gmail.com
```

**Paso 3: Testear**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
# Revisa Gmail inbox o spam
```

---

#### Opción 2: Mailtrap (Mejor para development)

**Paso 1: Crear cuenta**
- Ve a https://mailtrap.io
- Sign up FREE
- Create Inbox "Development"

**Paso 2: Copiar credenciales**
- Inbox Settings
- Credenciales SMTP (Integrations → SMTP)

**Paso 3: Agregar a `.env.local` (LOCAL)**
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=1234567 (número de usuario)
SMTP_PASS=tu_contraseña
SMTP_FROM=test@tuapp.com
```

**Paso 4: Testear**
```bash
npm run dev
# Abre http://localhost:3000/forgot-password
# Ingresa tu email
# Revisa Mailtrap dashboard
```

---

#### Opción 3: SendGrid (Producción recomendada)

**Paso 1: Crear cuenta**
- Ve a https://sendgrid.com
- Sign up FREE (100 emails/día)
- Verifica email

**Paso 2: Obtener API Key**
- Settings → API Keys
- Create API Key (Full Access)
- Copia la key

**Paso 3: Agregar a Vercel**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.tu_api_key_larga
SMTP_FROM=noreply@tuapp.com
```

---

#### Opción 4: Mailgun (Producción alternativa)

**Paso 1: Crear cuenta**
- https://www.mailgun.com
- Sign up
- Agrega dominio (tudominio.com)

**Paso 2: Obtener credenciales**
- Domain Settings → SMTP credentials
- Copia Username y Password

**Paso 3: Agregar a Vercel**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@tudominio.com
SMTP_PASS=contraseña_mailgun
SMTP_FROM=noreply@tudominio.com
```

---

### PAYPAL: Configuración Paso a Paso

#### Paso 1: Crear Cuenta Desarrollador

```
1. Ve a: https://developer.paypal.com
2. Sign in o Create Account
3. Confirma email
4. Completa perfil básico
```

#### Paso 2: Crear Aplicación

```
Dashboard → Apps & Credentials → Sandbox
↓
Create App
↓
Nombre: "Future Task Development"
↓
App Type: Merchant
↓
Create
```

#### Paso 3: Obtener Credenciales

```
En tu app recién creada:

Para Testing:
- Client ID (Sandbox)
- Secret (Sandbox)

Copiar valores
```

#### Paso 4: Agregar a Vercel

```env
PAYPAL_CLIENT_ID=AWOxx_-xxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=EPOxx_-xxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox  # Para testing
```

---

#### Paso 5: Crear Webhook

```
PayPal Sandbox Dashboard → Apps & Credentials → Webhooks

Crear webhook:
- URL: https://tu-app.vercel.app/api/paypal/webhook
- Events: Seleccionar "Subscription"
  ✅ BILLING.SUBSCRIPTION.CREATED
  ✅ BILLING.SUBSCRIPTION.UPDATED
  ✅ BILLING.SUBSCRIPTION.CANCELLED
  ✅ BILLING.SUBSCRIPTION.SUSPENDED
  ✅ BILLING.SUBSCRIPTION.EXPIRED
- Save
- Copiar WEBHOOK_ID
```

#### Paso 6: Agregar Webhook ID

```env
PAYPAL_WEBHOOK_ID=tu_webhook_id_aqui
```

---

### CALENDAR NOTIFICATIONS: Cron Job

#### Paso 1: Generar CRON_SECRET

```bash
# En tu terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Salida:
# a4f9c2d8e1b5... (64 caracteres)
```

#### Paso 2: Agregar a Vercel

```
Vercel Console → Project → Settings → Environment Variables

Agregar:
- Key: CRON_SECRET
- Value: el valor que generaste
- Environments: Production (y Preview si quieres)
```

#### Paso 3: Configurar Cron Job

En `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/check-upcoming-events",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/check-expired-subscriptions",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/reset-monthly-credits",
      "schedule": "0 1 1 * *"
    }
  ]
}
```

#### Paso 4: Deploy

```bash
git add -A
git commit -m "Add cron jobs configuration"
git push
```

---

### ESTRUCTURA COMPLETA DE .env.local

```env
# ============================================
# NEXT.JS / APP
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# ============================================
# SUPABASE
# ============================================
SUPABASE_SERVICE_ROLE_KEY=xxxx
SUPABASE_JWT_SECRET=xxxx

# ============================================
# SMTP (Emails)
# ============================================
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=1234567
SMTP_PASS=tu_contraseña
SMTP_FROM=test@tuapp.com

# ============================================
# PAYPAL
# ============================================
PAYPAL_CLIENT_ID=AWOxx_-xxxx
PAYPAL_CLIENT_SECRET=EPOxx_-xxxx
PAYPAL_WEBHOOK_ID=xxxx
PAYPAL_MODE=sandbox  # O "live" para producción

# ============================================
# CRON JOBS
# ============================================
CRON_SECRET=a4f9c2d8e1b5... (64 caracteres)

# ============================================
# REDIS (Opcional, para rate limiting)
# ============================================
REDIS_URL=redis://localhost:6379
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# ============================================
# PUSH NOTIFICATIONS (Opcional)
# ============================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxx
VAPID_PRIVATE_KEY=xxxx
```

---

### PASO A PASO: Setup Completo Local

```bash
# 1. Clonar repo
git clone tu-repo
cd tu-repo

# 2. Instalar dependencias
npm install

# 3. Configurar Mailtrap
# - Crear cuenta en https://mailtrap.io
# - Copiar credenciales SMTP

# 4. Crear .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
SUPABASE_SERVICE_ROLE_KEY=tu_key

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_user
SMTP_PASS=tu_pass
SMTP_FROM=test@tuapp.com
EOF

# 5. Iniciar servidor
npm run dev

# 6. Testear en http://localhost:3000
```

---

### PASO A PASO: Deploy a Vercel

```bash
# 1. Push código a GitHub
git add -A
git commit -m "Complete notifications system"
git push origin main

# 2. Vercel detecta auto y deploya
# Esperar a que termine

# 3. Agregar variables en Vercel Console
Vercel → Project Settings → Environment Variables

Agregar:
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ SUPABASE_SERVICE_ROLE_KEY
✓ SMTP_HOST
✓ SMTP_PORT
✓ SMTP_USER
✓ SMTP_PASS
✓ SMTP_FROM
✓ PAYPAL_CLIENT_ID
✓ PAYPAL_CLIENT_SECRET
✓ PAYPAL_WEBHOOK_ID
✓ CRON_SECRET

# 4. Redeploy después de agregar variables
Vercel → Deployments → Redeploy

# 5. Testear en https://tu-app.vercel.app
```

---

### VERIFICACIÓN RÁPIDA

```bash
# Verificar SMTP conecta
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verificar endpoint del cron
curl http://localhost:3000/api/cron/check-upcoming-events

# Verificar PayPal credenciales
curl -X POST https://api.sandbox.paypal.com/v1/oauth2/token \
  -H "Authorization: Basic $(echo -n 'ID:SECRET' | base64)"
```

---

### TROUBLESHOOTING: ¿No funciona?

**SMTP error: "connect ECONNREFUSED"**
```
Solución: Verifica SMTP_HOST y SMTP_PORT
- Gmail: smtp.gmail.com:587
- Mailtrap: smtp.mailtrap.io:2525
- SendGrid: smtp.sendgrid.net:587
```

**PayPal error: "Unauthorized"**
```
Solución: Verifica CLIENT_ID y CLIENT_SECRET
- ¿Copiaste sin espacios?
- ¿Son sandbox o live?
- ¿Están en el .env correcto?
```

**Cron Job no ejecuta**
```
Solución: Verifica en Vercel
- Settings → Crons (¿está en vercel.json?)
- Environment Variables → CRON_SECRET (¿existe?)
- Deploy reciente (¿hiciste push después de cambiar?)
```

**Email nunca llega**
```
Solución: Revisa orden de prioridad
1. ¿SMTP_HOST está configurado?
2. ¿SMTP_PORT es el correcto?
3. ¿Está en Mailtrap/SendGrid inbox?
4. ¿Check spam folder?
5. Ver logs: "[EMAIL] Error sending..."
```
