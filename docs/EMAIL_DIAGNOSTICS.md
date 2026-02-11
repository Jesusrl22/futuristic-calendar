## Diagnóstico de Emails - Future Task

### Cambios Realizados

1. **Endpoint de Test**: `/api/test-email` (POST)
   - Prueba si Supabase puede enviar emails
   - Usa `resetPasswordForEmail()` para test
   - Devuelve detalles del error si falla

2. **Signup Mejorado**: `/app/api/auth/signup/route.ts`
   - Ahora usa `supabase.auth.admin.generateLink()` tipo "signup"
   - Envía email de verificación automáticamente
   - Si el email falla, devuelve error claro

### Cómo Verificar que Supabase SMTP esté Configurado

1. Abre Vercel en tu proyecto
2. Ve a **Settings → Environment Variables**
3. Busca estas variables (deben estar ALL):
   - `NEXT_PUBLIC_SUPABASE_URL` ✓
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
   - `SUPABASE_SERVICE_ROLE_KEY` ✓

### Cómo Testear Emails

**Opción 1: Test Manual**
\`\`\`bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com"}'
\`\`\`

**Opción 2: En el navegador**
1. Abre DevTools (F12)
2. Ve a Console
3. Ejecuta:
\`\`\`javascript
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'tu@email.com' })
}).then(r => r.json()).then(console.log)
\`\`\`

4. Revisa la respuesta y los logs en Vercel

### Si los Emails No Se Envían

**Verify in Supabase Dashboard:**

1. Ve a **Authentication → Providers → Email**
2. Verifica que "Enable Email" está ON
3. Ve a **Authentication → Email Templates**
4. Verifica que templates están configurados

**Si no hay templates:**
- Supabase usar defaults automáticamente
- Pero puedes personalizarlos si quieres

**Si todavía no funciona:**
- Revisa Supabase logs: **Project → Logs → Auth**
- Busca errores SMTP allí

### Flujo Actual de Registro

\`\`\`
Usuario signup
  ↓
Supabase crea usuario (email_confirm: false)
  ↓
Supabase envía email de verificación
  ↓
Usuario hace clic en email
  ↓
/auth/callback procesa token
  ↓
Email verificado ✓
  ↓
Usuario puede iniciar sesión
\`\`\`

### Notas

- El endpoint `/api/test-email` usa `resetPasswordForEmail()` como prueba
- El signup usa `generateLink(type: "signup")` para email de verificación
- Ambos dependen de Supabase SMTP configurado

---

**Próximo paso:** Ejecuta `/api/test-email` con tu email y comparte la respuesta del error si no funciona.
