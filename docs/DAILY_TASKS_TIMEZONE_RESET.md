# Reset de Tareas Diarias por Zona Horaria

## Descripción General

El sistema ahora reseteará automáticamente las tareas completadas de cada usuario a las **12:00 AM (medianoche)** en su **zona horaria local**, no en UTC global.

## Cómo Funciona

### 1. **CRON Job**
- **Frecuencia:** Cada hora (0 * * * *)
- **Endpoint:** `/api/cron/reset-daily-tasks-by-timezone`
- **Archivo:** `vercel.json`

### 2. **Función SQL**
- **Función:** `reset_daily_tasks_by_timezone()`
- **Ubicación:** Base de datos Supabase
- **Lógica:**
  - Obtiene todos los usuarios con su zona horaria
  - Calcula la fecha actual en la zona horaria local del usuario
  - Reseteará solo las tareas que fueron completadas ANTES de hoy (en su zona horaria local)
  - Retorna el número de usuarios procesados y tareas reseteadas

### 3. **Tabla de Usuarios**
- **Campo:** `timezone` (ej: "America/New_York", "Europe/London", "Asia/Tokyo")
- **Por defecto:** UTC

### 4. **Tabla de Tareas**
- **Campos relevantes:**
  - `completed`: boolean (true si está completada)
  - `completed_at`: timestamp (cuándo fue completada)
  - `user_id`: uuid (referencia al usuario)

## Ejemplo de Flujo

**Escenario:** Usuario en Nueva York completa una tarea el 15 de febrero a las 11:50 PM EST

\`\`\`
Hoy en Nueva York: 15 de febrero, 11:50 PM EST
Hoy en UTC: 16 de febrero, 4:50 AM

- A las 12:00 AM EST (16 de febrero, 5:00 AM UTC):
  - La función calcula la fecha en zona horaria del usuario: 16 de febrero
  - Las tareas completadas el 15 de febrero se resetean
  - La tarea que completó el usuario se marca como NO completada
\`\`\`

## Configuración Requerida

### 1. Asignar Zona Horaria a Usuarios
Cuando un usuario inicia sesión o en su perfil de configuración:

\`\`\`typescript
await supabase
  .from('users')
  .update({ timezone: 'America/New_York' })
  .eq('id', userId)
\`\`\`

### 2. Variables de Entorno
Necesarias en Vercel:
- `CRON_SECRET` - Token para validar requests CRON
- `NEXT_PUBLIC_SUPABASE_URL` - URL de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio de Supabase

### 3. Configurar CRON en Vercel
El `vercel.json` ya tiene configurado:
\`\`\`json
{
  "path": "/api/cron/reset-daily-tasks-by-timezone",
  "schedule": "0 * * * *"
}
\`\`\`

## Funciones Auxiliares

### `should_reset_tasks_for_user(user_id)`
Verifica si es hora de resetear para un usuario específico (entre 11:55 PM y 12:05 AM en su zona horaria).

\`\`\`sql
SELECT should_reset_tasks_for_user('user-id-here');
\`\`\`

## Testing

Para probar manualmente el reset:

\`\`\`bash
curl -X POST http://localhost:3000/api/cron/reset-daily-tasks-by-timezone \
  -H "Authorization: Bearer $CRON_SECRET"
\`\`\`

Verás una respuesta como:
\`\`\`json
{
  "message": "Successfully reset daily tasks by timezone",
  "result": {
    "users_processed": 42,
    "tasks_reset": 156
  }
}
\`\`\`

## Rendimiento

- **Índices creados:**
  - `idx_tasks_completed_at` - Para filtrar por completed_at
  - `idx_tasks_completed_state` - Para tareas completadas
  - `idx_users_timezone` - Para acceder a zona horaria del usuario

- **Escalabilidad:** Puede procesar miles de usuarios sin problemas

## Troubleshooting

### Las tareas no se resetean
1. Verifica que el usuario tenga una zona horaria válida: `SELECT timezone FROM users WHERE id='...';`
2. Revisa los logs del CRON en Vercel: https://vercel.com/dashboard
3. Verifica que `CRON_SECRET` sea correcto

### Zona horaria incorrecta
Actualiza la zona horaria del usuario a un valor válido de IANA:
\`\`\`typescript
await supabase
  .from('users')
  .update({ timezone: 'America/Mexico_City' })
  .eq('id', userId)
\`\`\`

Lista de zonas horarias válidas: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
