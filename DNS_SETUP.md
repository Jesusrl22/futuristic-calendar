# 🌐 Configuración DNS para future-task.com

## ⚠️ IMPORTANTE: El dominio debe estar configurado ANTES de que funcione

Para que https://future-task.com funcione, necesitas:

## 📋 Paso 1: Verifica que tienes el dominio

1. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.)
2. Verifica que tienes `future-task.com` registrado
3. Si NO lo tienes, debes comprarlo primero

## 📋 Paso 2: Agrega el dominio en Vercel

1. Ve a https://vercel.com/dashboard
2. Click en tu proyecto
3. Click en **"Settings"** (arriba)
4. Click en **"Domains"** (menú izquierdo)
5. En el campo "Domain", escribe: `future-task.com`
6. Click en **"Add"**

## 📋 Paso 3: Configura los DNS Records

Vercel te dará instrucciones específicas. Generalmente son:

### Opción A: Nameservers (RECOMENDADO)
Cambia los nameservers en tu proveedor a:
\`\`\`
ns1.vercel-dns.com
ns2.vercel-dns.com
\`\`\`

### Opción B: A Records
Si no puedes cambiar nameservers, agrega estos records:

**Tipo A:**
\`\`\`
Host: @
Value: 76.76.21.21
TTL: 3600
\`\`\`

**Tipo A:**
\`\`\`
Host: www
Value: 76.76.21.21
TTL: 3600
\`\`\`

## 📋 Paso 4: Espera la Propagación

⏰ **Tiempo de espera:** 10 minutos a 48 horas
- Normalmente tarda 10-30 minutos
- Puede tardar hasta 48 horas en casos raros

## ✅ Paso 5: Verifica que funciona

Una vez configurado, visita:
- https://future-task.com ✅
- https://www.future-task.com ✅

## 🔍 Cómo verificar el estado

### En Vercel Dashboard:
1. Ve a Settings → Domains
2. Verás el estado del dominio:
   - ✅ **Valid Configuration** = Funciona
   - ⏳ **Pending** = Esperando DNS
   - ❌ **Invalid Configuration** = Error en DNS

### Con herramientas online:
- https://dnschecker.org
- Ingresa `future-task.com`
- Verifica que apunta a Vercel

## 🚨 Problemas comunes

### "Domain not verified"
**Solución:** Espera 30 minutos más o verifica los DNS records

### "SSL Certificate Error"
**Solución:** Vercel genera el certificado automáticamente, espera 10 minutos

### "This site can't be reached"
**Solución:** Los DNS aún no se han propagado, espera más tiempo

## 📞 ¿Necesitas ayuda?

Si después de 24 horas no funciona:
1. Verifica que los DNS records estén correctos
2. Contacta a tu proveedor de dominio
3. Contacta al soporte de Vercel

---

**NOTA:** Mientras tanto, tu app funciona en:
- URL temporal: `https://tu-proyecto.vercel.app`
