# Solución: Reseteo de Contraseña - Guía Completa

## ¿Cuál era el problema?
Los emails de reseteo de contraseña no se enviaban cuando los usuarios hacían clic en "Cambiar contraseña" desde las plantillas de Supabase.

## ¿Qué hemos arreglado?

### 1. **Endpoint `/api/auth/forgot-password`** ✓
- Simplificado para usar `supabase.auth.resetPasswordForEmail()`
- Supabase manejará automáticamente el envío del email
- No requiere SMTP personalizado (a menos que lo hayas configurado)

\`\`\`typescript
// El flujo es:
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
})
\`\`\`

### 2. **Página `/reset-password`** ✓
- Valida que ambas contraseñas coincidan
- Usa el token de recuperación del URL para actualizar la contraseña
- Redirige a `/login` después de completar
- Limpia el hash del URL para remover tokens

\`\`\`typescript
const { error } = await supabase.auth.updateUser({ password })
// Si error = null, la contraseña se actualizó en la BD
\`\`\`

### 3. **Validación en `/api/auth/login`** ✓
- Verifica que el email esté confirmado (`email_confirmed_at`)
- No permite login si el email no está verificado
- Registra intentos de login fallidos

---

## ✅ Checklist: Qué Verificar en Supabase

Ve a tu proyecto en [app.supabase.com](https://app.supabase.com) y completa estos pasos:

### Paso 1: Email Auth Habilitado
\`\`\`
Authentication → Providers → Email
\`\`\`
- [ ] El proveedor "Email" está **ON** (verde)
- [ ] Si ves botones, haz clic en el ícono de engranaje ⚙️

### Paso 2: Email Templates Configuradas
\`\`\`
Authentication → Email Templates
\`\`\`
Verifica que estas plantillas existan y estén **habilitadas**:
- [ ] **Confirm signup** (para verificación inicial)
- [ ] **Reset Password** (IMPORTANTE para cambiar contraseña)
- [ ] Change Email Address (opcional)
- [ ] Invite User (opcional)

### Paso 3: Verificar Plantilla de Reset Password
En `Authentication → Email Templates → Reset Password`:
- [ ] El email contiene `{{ .ConfirmationURL }}` o similar
- [ ] El estado está "Enabled" (no deshabilitado)
- [ ] Si es una plantilla personalizada, el asunto es claro

### Paso 4: Verificar SMTP (si lo tienes configurado)
\`\`\`
Authentication → Email → SMTP Settings
\`\`\`
Si ves aquí un proveedor (SendGrid, Resend, etc):
- [ ] Host: correcto
- [ ] Puerto: 587 o 465
- [ ] Usuario: configurado
- [ ] Contraseña: correcta
- [ ] "From" email: válido

Si no ves SMTP personalizado:
- ✓ Está usando Supabase Email (predeterminado)

---

## 🚀 Flujo Completo de Funcionamiento

\`\`\`
1. USUARIO → "Olvidé contraseña"
   ↓
2. FRONTEND → POST /api/auth/forgot-password { email }
   ↓
3. BACKEND → supabase.auth.resetPasswordForEmail()
   ↓
4. SUPABASE → Genera token + envía email
   ↓
5. EMAIL ENVIADO:
   Subject: "Restablecer tu contraseña"
   Link: https://tuapp.com/reset-password?access_token=...&type=recovery
   ↓
6. USUARIO → Hace clic en el link del email
   ↓
7. FRONTEND → /reset-password (con token en URL)
   ↓
8. USUARIO → Ingresa nueva contraseña 2 veces
   ↓
9. FRONTEND → supabase.auth.updateUser({ password })
   ↓
10. SUPABASE → Actualiza contraseña en BD
    ↓
11. FRONTEND → Redirige a /login
    ↓
12. USUARIO → Logea con nueva contraseña ✓
\`\`\`

---

## 🧪 Cómo Probar

### Opción 1: Script automático
\`\`\`bash
chmod +x scripts/test-password-reset.sh
bash scripts/test-password-reset.sh test@ejemplo.com
\`\`\`

### Opción 2: Manual
1. Ve a http://localhost:3000/forgot-password
2. Ingresa tu email
3. Revisa tu bandeja (o SPAM)
4. Haz clic en el link
5. Ingresa nueva contraseña 2 veces
6. Logea con la nueva contraseña

### Opción 3: Logs en Supabase
\`\`\`
Authentication → Logs
\`\`\`
Busca eventos recientes:
- `send_email` = email enviado ✓
- `update_user` = contraseña actualizada ✓

---

## ❌ Problemas Comunes y Soluciones

### Problema: "No recibo el email"
**Solución:**
1. Revisa carpeta SPAM
2. Ve a `Authentication → Providers → Email`
3. Verifica que esté "ON"
4. Si usas SMTP personalizado, verifica credenciales
5. Revisa logs: `Authentication → Logs`

### Problema: "El link del email no funciona"
**Solución:**
1. Verifica `NEXT_PUBLIC_APP_URL` en `.env`
2. El link no debe estar expirado (válido 24 horas)
3. Copia manualmente el URL al navegador
4. Abre DevTools (F12) y revisa la consola

### Problema: "Error al cambiar contraseña"
**Solución:**
1. Abre DevTools (F12) → Console
2. Busca mensajes de error
3. Verifica que el token esté en el URL
4. La contraseña debe tener mínimo 6 caracteres

### Problema: "Cambié contraseña pero no puedo loguear"
**Solución:**
1. Verifica que tu email esté confirmado
2. Ve a `Authentication → Users` y busca tu email
3. Haz clic en el usuario
4. Verifica que `email_confirmed_at` tenga una fecha (no null)
5. Si está null, necesitas confirmar el email primero

---

## 📧 Variables de Entorno Requeridas

En tu proyecto de Vercel, asegúrate de tener:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000  # O tu URL de producción
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Para operaciones de admin
\`\`\`

Verifica:
\`\`\`bash
# En Vercel Settings → Environment Variables
vercel env list
\`\`\`

---

## 📝 Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| `/app/api/auth/forgot-password/route.ts` | Simplificado, usa `resetPasswordForEmail()` de Supabase |
| `/app/reset-password/page.tsx` | Ya estaba bien, valida token y actualiza contraseña |
| `/app/api/auth/login/route.ts` | Ya valida `email_confirmed_at` |
| `/lib/email.tsx` | Limpiado (no se usa para reset, Supabase lo maneja) |

---

## ✨ Características Adicionales Configuradas

✓ Validación de contraseña igual 2 veces
✓ Contraseña mínimo 6 caracteres
✓ Link de reset válido 24 horas
✓ Token removido del URL después de cambiar
✓ Redirige a login después de cambiar
✓ Email confirmado requerido para login
✓ Múltiples idiomas en interfaz
✓ Mostrar/ocultar contraseña

---

## 🔒 Seguridad

✓ El token se pasa por URL (Supabase lo maneja de forma segura)
✓ El token se usa una sola vez
✓ No se revela si el email existe
✓ Redirige a login (no a app) después del cambio
✓ Email confirmado es obligatorio para login

---

## 📞 Soporte

Si algo sigue sin funcionar:

1. **Revisa los logs de Supabase:**
   \`\`\`
   Authentication → Logs
   \`\`\`

2. **Abre DevTools:**
   - F12 en el navegador
   - Tab "Console"
   - Busca mensajes con "[v0]"

3. **Consulta la documentación:**
   - [Supabase Auth Docs](https://supabase.com/docs/guides/auth/passwords)
   - [Reset Password Docs](https://supabase.com/docs/reference/javascript/reset-password-for-email)
