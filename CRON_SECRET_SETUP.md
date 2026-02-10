# Configuración de CRON_SECRET para Notificaciones de Calendario

## Resumen Rápido
Para que las notificaciones de eventos funcionen con la app cerrada, necesitas:
1. Generar un CRON_SECRET seguro
2. Agregarlo a Vercel como variable de entorno
3. Verificar que funciona

---

## Paso 1: Generar el CRON_SECRET

Tienes dos opciones:

**Opción A: Usar valor predeterminado (fácil)**
```
cron_calendar_notifications_futuristic_app_2024
```

**Opción B: Generar uno seguro (recomendado)**

Si tienes terminal disponible:
```bash
openssl rand -base64 32
```

Esto genera algo como:
```
aBc+def/GHIJklMNOPqrstuVWXYZ0123456789==
```

Copia el valor generado.

---

## Paso 2: Agregar a Vercel (IMPORTANTE)

### Via Dashboard Vercel:

1. Accede a: **https://vercel.com/dashboard**
2. Selecciona tu proyecto **"futuristic-calendar"**
3. Ve a **Settings** (Configuración)
4. En el menú lateral: **Environment Variables**
5. Click en **Add**

Completa con:
- **Name (Nombre):** `CRON_SECRET`
- **Value (Valor):** Pega el valor que generaste
- **Select Environments:** Marca **Production** (importante)
- Click **Save**

### Verificar que se guardó:
- Debería aparecer en la lista como: `CRON_SECRET` ••••••••

---

## Paso 3: Hacer deploy

Despliega tu app en Vercel (push a GitHub o deploy manual).

El cron job se ejecutará automáticamente cada minuto:
- Verifica eventos próximos (15 minutos)
- Envía notificaciones a todos los usuarios con sesión activa
- Evita enviar duplicadas

---

## Paso 4: Verificar que Funciona

### En Desarrollo (local):
El cron job saltará la validación de CRON_SECRET si no está configurado, así que funcionará en modo desarrollo.

### En Producción (Vercel):
1. Ve a tu proyecto en **Vercel Dashboard**
2. Click en **Deployments**
3. Abre el último deployment
4. Ve a **Function Logs**
5. Busca logs de: `check-upcoming-events`

Deberías ver logs como:
```
[v0] CRON request received
[v0] CRON_SECRET configured: true
[v0] Checking for upcoming events...
[v0] Found X upcoming events
[v0] Sent notification for event: "Mi Evento"
```

---

## Cómo Funcionan las Notificaciones

### Con CRON_SECRET configurado:
- ✅ Recibirás notificaciones incluso con la app cerrada
- ✅ Se envían a TODOS tus dispositivos con sesión activa
- ✅ El cron job se ejecuta cada minuto automáticamente
- ✅ NO hay duplicados (se registran las enviadas)

### Sin CRON_SECRET:
- ⚠️ Solo funciona mientras la app esté abierta
- ⚠️ O mientras el móvil esté desbloqueado
- ⚠️ El Service Worker verifica cada 30 segundos

---

## Solución de Problemas

### No recibo notificaciones:

**1. Verifica que CRON_SECRET está en Vercel:**
- Dashboard → Settings → Environment Variables
- Busca `CRON_SECRET`

**2. Verifica los logs:**
- Dashboard → Deployments → Latest → Function Logs
- Busca: `check-upcoming-events`

**3. Verifica que has dado permisos:**
- El navegador pide permiso para notificaciones
- Comprueba en Configuración del Navegador

**4. Verifica que tienes sesión activa:**
- Debes estar registrado en el app
- Tienes que tener las notificaciones activadas

---

## Variables de Entorno Necesarias

El cron job usa estas variables (ya deberían estar configuradas):
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu base de datos
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio
- `CRON_SECRET` - La que acabas de agregar

---

## Testing Manual

Para probar sin esperar 15 minutos:

1. Crea un evento en el calendario con hora actual + 2 minutos
2. Haz deploy de tu app
3. Espera a que se ejecute el cron (cada minuto)
4. Revisa los logs en Vercel
5. Deberías recibir la notificación

---

## Preguntas Frecuentes

**¿Qué pasa si cambio CRON_SECRET?**
- Debes hacer un nuevo deploy de tu app para que tome el nuevo valor

**¿Puede alguien ejecutar el cron sin el secret?**
- No, Vercel valida el secret automáticamente

**¿Funciona en todos los navegadores?**
- Funciona en Chrome, Edge, Firefox, Safari en iOS 16+

**¿Las notificaciones funcionan offline?**
- No, el Service Worker necesita conexión a internet

---

Listo! Con estos pasos deberías recibir notificaciones de eventos en todos tus dispositivos incluso con la app cerrada.
