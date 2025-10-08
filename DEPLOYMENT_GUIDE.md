# 🚀 Guía de Deployment para future-task.com

## ⚠️ Problema del Círculo Azul en Publish

Si el botón "Publish" muestra un círculo azul y no hace nada, hay varias soluciones:

### Solución 1: Deploy Manual desde Terminal

1. **Instala Vercel CLI** (si no lo tienes):
\`\`\`bash
npm i -g vercel
\`\`\`

2. **Login en Vercel**:
\`\`\`bash
vercel login
\`\`\`

3. **Deploy a producción**:
\`\`\`bash
vercel --prod
\`\`\`

### Solución 2: Deploy desde GitHub

1. **Conecta tu repositorio en Vercel**:
   - Ve a https://vercel.com/dashboard
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Configura el dominio `future-task.com`

2. **Configura las variables de entorno** en Vercel Dashboard:
   - Ve a Project Settings → Environment Variables
   - Copia todas las variables de `.env.production`

3. **Deploy automático**:
   - Cada push a `main` desplegará automáticamente

### Solución 3: Verifica la Conexión

\`\`\`bash
# Verifica que estás logueado
vercel whoami

# Lista tus proyectos
vercel list

# Link el proyecto actual
vercel link
\`\`\`

## 📋 Checklist Pre-Deploy

- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Dominio `future-task.com` configurado en Vercel
- [ ] DNS apuntando a Vercel
- [ ] SSL/HTTPS habilitado
- [ ] GitHub conectado (opcional pero recomendado)

## 🔧 Configuración de Dominio en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Settings → Domains**
3. **Add Domain**: `future-task.com`
4. **Configura DNS**:
   - Tipo: A
   - Nombre: @
   - Valor: 76.76.21.21

   - Tipo: CNAME
   - Nombre: www
   - Valor: cname.vercel-dns.com

## 🐛 Troubleshooting

### El deploy falla con errores de tipos
\`\`\`bash
npm run build
# Revisa los errores y corrígelos antes de deployar
\`\`\`

### Variables de entorno no funcionan
- Asegúrate de que empiezan con `NEXT_PUBLIC_` para las del cliente
- Verifica que están en Vercel Dashboard → Settings → Environment Variables

### El sitio muestra 404
- Verifica que el dominio está correctamente configurado
- Espera 24-48 horas para propagación de DNS

## 📞 Soporte

Si sigues teniendo problemas:
1. Revisa los logs en Vercel Dashboard
2. Contacta soporte de Vercel: https://vercel.com/support
3. Revisa la documentación: https://vercel.com/docs
