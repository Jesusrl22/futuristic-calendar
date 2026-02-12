# 🚀 GUÍA RÁPIDA - Sistema de Reset de Contraseña con Zoho SMTP

## ¿QUÉ SE HIZO?

Se reemplazó el sistema de emails de Supabase por **nodemailer + Zoho SMTP**, que es más confiable y funciona directamente.

### Cambios en el Código:
- ✅ `/app/api/auth/forgot-password/route.ts` - Envía email con Zoho
- ✅ `/app/api/auth/reset-password/route.ts` - Valida token y actualiza contraseña
- ✅ Base de datos - Agregados campos para tokens

---

## 📋 QUÉ TIENES QUE HACER AHORA

### PASO 1: Obtener Contraseña de Zoho (2 minutos)

1. Abre: https://mail.zoho.eu/u/security
2. En "Connected Devices" → "Generate new app password"
3. Selecciona:
   - App type: **Mail**
   - Device: **Other**
   - Name: **Calendario App**
4. **Copia** la contraseña que se genera

### PASO 2: Configurar en Vercel (3 minutos)

1. Abre tu proyecto en Vercel
2. Abre: **Settings → Environment Variables**
3. Agrega estas 6 variables:

| Variable | Valor |
|----------|-------|
| `SMTP_HOST` | `smtp.zoho.eu` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | tu_email@tudominio.com |
| `SMTP_PASSWORD` | *La contraseña que copiaste* |
| `SMTP_FROM` | tu_email@tudominio.com |
| `NEXT_PUBLIC_APP_URL` | https://tu-dominio.vercel.app |

4. Haz clic en "Save"
5. **Espera a que se redeploy** (automático)

### PASO 3: Probar el Sistema (2 minutos)

1. Abre: `https://tudominio.vercel.app/forgot-password`
2. Ingresa un email registrado
3. Revisa tu bandeja en Zoho Mail
4. Haz clic en el link del email
5. Ingresa nueva contraseña
6. Verifica que puedas loguearte

---

## 📧 EJEMPLO DE EMAIL QUE RECIBIRAS

```
De: tu_email@tudominio.com
Asunto: Restablecer tu contraseña

Restablecer tu contraseña
Recibimos una solicitud para restablecer tu contraseña.
Haz clic en el botón para continuar:

[BOTÓN: Restablecer Contraseña]

O copia este link:
https://tu-dominio.vercel.app/reset-password?token=abc123xyz...

Este enlace expirará en 1 hora.
Si no solicitaste esto, ignora este email.
```

---

## 🧪 TESTS RÁPIDOS

### Test 1: ¿Está bien configurado?
```bash
# En tu terminal local
cat > test.json << 'EOF'
{"email": "test@example.com"}
EOF
curl -X POST https://tudominio.vercel.app/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d @test.json
```

### Test 2: Revisa los logs
```
Vercel Dashboard → Deployments → Functions → Logs
Busca: [v0] Email de reset enviado exitosamente
```

---

## ⚠️ ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "Invalid login credentials" | Usa contraseña de APP, no password normal |
| "connect ECONNREFUSED" | Puerto debe ser 465, host es smtp.zoho.eu |
| "Token inválido/expirado" | El link tiene 1 hora de vida, solicita uno nuevo |
| No recibo email | Revisa SPAM, o verifica que usuario exista |

---

## 🔐 SEGURIDAD

✅ Tokens únicos (32 bytes aleatorios)
✅ Vencen en 1 hora
✅ No se revela si email existe
✅ Contraseña NO se envía por email
✅ Funciona solo con HTTPS en producción

---

## 📞 SOPORTE

Si algo no funciona:

1. Revisa que las 6 variables estén en Vercel
2. Espera 5 minutos (tiempo de redeploy)
3. Abre los logs en Vercel: `Deployments → Functions`
4. Busca mensajes con `[v0]`

---

## ✅ CHECKLIST FINAL

- [ ] Obtuve contraseña de app en Zoho
- [ ] Agregué 6 variables en Vercel
- [ ] Esperé a que Vercel redeploy
- [ ] Probé el formulario /forgot-password
- [ ] Recibí el email
- [ ] Hice clic en el link
- [ ] Restablecí la contraseña
- [ ] Pude logearme con la nueva contraseña

---

¡Listo! Tu sistema de reset de contraseña ya está funcionando con Zoho SMTP. 🎉
