# 🌐 Guía para Configurar tu Dominio Personalizado

## Opción A: Ya tengo un dominio (ej: tudominio.com)

### Paso 1: Agregar el dominio en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Settings** → **Domains**
3. Click en **"Add"**
4. Escribe tu dominio: `tudominio.com` o `app.tudominio.com`
5. Click en **"Add"**

### Paso 2: Configurar DNS

Vercel te mostrará los registros DNS que necesitas agregar. Ve al panel de tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.) y agrega:

**Para dominio raíz (tudominio.com):**
\`\`\`
Tipo: A
Nombre: @
Valor: 76.76.21.21
\`\`\`

**Para subdominio (app.tudominio.com):**
\`\`\`
Tipo: CNAME
Nombre: app
Valor: cname.vercel-dns.com
\`\`\`

### Paso 3: Esperar propagación DNS
- Puede tardar de 5 minutos a 48 horas
- Vercel verificará automáticamente cuando esté listo
- Verás un ✅ verde cuando funcione

### Paso 4: Actualizar variables de entorno

1. Ve a **Settings** → **Environment Variables**
2. Edita `NEXT_PUBLIC_BASE_URL`
3. Cambia a: `https://tudominio.com`
4. Click en **Save**
5. Ve a **Deployments** → Redeploy el último deployment

### Paso 5: Actualizar PayPal URLs

1. Ve a [PayPal Developer](https://developer.paypal.com)
2. En tu app, actualiza:
   - **Return URL**: `https://tudominio.com/payment/success`
   - **Cancel URL**: `https://tudominio.com/payment/cancel`
   - **Webhook URL**: `https://tudominio.com/api/paypal/webhook`

---

## Opción B: No tengo dominio - ¿Dónde comprarlo?

### Proveedores recomendados:

1. **Namecheap** (Recomendado - Barato y fácil)
   - Precio: ~$10-15/año
   - Web: [namecheap.com](https://www.namecheap.com)
   - Fácil integración con Vercel

2. **Cloudflare** (Más barato)
   - Precio: ~$8-10/año
   - Web: [cloudflare.com](https://www.cloudflare.com)
   - Incluye CDN gratis

3. **Google Domains** (Ahora Squarespace)
   - Precio: ~$12-15/año
   - Web: [domains.google](https://domains.google.com)

4. **GoDaddy** (Popular pero más caro)
   - Precio: ~$15-20/año
   - Web: [godaddy.com](https://www.godaddy.com)

### Después de comprar el dominio:
Sigue los pasos de la **Opción A** arriba ☝️

---

## Opción C: Usar dominio gratuito de Vercel temporalmente

Si quieres lanzar YA y comprar dominio después:

1. Usa la URL gratuita: `https://tu-app.vercel.app`
2. Configura `NEXT_PUBLIC_BASE_URL=https://tu-app.vercel.app`
3. Cuando compres tu dominio, solo actualiza la variable de entorno

---

## 🔧 Solución de problemas

### El dominio no funciona después de 24 horas

1. Verifica los registros DNS en [whatsmydns.net](https://www.whatsmydns.net)
2. Asegúrate de haber configurado el registro A o CNAME correctamente
3. Algunos proveedores usan `@` otros usan el dominio completo

### Error "Domain not verified"

1. Espera un poco más (puede tardar hasta 48h)
2. Verifica que los registros DNS estén correctos
3. Contacta soporte de Vercel si persiste

### PayPal no funciona con el nuevo dominio

1. Actualiza TODAS las URLs en PayPal Developer
2. Espera 5-10 minutos para que PayPal actualice
3. Verifica que `NEXT_PUBLIC_BASE_URL` esté correcta

---

## ✅ Checklist final

- [ ] Dominio agregado en Vercel
- [ ] Registros DNS configurados
- [ ] DNS propagado (verificado en whatsmydns.net)
- [ ] `NEXT_PUBLIC_BASE_URL` actualizada
- [ ] Proyecto redeployado
- [ ] PayPal URLs actualizadas
- [ ] SSL/HTTPS funcionando (automático con Vercel)

---

## 💡 Tips

1. **Siempre usa HTTPS** - Vercel lo configura automáticamente
2. **Usa www o no-www, pero no ambos** - Vercel redirige automáticamente
3. **Espera 24h antes de preocuparte** - DNS puede tardar
4. **Guarda tu URL antigua** - Por si necesitas revertir

---

## 🆘 ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica el estado en Vercel Dashboard
2. Revisa los logs de deployment
3. Usa la comunidad de Vercel: [vercel.com/support](https://vercel.com/support)
