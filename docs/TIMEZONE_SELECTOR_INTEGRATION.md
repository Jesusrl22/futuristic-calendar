# Integración del Selector de Zona Horaria en Settings

## Dónde Integrar

La página de configuración ya tiene la estructura lista para agregar el selector de zona horaria. Busca la sección de "Personal Settings" o "Preferences" y agrega el componente.

## Código de Integración

### 1. Importar el componente en `/app/app/settings/page.tsx`

En la parte superior del archivo, agrega:

```typescript
import { TimezoneSelect } from "@/components/timezone-selector"
```

### 2. Usar el componente en el formulario

En el lugar donde quieras que aparezca el selector (recomendado: después del selector de idioma), agrega:

```typescript
<TimezoneSelect
  value={profile.timezone}
  onChange={(newTimezone) => {
    setProfile({ ...profile, timezone: newTimezone })
  }}
  disabled={loading}
/>
```

### 3. Asegúrate de que se guarde en la API

Verifica que el endpoint `/api/settings` esté guardando la zona horaria:

```typescript
// En tu POST /api/settings
const { timezone } = await req.json()

await supabase
  .from('users')
  .update({ timezone })
  .eq('id', userId)
```

## Estructura Esperada

```tsx
export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileType>({
    // ... otros campos
    timezone: "UTC",
    // ... otros campos
  })

  // ... useEffects ...

  return (
    <div className="space-y-6">
      {/* ... otras secciones ... */}

      <Card>
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TimezoneSelect
            value={profile.timezone}
            onChange={(newTimezone) => {
              setProfile({ ...profile, timezone: newTimezone })
              saveProfile() // Opcional: guardar automáticamente
            }}
            disabled={loading}
          />
        </CardContent>
      </Card>

      {/* ... más secciones ... */}
    </div>
  )
}
```

## Configuración de Guardado Automático

Opción 1: Guardar al cambiar
```typescript
const handleTimezoneChange = async (newTimezone: string) => {
  setProfile({ ...profile, timezone: newTimezone })
  
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timezone: newTimezone })
    })
    toast({ title: "Timezone updated successfully" })
  } catch (error) {
    toast({ title: "Error updating timezone", variant: "destructive" })
  }
}

<TimezoneSelect
  value={profile.timezone}
  onChange={handleTimezoneChange}
/>
```

Opción 2: Guardar con botón "Save Settings"
```typescript
const saveProfile = async () => {
  setLoading(true)
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timezone: profile.timezone,
        // ... otros campos ...
      })
    })
    toast({ title: "Settings saved successfully" })
  } finally {
    setLoading(false)
  }
}
```

## Verificación Post-Integración

Después de agregar el componente, verifica:

1. ✅ El selector aparece en la página de settings
2. ✅ Puedes seleccionar diferentes zonas horarias
3. ✅ El valor se guarda en la base de datos: 
   ```sql
   SELECT timezone FROM users WHERE id='your-user-id';
   ```
4. ✅ Las tareas se resetean a medianoche en tu zona horaria

## Estilos Personalizados

Si deseas personalizar los estilos, el componente usa clases estándar de Shadcn:

```css
/* Ya está incluido en globals.css */
```

El componente es totalmente responsivo y se ajusta automáticamente a dispositivos móviles.

## Prueba Rápida

Para probar el sistema completo:

1. Ve a Settings
2. Cambia tu zona horaria a una diferente
3. Guarda los cambios
4. Verifica que se haya guardado:
   ```sql
   SELECT timezone FROM users WHERE email='tu-email@example.com';
   ```
5. Las próximas ejecuciones del CRON respetarán tu nueva zona horaria

¡Listo! Tu sistema de reset de tareas por zona horaria está completamente implementado y funcional.
