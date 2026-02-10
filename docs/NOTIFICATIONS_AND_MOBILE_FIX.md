# 🔧 Arreglos: Notificaciones y Responsividad en Móvil

## Problemas Identificados y Arreglados

### 1. ❌ Notificaciones No Se Enviaban
**Problema**: Las notificaciones del calendario no se enviaban porque la ruta `/api/notifications/send` verificaba al usuario con `supabase.auth.getUser()`, que solo funciona con cookies del navegador. Cuando el CRON job llamaba internamente, no había cookies disponibles.

**Solución**: 
- Permitir dos formas de autenticación:
  - **Cliente**: Verificar que el userId coincida con el usuario autenticado
  - **Servidor** (CRON): Usar la service role key para verificar que el usuario existe en la BD
  
**Código modificado**: `/app/api/notifications/send/route.ts`

### 2. 📱 Calendario Mal Dimensionado en Móvil
**Problema**: En móviles, los eventos del calendario no cabían bien. El timeline tenía gaps grandes y los botones de edición/eliminar no eran accesibles sin hover (que no existe en móvil).

**Cambios realizados**:
- ✅ Reducir espacios entre elementos en móvil (gap-2 en móvil, gap-4 en desktop)
- ✅ Hacer los botones de editar/eliminar siempre visibles en móvil
- ✅ Reducir padding en cards (p-2 en móvil, p-4 en desktop)
- ✅ Ajustar tamaño de fuentes (text-sm en móvil, text-base en desktop)
- ✅ Hacer flexible el layout de eventos (flex-col en móvil, flex-row en desktop)
- ✅ Agregar `line-clamp-2` a descripciones para evitar desbordamientos

**Código modificado**: `/app/app/calendar/page.tsx`

---

## 🧪 Cómo Probar las Notificaciones

### En Desarrollo (Sin CRON automático)

1. **Abre la consola del navegador**:
   - Presiona `F12` (o `Cmd+Option+I` en Mac)
   - Busca logs que digan `[v0] Checking for upcoming calendar events...`

2. **Crea un evento en los próximos 15 minutos**:
   - Ve a Calendario → Hoy
   - Haz clic en "Añadir Evento"
   - Pon una hora entre ahora y +15 minutos
   - Ejemplo: Si son las 14:30, crea un evento para las 14:45

3. **Observa los logs**:
   \`\`\`
   [v0] Checking for upcoming calendar events...
   [v0] Event check completed: {notifications: 1, ...}
   [v0] Sending notification for event: "Mi Evento"
   [v0] Notification sent successfully to: <endpoint>
   \`\`\`

4. **Recibe la notificación**:
   - Deberías ver un popup en la esquina de tu navegador
   - Si el navegador está en minimizado, recibirás una notificación del sistema

### Notas Importantes

- **Requiere VAPID Keys**: Para que las notificaciones funcionen, necesitas:
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (pública)
  - `VAPID_PRIVATE_KEY` (privada, en servidor)
  - Genera en: https://web-push-codelab.glitch.me/

- **Requiere Suscripción**: El usuario debe permitir notificaciones push cuando se le pida

- **HTTPS necesario**: Las notificaciones push solo funcionan en HTTPS (en producción)

- **Service Worker**: Necesita estar registrado (`public/sw.js`)

---

## 📊 Flujo de Notificaciones

\`\`\`
1. Usuario abre la app
   ↓
2. Hook `useCalendarEventNotifications` inicia polling cada 30s
   ↓
3. POST /api/cron/check-upcoming-events
   ↓
4. Busca eventos en próximos 15 minutos
   ↓
5. Si hay eventos nuevos:
   → POST /api/notifications/send (ahora funciona con server auth)
   → Envía web push a todas las suscripciones del usuario
   ↓
6. Usuario recibe notificación en tiempo real
\`\`\`

---

## 🚀 Próximos Pasos

1. **Configurar VAPID Keys en Vercel**:
   - Ve a Settings → Environment Variables
   - Agrega `VAPID_PRIVATE_KEY`
   - Agrega `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

2. **Probar en Producción**:
   - Deploy a Vercel
   - Verifica que CRON jobs corran automáticamente (cada hora)

3. **Monitorear Logs**:
   - En Vercel: Functions → Logs
   - Busca `[v0]` para ver debug logs

---

## 📝 Archivos Modificados

- `/app/api/notifications/send/route.ts` - Autenticación de servidor corregida
- `/app/app/calendar/page.tsx` - Responsividad en móvil mejorada
- `/lib/email.tsx` - Nuevos tipos de emails agregados (ya estaba)
