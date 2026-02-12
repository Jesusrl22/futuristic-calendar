# Debugging: Reseteo de Contraseña - Guía de Logs

## 🔍 Dónde Ver Logs

### 1. Logs en el Navegador (Frontend)
Abre **DevTools** (F12):

\`\`\`javascript
// Console → Busca logs con "[v0]"
[v0] Solicitud de cambio de contraseña para: user@email.com
[v0] Valid recovery token found in URL
[v0] Updating password with access token
[v0] Password updated successfully
\`\`\`

**Si ves estos logs: ✓ El cambio funcionó**

### 2. Logs en Supabase Dashboard

**Opción A: Authentication Logs**
\`\`\`
Dashboard → Authentication → Logs
\`\`\`
Busca eventos como:
- `send_email` (email enviado)
- `recover_user` (enlace de recuperación generado)
- `update_user` (contraseña actualizada)

**Opción B: SQL Query Editor**
\`\`\`sql
-- En SQL Editor de Supabase:
SELECT 
  id, 
  event, 
  created_at, 
  error_count, 
  error 
FROM auth.audit_log_entries 
WHERE event IN ('send_email', 'recover_user', 'update_user')
ORDER BY created_at DESC 
LIMIT 20;
\`\`\`

**Opción C: Verificar Usuario**
\`\`\`
Dashboard → Authentication → Users
→ Busca el email
→ Haz clic en el usuario
\`\`\`
Verifica:
- `email_confirmed_at` = debe tener fecha (no null)
- `last_password_change` = debe actualizarse al cambiar contraseña

---

## ❌ Mensajes de Error Comunes

### Error 1: "Invalid or expired reset link"
\`\`\`
Posibles causas:
1. El token del URL es inválido
2. El enlace expiró (>24 horas)
3. El token ya fue usado

Solución:
- Solicita un nuevo reset
- Usa el link dentro de 24 horas
- Un token solo puede usarse una vez
\`\`\`

### Error 2: "Failed to update password"
\`\`\`
Posibles causas:
1. El token es inválido
2. La sesión de Supabase expiró
3. Problema de conectividad

Solución:
- Recarga la página
- Solicita un nuevo link de reset
- Verifica tu conexión a internet
\`\`\`

### Error 3: "Passwords do not match"
\`\`\`
Posible causa:
- Las dos contraseñas ingresadas no son idénticas

Solución:
- Verifica que ambos campos sean exactamente iguales
- Cuidado con mayúsculas/minúsculas
- Cuidado con espacios en blanco
\`\`\`

### Error 4: "Password must be at least 6 characters"
\`\`\`
Posible causa:
- La contraseña tiene menos de 6 caracteres

Solución:
- Usa una contraseña más larga (mínimo 6 caracteres)
- Ejemplo: "Abc123" o "MiContraseña"
\`\`\`

### Error 5: "Email not verified" (al intentar loguear)
\`\`\`
Posible causa:
- El usuario nunca confirmó su email

Solución:
- Revisa el email de confirmación que recibiste
- Haz clic en el link de confirmación
- Si no lo tienes, solicita reenvío
\`\`\`

### Error 6: "No valid recovery token found"
\`\`\`
Posible causa:
- El URL no contiene el token (access_token)
- El tipo de token no es "recovery"

Solución:
- Copia el URL completo del email
- Verifica que contenga ?access_token=...&type=recovery
- No edites el URL
\`\`\`

### Error 7: Email no enviado (sin error)
\`\`\`
Posible causa:
1. Email Auth no está habilitado en Supabase
2. SMTP mal configurado
3. El email está en SPAM

Solución:
- Ve a Authentication → Providers → Email (debe estar ON)
- Revisa carpeta SPAM
- Verifica logs de Supabase (Authentication → Logs)
\`\`\`

---

## 🔧 Debugging Paso a Paso

### Paso 1: Verificar que el Endpoint Funciona

\`\`\`bash
# En terminal, ejecuta:
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"tumail@ejemplo.com"}'

# Respuesta esperada:
# {"success":true,"message":"Si existe una cuenta..."}
\`\`\`

### Paso 2: Verificar que Supabase Recibe la Solicitud

En Supabase:
\`\`\`
Authentication → Logs
\`\`\`
- Busca un evento reciente con tu email
- Si ves `send_email` = Supabase intentó enviar
- Si ves error = lee el mensaje de error

### Paso 3: Verificar que el Email Llegó

Revisa:
1. Bandeja de entrada principal
2. Carpeta SPAM/Junk
3. Carpeta de Promociones

Si no aparece:
- Revisa los logs de Supabase
- Ve a Authentication → Email Template → Reset Password
- Verifica que la plantilla esté habilitada

### Paso 4: Verificar el Token del URL

Cuando hagas clic en el link del email:

\`\`\`javascript
// En Console (DevTools F12):
const url = new URL(window.location.href)
console.log("Full URL:", url.href)
console.log("Access Token:", url.hash)

// Deberías ver algo como:
// #access_token=eyJhbGc...&type=recovery
\`\`\`

Si falta `access_token` o `type`:
- El email tiene un problema
- Solicita un nuevo reset

### Paso 5: Verificar la Actualización de Contraseña

\`\`\`javascript
// En Console mientras estás en /reset-password:
// Después de ingresa la contraseña, busca logs:
console.log("[v0] Updating password with access token")
console.log("[v0] Password updated successfully")
// O error:
console.error("[v0] Password update error:")
\`\`\`

### Paso 6: Verificar el Login

Después de que se cambie la contraseña:

\`\`\`bash
# En terminal:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tumail@ejemplo.com","password":"nuevaContraseña"}'

# Respuesta esperada (éxito):
# {"success":true,"user":{"id":"...","email":"...","...":"..."}}

# Respuesta esperada (fallo - contraseña vieja):
# {"error":"Invalid credentials"}
\`\`\`

---

## 📊 Checklist de Debugging

### ¿Funciona todo?
- [ ] Recibes el email en la bandeja
- [ ] El link del email abre la página correctamente
- [ ] Ingresas dos contraseñas y son iguales
- [ ] Ves mensaje "¡Contraseña restablecida!"
- [ ] Te redirige a /login
- [ ] Puedes loguear con la nueva contraseña

### ¿No recibiste email?
- [ ] Revisa SPAM
- [ ] Ve a Supabase → Authentication → Providers → Email (está ON?)
- [ ] Ve a Supabase → Authentication → Email Templates (Reset Password está enabled?)
- [ ] Revisa Supabase → Logs (¿hay evento send_email?)

### ¿El link no funciona?
- [ ] El link contiene `?access_token=` y `&type=recovery`?
- [ ] Hace menos de 24 horas que solicitaste el reset?
- [ ] Ya no intentaste usar el mismo link dos veces?
- [ ] Abre DevTools (F12) y revisa la consola para ver errores

### ¿No puedes cambiar contraseña?
- [ ] Las dos contraseñas son exactamente iguales?
- [ ] Tienen mínimo 6 caracteres?
- [ ] Abre DevTools (F12) y copia el error exacto
- [ ] Revisa la consola de Supabase para más detalles

### ¿No puedes loguear después del cambio?
- [ ] Estás usando la NUEVA contraseña (no la vieja)?
- [ ] Tu email está confirmado (verified)?
- [ ] Ve a Supabase → Users → Busca tu email
- [ ] Verifica que `email_confirmed_at` tenga una fecha

---

## 🔐 SQL para Verificar Usuarios

En Supabase SQL Editor:

\`\`\`sql
-- Ver todos los usuarios con su estado
SELECT 
  id,
  email,
  email_confirmed_at,
  last_sign_in_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Ver log de eventos de un usuario
SELECT 
  id,
  event,
  created_at,
  error_count,
  error
FROM auth.audit_log_entries
WHERE actor_id = 'USER_ID_AQUI'  -- Reemplaza con el ID
ORDER BY created_at DESC;

-- Ver emails no confirmados
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;
\`\`\`

---

## 📱 Logs en DevTools del Navegador

### Console (F12)
Busca mensajes con estos patrones:

\`\`\`javascript
// Logs esperados:
"[v0]" // Logs del frontend
"[SERVER][v0]" // Logs del servidor
"[EMAIL]" // Logs de email (si se envía)

// Errores esperados:
"error" // Errores en console
"Error" // Excepciones de JavaScript
\`\`\`

### Network (F12)
Haz clic en la tab "Network" y busca:

\`\`\`
POST /api/auth/forgot-password
  Status: 200
  Response: {"success":true}

POST /api/auth/login
  Status: 200
  Response: {"success":true,"user":{...}}
\`\`\`

### Storage (F12)
En tab "Application" o "Storage", busca cookies:
- `sb-access-token` = token de acceso
- `sb-refresh-token` = token para refrescar

Si están presentes después de login: ✓ Sesión activa

---

## 🚨 Casos Extremos

### El usuario olvidó dos veces el email
\`\`\`
Solución:
1. Genera otro link de reset
2. El usuario solo puede usar el último link
3. Todos los links anteriores quedan inválidos
\`\`\`

### El usuario cambió de dispositivo
\`\`\`
Solución:
1. El link debe funcionar desde cualquier dispositivo
2. Si no funciona, verifica que el navegador tenga cookies habilitadas
3. Intenta en navegación privada/incógnito
\`\`\`

### El usuario tiene múltiples emails
\`\`\`
Nota:
- Cada email es una cuenta separada
- El link solo funciona con el email que solicitó el reset
- No es posible cambiar email con el link de reset
\`\`\`

---

## 📞 Última Opción: Contactar Soporte

Si nada funciona, prepara esta información:

1. **Tu email** para probar: _______
2. **Error exacto** que ves: _______
3. **Logs de Supabase** (copiar de Authentication → Logs):
   \`\`\`
   [pegar logs aquí]
   \`\`\`
4. **URL de tu app**: _______
5. **Ambiente** (dev/staging/production): _______

Con esta información, el soporte de Supabase puede ayudarte mejor.
