## Sistema de Notificaciones - Configuración Completa

### ¿Cómo funciona ahora?

El sistema tiene **dos capas de notificaciones**:

#### 1. **App Abierta** ✅ (Ya funciona)
- Cada 30 segundos verifica eventos próximos
- Hook `useCalendarEventNotifications` ejecutándose en background
- Funciona en todos los dispositivos con sesión activa

#### 2. **App Cerrada** ❌ (Requiere configuración)
Hay dos opciones:

### OPCIÓN A: Cron Job de Vercel (RECOMENDADO)

Esta es la forma más confiable. El servidor verifica eventos periódicamente.

**Pasos:**

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto → Settings → Environment Variables
3. Añade estas variables (si no las tienes):
   \`\`\`
   CRON_SECRET = tu-secreto-aleatorio-aqui
   \`\`\`

4. En `vercel.json`, el cron job ya está configurado para ejecutarse cada minuto:
   \`\`\`json
   "crons": [{
     "path": "/api/cron/check-upcoming-events",
     "schedule": "* * * * *"
   }]
   \`\`\`

5. Deploy nuevamente para aplicar los cambios

**Resultado:** Se ejecuta automáticamente cada minuto, incluso con la app cerrada ✅

---

### OPCIÓN B: Polling Manual (Sin Cron Job)

Si no quieres usar Cron Job, puedes abrir la app cada cierto tiempo y dejará notificaciones pendientes:

1. Abre la app (aunque sea unos segundos)
2. El Service Worker verificará eventos en background con Background Sync
3. Se enviarán notificaciones push a todos tus dispositivos

**Limitación:** Necesitas abrir la app regularmente, no automático ❌

---

### OPCIÓN C: Terceros (Zapier, Make, etc.)

Crea un webhook que llame a `/api/cron/check-upcoming-events` cada minuto desde un servicio externo.

---

### Verificar que todo funciona

1. **Comprueba que tienes VAPID keys configuradas:**
   \`\`\`
   NEXT_PUBLIC_VAPID_PUBLIC_KEY - debe estar configurada
   VAPID_PRIVATE_KEY - debe estar configurada (solo servidor)
   \`\`\`

2. **En el navegador, abre DevTools → Application → Service Workers**
   - Deberías ver tu Service Worker registrado ✅

3. **Verifica que las notificaciones están activadas:**
   - Ve a Configuración → Notificaciones
   - Asegúrate de que están habilitadas ✅

4. **Prueba una notificación:**
   - Ve a `/api/notifications/test` desde el navegador
   - Deberías recibir una notificación de prueba

---

### Resumen Final

| Situación | Funciona | Requiere |
|-----------|----------|----------|
| App abierta | ✅ Sí | Nada |
| App cerrada + Cron Job | ✅ Sí | Configurar Vercel |
| App cerrada + sin Cron Job | ❌ No | Abrir app regularmente |
| Móvil en suspensión + Cron Job | ✅ Sí | Cron Job configurado |
| Móvil en suspensión + sin Cron Job | ❌ No | Desbloquear y abrir app |

**Recomendación:** Usa OPCIÓN A (Cron Job) para garantizar que siempre recibes notificaciones.
