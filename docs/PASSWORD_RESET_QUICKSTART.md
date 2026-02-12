# ⚡ Reseteo de Contraseña - Quick Start

## 🎯 Lo que está listo

✅ Endpoint `/api/auth/forgot-password` - genera y envía link
✅ Página `/reset-password` - valida y actualiza contraseña  
✅ Login valida email confirmado
✅ Tokens expiración en 24 horas

## 📋 Qué DEBES hacer ahora

### 1. Abre Supabase Dashboard
Ve a: https://app.supabase.com → Tu Proyecto

### 2. Habilita Email Auth
\`\`\`
Authentication → Providers → Email
\`\`\`
**Click el botón para que esté ON (verde)**

### 3. Verifica Template de Reset
\`\`\`
Authentication → Email Templates
\`\`\`
Busca "Reset Password" y verifica:
- [ ] Dice "Enabled" (no "Disabled")
- [ ] Contiene `{{ .ConfirmationURL }}`
- [ ] El texto te parece bien

### 4. Verifica Variables de Entorno
En tu Vercel Project → Settings → Environment Variables:
\`\`\`
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXT_PUBLIC_APP_URL
✓ SUPABASE_SERVICE_ROLE_KEY
\`\`\`

---

## 🧪 Prueba en 5 Pasos

### Paso 1: Ir a Olvidé Contraseña
\`\`\`
http://localhost:3000/forgot-password
\`\`\`

### Paso 2: Ingresa un Email
Usa un email real que puedas revisar

### Paso 3: Revisa tu Email
- Bandeja principal
- Carpeta SPAM
- Espera 30 segundos

### Paso 4: Haz Clic en el Link
El email debe contener un botón o link que dice "Restablecer Contraseña"

### Paso 5: Cambia la Contraseña
\`\`\`
Nueva contraseña: ______
Confirmar:        ______
[Restablecer Contraseña]
\`\`\`

Si todo funciona:
- ✓ Verás: "¡Contraseña restablecida!"
- ✓ Te redirige a /login
- ✓ Puedes loguear con la nueva contraseña

---

## ❌ Si no Funciona

**No recibiste email → Problema 1**
\`\`\`
1. Revisa SPAM
2. Ve a Supabase → Authentication → Providers
3. Verifica que "Email" esté ON
4. Si no está: Haz click para habilitarlo
5. Intenta de nuevo
\`\`\`

**Recibiste email pero link no funciona → Problema 2**
\`\`\`
1. El link tiene una fecha de expiración (24 horas)
2. No pueden usarse dos veces
3. Solicita un nuevo link
\`\`\`

**Cambias contraseña pero no puedes loguear → Problema 3**
\`\`\`
1. ¿Estás usando la NUEVA contraseña?
2. ¿Tu email está confirmado?
3. Ve a Supabase → Authentication → Users
4. Busca tu email
5. ¿Dice "email_confirmed_at"? Si dice "null" = email no confirmado
\`\`\`

---

## 📚 Documentación Completa

Después de verificar que funciona, lee:
- `docs/PASSWORD_RESET_COMPLETE_GUIDE.md` - Guía detallada
- `docs/PASSWORD_RESET_DEBUGGING.md` - Debugging avanzado
- `scripts/test-password-reset.sh` - Script para probar

---

## 📧 Resumen del Flujo

\`\`\`
USUARIO:
  1. Hago clic en "Olvidé contraseña"
  2. Ingreso mi email
  3. Reviso mi email
  4. Hago clic en el link
  5. Ingreso nueva contraseña 2 veces
  6. Confirmo cambio
  7. Voy a login y entro con nueva contraseña ✓

SISTEMA:
  1. Genera código de recuperación
  2. Envía email con link único
  3. Link contiene token válido 24 horas
  4. Token solo puede usarse una vez
  5. Después de usar, actualiza la contraseña en BD
  6. Usuario puede logear inmediatamente ✓
\`\`\`

---

## ✨ Tips

- Usa navegación privada/incógnito para probar
- Los tokens NO se guardan en historia del navegador
- Cada nuevo reset invalida los tokens anteriores
- El email debe estar confirmado ANTES de cambiar contraseña
- La contraseña debe tener MÍNIMO 6 caracteres

---

## 🆘 Ayuda Rápida

\`\`\`bash
# Ver logs de tu app:
# F12 en navegador → Console → Busca "[v0]"

# Ver logs de Supabase:
# Dashboard → Authentication → Logs

# Probar endpoint:
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ejemplo.com"}'

# Verifica variable de entorno:
echo $NEXT_PUBLIC_APP_URL
\`\`\`

---

## ✅ Checklist Final

- [ ] Email Auth está habilitado en Supabase
- [ ] Template Reset Password está enabled
- [ ] Variables de entorno están correctas
- [ ] Probé el flujo completo
- [ ] Puedo recibir y usar el email
- [ ] Puedo cambiar contraseña
- [ ] Puedo loguear con nueva contraseña

**Si todo está en verde: ¡Listo! 🚀**
