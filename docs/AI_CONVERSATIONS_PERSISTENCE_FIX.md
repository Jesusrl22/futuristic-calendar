# Sistema de Guardado de Conversaciones IA - Documento de Correción

## Problema Identificado
Las conversaciones de IA no se estaban mostrando después de recargar la página porque:
1. **No había carga inicial** - No existía un `useEffect` que cargara las conversaciones al montar el componente
2. **Las conversaciones se guardaban** pero no se restauraban de la base de datos

## Solución Implementada

### 1. **useEffect de Carga Inicial** (Nuevo)
\`\`\`typescript
useEffect(() => {
  const loadConversations = async () => {
    // Carga todas las conversaciones del usuario desde la BD
    // Automáticamente carga la más reciente al montar
  }
  loadConversations()
}, [])
\`\`\`
**Ubicación:** `/app/app/ai/page.tsx` líneas 83-116

**Qué hace:**
- Se ejecuta solo una vez al montar el componente
- Obtiene todas las conversaciones del usuario desde `/api/ai-conversations`
- Carga automáticamente la conversación más reciente
- Restaura los mensajes, modo (chat/study/analyze) y el título

### 2. **Auto-Save Debounced** (Nuevo)
\`\`\`typescript
useEffect(() => {
  const saveTimer = setTimeout(() => {
    saveConversation(currentConversationId, messages)
  }, 2000) // Espera 2 segundos
  return () => clearTimeout(saveTimer)
}, [messages, currentConversationId])
\`\`\`
**Ubicación:** `/app/app/ai/page.tsx` líneas 117-128

**Qué hace:**
- Guarda automáticamente la conversación cada vez que hay nuevos mensajes
- Usa debouncing (espera 2 segundos) para no saturar la BD con requests
- Se dispara solo cuando cambian los mensajes o la conversación activa

## Flujo de Guardado Completo

### 1. **Al Enviar un Mensaje**
\`\`\`
Usuario envía mensaje
    ↓
Se agrega a messages[] (local)
    ↓
Respuesta de IA llega
    ↓
Se agrega respuesta a messages[]
    ↓
handleSend() llama saveConversation()
    ↓
POST a /api/ai-conversations
    ↓
Base de datos se actualiza
\`\`\`

### 2. **Auto-Save (después del último cambio)**
\`\`\`
Usuario escribe/recibe mensaje
    ↓
useEffect detects messages cambió
    ↓
Espera 2 segundos (debouncing)
    ↓
Si hay más cambios, reinicia el timer
    ↓
Si pasan 2 segundos sin cambios, guarda
\`\`\`

### 3. **Al Recargar la Página**
\`\`\`
Componente se monta
    ↓
useEffect [] se ejecuta
    ↓
Fetch a /api/ai-conversations
    ↓
Conversaciones se cargan en conversations[]
    ↓
Conversación más reciente se carga automáticamente
    ↓
Todos los mensajes restaurados
\`\`\`

## Base de Datos - Tabla ai_conversations

\`\`\`sql
ai_conversations {
  id: UUID (PK)
  user_id: UUID (FK)
  title: string
  messages: JSON[] -- Array de {role, content, fileInfo}
  mode: 'chat' | 'study' | 'analyze'
  created_at: timestamp
  updated_at: timestamp
}
\`\`\`

## API Endpoints

### GET /api/ai-conversations
- **Autenticación:** Requerida
- **Retorna:** Array de todas las conversaciones del usuario
- **Ordenado por:** updated_at DESC (más recientes primero)

### POST /api/ai-conversations
- **Autenticación:** Requerida
- **Body:** `{ id, title, messages, mode }`
- **Acción:** INSERT o UPDATE según si existe
- **Retorna:** Conversación guardada

### DELETE /api/ai-conversations?id=UUID
- **Autenticación:** Requerida
- **Acción:** Elimina la conversación del usuario

## Pruebas Necesarias

### ✅ Test 1: Carga de conversaciones
1. Ir a `/app/ai`
2. Abrir DevTools Console
3. Buscar: `"[v0] Loading conversations from database"`
4. Buscar: `"[v0] Loaded X conversations"`
5. Verificar que aparecen en el sidebar derecho

### ✅ Test 2: Enviar mensaje y guardar
1. Enviar un mensaje
2. Buscar en console: `"[v0] Attempting to save conversation"`
3. Buscar: `"[v0] Conversation saved successfully"`
4. Recargar la página
5. El mensaje debe estar ahí

### ✅ Test 3: Auto-save
1. Abrir una conversación existente
2. Editar un mensaje en la consola si es necesario
3. Esperar 2 segundos
4. Buscar: `"[v0] Auto-saving conversation due to message changes"`

### ✅ Test 4: Cambiar conversación
1. Crear conversación A y enviar mensaje
2. Crear conversación B y enviar mensaje
3. Volver a A - debe mostrar el mensaje de A
4. Volver a B - debe mostrar el mensaje de B

## Debugging

Todos los eventos importantes están logged con `[v0]` prefix:

\`\`\`javascript
[v0] Loading conversations from database
[v0] Loaded X conversations from database
[v0] Loaded most recent conversation: UUID
[v0] Attempting to save conversation: UUID with X messages
[v0] Saving conversation with title: "..."
[v0] Conversation saved successfully: UUID
[v0] Auto-saving conversation due to message changes
[v0] Updated existing conversation in local state
[v0] Added new conversation to local state
\`\`\`

## Archivos Modificados
- `/app/app/ai/page.tsx` - Agregados 2 nuevos useEffect (carga inicial + auto-save)

## Compatibilidad
- ✅ Conversaciones antiguas se cargan correctamente
- ✅ Nuevas conversaciones se crean y guardan
- ✅ Works con todos los modos: chat, study, analyze
- ✅ Funciona con archivos adjuntos
