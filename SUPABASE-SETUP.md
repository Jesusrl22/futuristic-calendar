# Supabase Setup Instructions

Para que el registro de usuarios funcione correctamente, necesitas configurar tu proyecto de Supabase.

## Paso 1: Desactivar Confirmación de Email (Desarrollo)

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/tdlrurbsfbdwpwwwzvqh
2. Ve a **Authentication** → **Providers**
3. Encuentra la sección **Email**
4. **Desactiva** la opción "Confirm email"
5. Guarda los cambios

Esto permitirá que los usuarios se registren e inicien sesión inmediatamente sin necesidad de confirmar su email.

## Paso 2: Verificar las Políticas RLS

Las políticas RLS ya están configuradas correctamente en tu tabla `users`:
- ✅ Users can read own data
- ✅ Users can update own data
- ✅ Users can insert own profile

## Paso 3: Probar el Registro

Después de desactivar la confirmación de email:

1. Ve a `/signup`
2. Regístrate con un nuevo email
3. Deberías ser redirigido automáticamente a `/app`

## Solución de Problemas

### Si el registro sigue fallando:

1. **Verifica las credenciales de Supabase** en las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Verifica los logs del servidor** en la consola de v0 para ver el error exacto

3. **Verifica los logs de Supabase**:
   - Ve a **Logs** → **Auth logs** en tu dashboard de Supabase
   - Busca errores relacionados con la creación de usuarios

### Para Producción

Cuando estés listo para producción:
1. **Activa** la confirmación de email nuevamente
2. Configura el SMTP en Supabase para enviar emails
3. Actualiza el flujo de signup para manejar la confirmación
