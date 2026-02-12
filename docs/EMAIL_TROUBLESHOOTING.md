# 🔍 Guía de Diagnóstico - Correos no llegan

## Checklist de Verificación

### 1. Variables de Entorno Configuradas ✓
Verifica que tienes estas 6 variables en Vercel > Vars:
- ✓ `SMTP_HOST` = `smtp.zoho.eu`
- ✓ `SMTP_PORT` = `465`
- ✓ `SMTP_USER` = tu email de Zoho (ej: tu_email@tudominio.com)
- ✓ `SMTP_PASSWORD` = tu app-specific password (NO tu contraseña regular)
- ✓ `SMTP_FROM` = tu email de Zoho
- ✓ `NEXT_PUBLIC_APP_URL` = tu dominio (ej: https://tu-app.vercel.app)

**⚠️ IMPORTANTE:** La contraseña debe ser una "app-specific password" generada en Zoho, no tu contraseña de login regular.

---

## 2. Generar App-Specific Password en Zoho

1. Ve a https://mail.zoho.eu
2. Haz clic en tu perfil (arriba a la derecha)
3. Selecciona "Seguridad"
4. Busca "Contraseñas de aplicaciones"
5. Selecciona "Otros" y escribe "Futuristic Calendar"
6. Zoho te generará una contraseña - **cópiala**
7. Usa esa contraseña en la variable `SMTP_PASSWORD`

---

## 3. Verificar Configuración

### Opción A: Prueba Rápida en Vercel Logs

1. Ve a tu aplicación en Vercel
2. Abre > Deployments > Ver logs
3. Intenta un forgot-password
4. Mira el output - deberías ver:
   ```
   [v0] Solicitud de cambio de contraseña para: test@example.com
   [v0] Configuración SMTP:
   [v0] - Host: smtp.zoho.eu
   [v0] - Port: 465
   [v0] - User: [CONFIGURADO]
   [v0] - Password: [CONFIGURADO]
   [v0] - From: tu_email@zoho.com
   [v0] Intentando enviar email a: test@example.com
   [v0] Email de reset enviado exitosamente: <message-id>
   ```

### Opción B: Prueba Local (si tienes Node.js)

```bash
# 1. Copia estas variables a tu .env.local
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_USER=tu_email@tudominio.com
SMTP_PASSWORD=tu_app_specific_password
SMTP_FROM=tu_email@tudominio.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 2. Ejecuta el script de prueba
node scripts/test-email-zoho.js
```

Si ves `[SUCCESS]`, los emails funcionan correctamente.

---

## 4. Errores Comunes

### Error: "Error de autenticación" (EAUTH)
**Causa:** La contraseña es incorrecta
**Solución:**
- ✓ Verifica que sea una app-specific password, no tu contraseña regular
- ✓ Cópiala exactamente sin espacios extras
- ✓ Regenera una nueva si no estás seguro

### Error: "No se puede conectar" (ECONNREFUSED)
**Causa:** El servidor SMTP no está accesible
**Solución:**
- ✓ Verifica que `SMTP_HOST` = `smtp.zoho.eu` (sin typos)
- ✓ Verifica que `SMTP_PORT` = `465`
- ✓ Verifica que tu conexión a internet está activa

### Los logs no muestran nada
**Causa:** El endpoint no se está ejecutando
**Solución:**
- ✓ Verifica que el email del usuario existe en la base de datos
- ✓ Revisa la consola del navegador (F12)
- ✓ Mira los logs en Vercel: Deployments > Función > Ver logs

### Email enviado pero no llega
**Causa:** Puede estar en spam o el servidor rechaza el email
**Solución:**
- ✓ Revisa la carpeta de Spam en Zoho
- ✓ Verifica que `SMTP_FROM` sea tu email de Zoho
- ✓ Comprueba que no hay filtros en Zoho bloqueando los emails

---

## 5. Verificar en Zoho

1. Abre Zoho Mail
2. Mira el historial de emails enviados
3. Si los emails están ahí como "enviados", Zoho los mandó
4. Si están como "error", habrá un mensaje de error que explica por qué

---

## 6. Reiniciar Deployment

Si ya configuraste todo, **redeploya tu app** en Vercel:
1. Ve a Deployments
2. Busca el deployment actual
3. Haz clic en "..." > "Redeploy"

Esto fuerza a que se carguen las nuevas variables de entorno.

---

## Pasos Finales

1. ✓ Configura las 6 variables de entorno en Vercel
2. ✓ Genera app-specific password en Zoho
3. ✓ Redeploya la aplicación
4. ✓ Prueba el forgot-password
5. ✓ Mira los logs en Vercel para ver qué está pasando

Si aún no funciona, comparte los **logs exactos** del endpoint (sin información sensible) y te ayudaré a diagnosticar.
