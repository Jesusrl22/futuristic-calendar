# Cómo Arreglar el Registro

El problema del registro es que Supabase requiere confirmación de email por defecto. Para desarrollo, necesitas deshabilitarlo:

## Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. Ve a https://supabase.com/dashboard/project/tdlrurbsfbdwpwwwzvqh/settings/auth
2. Busca la sección "Email Auth"
3. Deshabilita "Enable email confirmations"
4. Guarda los cambios

## Opción 2: Usar el Admin API (Ya implementado)

El código ya usa el admin API con `email_confirm: true` que debería funcionar, pero si Supabase está configurado para requerir confirmación, puede fallar.

## Solución Alternativa

Si no puedes cambiar la configuración de Supabase:

1. El signup enviará un email de confirmación
2. El usuario debe hacer clic en el link del email
3. Luego puede hacer login normalmente

## Para Producción

En producción, DEBERÍAS mantener la confirmación de email activada para seguridad. El código ya maneja ambos casos:
- Si `email_confirm: true` funciona, el usuario puede login inmediatamente
- Si no, se muestra un mensaje para revisar el email
