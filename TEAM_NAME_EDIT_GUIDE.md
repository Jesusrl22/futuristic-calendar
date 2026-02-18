## Cómo Cambiar el Nombre de los Equipos en Future Task

### Opciones para Editar Equipos

Ya tenemos **dos formas** para cambiar el nombre y descripción de tus equipos:

---

## 1. Editar desde la Tarjeta del Equipo (Forma Rápida)

**Ubicación:** `/app/teams` (Página de Teams)

**Pasos:**
1. Ve a **Teams** en el menú lateral
2. Pasa el mouse sobre la tarjeta del equipo que deseas editar
3. En la esquina superior derecha aparecerá un botón **Editar** (ícono de lápiz)
4. Haz clic para abrir el diálogo de edición
5. Modifica:
   - **Nombre del Equipo** (requerido)
   - **Descripción** (opcional)
6. Haz clic en **Guardar Cambios**

**Nota:** Solo aparece el botón si eres **Owner** o **Admin** del equipo.

---

## 2. Editar desde la Página de Detalle del Equipo (Forma Completa)

**Ubicación:** `/app/teams/[teamId]`

**Pasos:**
1. Selecciona un equipo desde la página de Teams
2. En la página de detalle, encontrarás el botón **Editar Equipo** en la esquina superior derecha
3. Se abrirá un diálogo con los campos:
   - **Nombre del Equipo** *
   - **Descripción**
4. Realiza los cambios necesarios
5. Haz clic en **Guardar Cambios**

---

## Funcionalidad Técnica

### Backend (API)

**Endpoint:** `PATCH /api/teams/[teamId]`

**Permisos Requeridos:**
- Rol: `owner` o `admin`

**Body:**
\`\`\`json
{
  "name": "Nuevo Nombre del Equipo",
  "description": "Nueva descripción"
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "team": {
    "id": "uuid",
    "name": "Nuevo Nombre del Equipo",
    "description": "Nueva descripción",
    "updated_at": "2024-01-01T00:00:00Z",
    ...
  }
}
\`\`\`

---

## Base de Datos

La tabla `teams` en Supabase tiene RLS habilitado con política:
- **"Owners and admins can update teams"**

Columnas que se actualizan:
- `name` (text)
- `description` (text)
- `updated_at` (timestamp con zona horaria)

---

## Validaciones

✓ El nombre debe tener al menos 1 carácter  
✓ Se trima automáticamente (se eliminan espacios al inicio/final)  
✓ La descripción puede estar vacía  
✓ Solo owners/admins pueden editar  

---

## Frontend (UI)

### Componentes Mejorados

#### 1. **Página de Teams Listado** (`/app/app/teams/page.tsx`)
- Botón Editar aparece al pasar mouse (hover)
- Diálogo modal para edición rápida
- Actualización en tiempo real

#### 2. **Página de Detalle** (`/app/app/teams/[teamId]/page.tsx`)
- Botón Editar en la parte superior
- Formulario completo con validaciones
- Indicadores visuales de carga

---

## Casos de Uso

- **Renombrar un equipo** cuando cambias su objetivo
- **Actualizar descripción** cuando agregas nuevos miembros
- **Corregir typos** en el nombre
- **Reflejar cambios organizacionales** en el nombre del equipo

---

## Flujo de Usuario

\`\`\`
Usuario (Owner/Admin)
    ↓
    Navega a Teams
    ↓
    Hoverea sobre tarjeta
    ↓
    Hace clic en botón Editar
    ↓
    Ingresa nuevo nombre/descripción
    ↓
    Hace clic "Guardar Cambios"
    ↓
    API actualiza en Supabase
    ↓
    UI actualiza en tiempo real
    ↓
    Cambios reflejados en todas partes
\`\`\`

---

## Permisos

| Rol | Puede Editar |
|-----|-------------|
| Owner | ✓ Sí |
| Admin | ✓ Sí |
| Member | ✗ No |

---

Última actualización: 2024
