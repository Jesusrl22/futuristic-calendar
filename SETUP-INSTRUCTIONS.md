# Future Task - Instrucciones de Configuración

## Problema Actual
El registro de usuarios falla con el error "Database error creating new user".

## Solución

### Paso 1: Configurar Supabase
1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/tdlrurbsfbdwpwwwzvqh
2. Ve a **SQL Editor** (icono de base de datos en el menú izquierdo)
3. Copia y pega TODO el contenido del archivo `scripts/complete-setup.sql`
4. Haz clic en **RUN** para ejecutar el script

### Paso 2: Deshabilitar confirmación de email (Desarrollo)
1. En Supabase, ve a **Authentication** > **Settings**
2. Busca **"Enable Email Confirmations"**
3. **Desactívalo** (para poder iniciar sesión inmediatamente después del registro)

### Paso 3: Configurar contraseña de admin
1. En v0, ve a la pestaña **Vars** en el sidebar
2. Agrega una nueva variable:
   - Key: `ADMIN_PASSWORD`
   - Value: `admin123` (o la contraseña que quieras)

### Paso 4: Probar el registro
1. Ve a https://future-task.com/signup
2. Registra un usuario de prueba
3. Deberías ver "Account created! Redirecting to login..."
4. Inicia sesión en /login
5. Deberías entrar a /app

### Paso 5: Verificar en el admin
1. Ve a https://future-task.com/admin
2. Inicia sesión con:
   - Usuario: `admin`
   - Contraseña: `admin123` (o la que configuraste)
3. Deberías ver todos los usuarios registrados

## Si sigue sin funcionar
Revisa la consola del navegador (F12) para ver los logs detallados que empiezan con `[v0]`.
