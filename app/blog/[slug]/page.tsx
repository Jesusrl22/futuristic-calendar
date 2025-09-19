"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  image?: string
}

const blogPosts: Record<string, BlogPost> = {
  "productividad-2025": {
    id: "productividad-2025",
    title: "10 Estrategias para Maximizar tu Productividad en 2025",
    excerpt: "Descubre las técnicas más efectivas para ser más productivo en el nuevo año.",
    content: `
# 10 Estrategias para Maximizar tu Productividad en 2025

La productividad no se trata solo de hacer más cosas, sino de hacer las cosas correctas de manera más eficiente. En 2025, con la evolución de la tecnología y los cambios en el mundo laboral, es crucial adaptar nuestras estrategias de productividad.

## 1. Adopta la Técnica Pomodoro 2.0

La técnica Pomodoro tradicional ha evolucionado. Ahora incluye:
- **Bloques de 25 minutos** para tareas de concentración
- **Descansos activos** de 5 minutos con ejercicios de respiración
- **Revisión semanal** para optimizar los intervalos según tu ritmo natural

## 2. Implementa la Regla 2-Minutos Plus

Si una tarea toma menos de 2 minutos, hazla inmediatamente. Pero añade:
- **Agrupa tareas similares** de 2 minutos para hacer en bloques
- **Usa recordatorios inteligentes** para no interrumpir el flujo de trabajo

## 3. Domina el Arte del "Deep Work"

El trabajo profundo es más valioso que nunca:
- **Elimina todas las distracciones** durante 90-120 minutos
- **Programa bloques de trabajo profundo** en tu horario más productivo
- **Usa aplicaciones de bloqueo** para redes sociales y notificaciones

## 4. Automatiza Decisiones Rutinarias

Reduce la fatiga de decisión:
- **Planifica comidas** con anticipación
- **Establece un guardarropa minimalista**
- **Crea plantillas** para emails y documentos frecuentes

## 5. Practica la Gestión de Energía

No solo gestiones tu tiempo, gestiona tu energía:
- **Identifica tus horas pico** de energía mental
- **Programa tareas difíciles** durante estos períodos
- **Incluye descansos regulares** para mantener la energía

## 6. Utiliza la Matriz de Eisenhower Digital

Clasifica tareas en:
- **Urgente e Importante**: Hazlo ahora
- **Importante, no Urgente**: Programa
- **Urgente, no Importante**: Delega
- **Ni Urgente ni Importante**: Elimina

## 7. Implementa el Método GTD (Getting Things Done)

- **Captura todo** en un sistema confiable
- **Clarifica** qué significa cada elemento
- **Organiza** por contexto y prioridad
- **Reflexiona** semanalmente sobre tu sistema
- **Ejecuta** con confianza

## 8. Aprovecha la Inteligencia Artificial

La IA puede ser tu mejor aliada:
- **Automatiza tareas repetitivas** con herramientas de IA
- **Usa asistentes virtuales** para programar y recordatorios
- **Genera contenido base** que puedes refinar

## 9. Practica el "Batching"

Agrupa tareas similares:
- **Responde emails** en bloques específicos
- **Haz llamadas** en períodos dedicados
- **Procesa documentos** en sesiones concentradas

## 10. Mantén un Sistema de Revisión Continua

- **Revisión diaria**: 5 minutos al final del día
- **Revisión semanal**: 30 minutos para planificar la próxima semana
- **Revisión mensual**: Evalúa y ajusta tus sistemas

## Conclusión

La productividad en 2025 requiere un enfoque holístico que combine técnicas probadas con nuevas tecnologías. La clave está en encontrar el sistema que funcione para ti y mantenerlo actualizado.

Recuerda: la productividad no es un destino, es un viaje de mejora continua.
    `,
    author: "María González",
    date: "2025-01-15",
    readTime: "8 min",
    category: "Productividad",
    tags: ["productividad", "técnicas", "gestión del tiempo", "eficiencia"],
    image: "/productivity-workspace.png",
  },
  "futuro-trabajo-remoto": {
    id: "futuro-trabajo-remoto",
    title: "El Futuro del Trabajo Remoto: Cómo la IA está Transformando Equipos",
    excerpt: "Explora cómo la inteligencia artificial está revolucionando la colaboración remota.",
    content: `
# El Futuro del Trabajo Remoto: Cómo la IA está Transformando Equipos

El trabajo remoto ha dejado de ser una tendencia temporal para convertirse en una realidad permanente. Con la integración de la inteligencia artificial, estamos presenciando una transformación radical en cómo los equipos colaboran, se comunican y producen resultados.

## La Evolución del Trabajo Remoto

### Antes de la IA
- Videoconferencias básicas
- Herramientas de chat simples
- Gestión manual de proyectos
- Coordinación compleja entre zonas horarias

### Con IA Integrada
- **Traducción en tiempo real** durante reuniones
- **Asistentes virtuales** que programan automáticamente
- **Análisis predictivo** de productividad del equipo
- **Automatización inteligente** de tareas rutinarias

## Herramientas de IA que Están Cambiando el Juego

### 1. Asistentes de Reuniones Inteligentes
- **Transcripción automática** con identificación de hablantes
- **Resúmenes inteligentes** de puntos clave y acciones
- **Traducción simultánea** para equipos globales
- **Análisis de sentimientos** para medir el engagement

### 2. Gestión Predictiva de Proyectos
- **Estimación automática** de tiempos de entrega
- **Identificación de riesgos** antes de que ocurran
- **Optimización de recursos** basada en datos históricos
- **Recomendaciones de asignación** de tareas

### 3. Comunicación Mejorada
- **Chatbots especializados** para preguntas frecuentes
- **Análisis de comunicación** para mejorar la claridad
- **Sugerencias de timing** para mensajes importantes
- **Filtrado inteligente** de notificaciones

## Beneficios Tangibles de la IA en Equipos Remotos

### Para los Empleados
- **Reducción del 40%** en tiempo dedicado a tareas administrativas
- **Mejora del 60%** en la calidad de las reuniones
- **Disminución del 50%** en malentendidos de comunicación
- **Aumento del 35%** en satisfacción laboral

### Para las Empresas
- **Incremento del 25%** en productividad general
- **Reducción del 30%** en costos operativos
- **Mejora del 45%** en retención de talento
- **Aceleración del 50%** en tiempo de entrega de proyectos

## Casos de Uso Reales

### Empresa de Software Global
**Desafío**: Coordinación entre equipos en 12 zonas horarias diferentes.

**Solución IA**: 
- Asistente virtual que programa reuniones optimizando horarios
- Traducción automática de documentación técnica
- Bot de Slack que responde preguntas técnicas 24/7

**Resultado**: 
- 70% menos tiempo en coordinación
- 90% de satisfacción en comunicación intercultural

### Agencia de Marketing Digital
**Desafío**: Gestión de múltiples proyectos de clientes simultáneamente.

**Solución IA**:
- IA predictiva para estimar tiempos de campaña
- Automatización de reportes de progreso
- Análisis de rendimiento en tiempo real

**Resultado**:
- 50% más proyectos gestionados con el mismo equipo
- 95% de cumplimiento de deadlines

## Herramientas Recomendadas para 2025

### Nivel Básico (Equipos Pequeños)
1. **Otter.ai** - Transcripción de reuniones
2. **Calendly + IA** - Programación inteligente
3. **Grammarly Business** - Comunicación mejorada
4. **Notion AI** - Gestión de conocimiento

### Nivel Avanzado (Empresas Medianas)
1. **Microsoft Viva** - Suite completa de productividad
2. **Slack + Einstein** - Comunicación inteligente
3. **Asana Intelligence** - Gestión predictiva de proyectos
4. **Zoom IQ** - Análisis de reuniones

### Nivel Enterprise (Grandes Corporaciones)
1. **Salesforce Einstein** - CRM inteligente
2. **Microsoft 365 Copilot** - Asistente empresarial
3. **Google Workspace AI** - Colaboración avanzada
4. **Custom AI Solutions** - Soluciones personalizadas

## Desafíos y Consideraciones

### Privacidad y Seguridad
- **Encriptación end-to-end** para todas las comunicaciones
- **Políticas claras** sobre uso de datos
- **Auditorías regulares** de sistemas de IA
- **Capacitación en ciberseguridad** para equipos remotos

### Adopción y Cambio Cultural
- **Resistencia al cambio** en equipos tradicionales
- **Necesidad de capacitación** continua
- **Equilibrio entre automatización** y toque humano
- **Gestión de expectativas** realistas

## El Futuro: Qué Esperar en los Próximos 5 Años

### 2025-2027: Adopción Masiva
- IA integrada en todas las herramientas de trabajo
- Asistentes virtuales personalizados por rol
- Automatización del 80% de tareas administrativas

### 2027-2030: Transformación Completa
- Equipos híbridos humano-IA
- Predicción precisa de necesidades del equipo
- Espacios de trabajo virtuales completamente inmersivos

## Conclusión

La IA no está reemplazando a los trabajadores remotos; los está empoderando. Los equipos que adopten estas tecnologías ahora tendrán una ventaja competitiva significativa en el futuro del trabajo.

La clave está en encontrar el equilibrio perfecto entre la eficiencia de la IA y la creatividad humana, creando equipos remotos más productivos, satisfechos y exitosos que nunca.
    `,
    author: "Carlos Rodríguez",
    date: "2025-01-12",
    readTime: "12 min",
    category: "Tecnología",
    tags: ["trabajo remoto", "inteligencia artificial", "equipos", "futuro"],
    image: "/ai-technology.png",
  },
  "organizacion-digital-2025": {
    id: "organizacion-digital-2025",
    title: "Organización Personal en la Era Digital: Guía Completa 2025",
    excerpt: "Domina las herramientas digitales para organizar tu vida personal y profesional.",
    content: `
# Organización Personal en la Era Digital: Guía Completa 2025

En un mundo donde recibimos más de 120 notificaciones diarias y manejamos múltiples plataformas digitales, la organización personal se ha vuelto más crucial que nunca. Esta guía te ayudará a crear un sistema digital que realmente funcione.

## El Problema de la Sobrecarga Digital

### Estadísticas Alarmantes
- **67%** de las personas revisan su teléfono más de 160 veces al día
- **45%** se sienten abrumados por la cantidad de información digital
- **38%** pierden documentos importantes en la nube
- **52%** tienen más de 10,000 emails sin leer

### Síntomas de Desorganización Digital
- Múltiples versiones del mismo archivo
- Contraseñas olvidadas constantemente
- Calendarios desactualizados
- Notas dispersas en diferentes aplicaciones
- Suscripciones digitales olvidadas

## Los 5 Pilares de la Organización Digital

### 1. Sistema de Gestión de Información (PKM)

#### Método PARA
- **P**royectos: Cosas con deadline específico
- **A**reas: Responsabilidades continuas
- **R**ecursos: Temas de interés futuro
- **A**rchivo: Elementos inactivos de las categorías anteriores

#### Herramientas Recomendadas
- **Notion**: Para sistema completo PKM
- **Obsidian**: Para conexiones entre ideas
- **Logseq**: Para notas diarias estructuradas
- **Roam Research**: Para pensamiento no-lineal

### 2. Gestión de Tareas y Proyectos

#### Metodología GTD Digital
1. **Captura**: Inbox único para todo
2. **Clarifica**: ¿Es accionable? ¿Qué acción específica?
3. **Organiza**: Por contexto y energía requerida
4. **Reflexiona**: Revisión semanal obligatoria
5. **Ejecuta**: Con confianza total

#### Stack Tecnológico Recomendado
- **Todoist**: Para gestión avanzada de tareas
- **Things 3**: Para simplicidad y elegancia (Mac/iOS)
- **TickTick**: Para colaboración familiar
- **Asana**: Para proyectos de equipo

### 3. Calendario y Gestión del Tiempo

#### Técnica de Time Blocking 2.0
- **Bloques de trabajo profundo**: 90-120 minutos
- **Bloques de comunicación**: 30-60 minutos
- **Bloques de administración**: 15-30 minutos
- **Bloques de descanso**: 15-30 minutos

#### Configuración Óptima
- **Utiliza aplicaciones de gestión del tiempo** como Toggl o RescueTime
- **Programa tus bloques de trabajo** en Google Calendar o Outlook
- **Establece recordatorios** para cada bloque de tiempo
- **Monitorea tu productividad** y ajusta tus bloques según sea necesario
    `,
    author: "Ana López",
    date: "2025-01-10",
    readTime: "10 min",
    category: "Organización",
    tags: ["organización digital", "plataformas digitales", "sistema de información"],
    image: "/digital-organization.png",
  },
}

const BlogPostPage = () => {
  const { slug } = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const post = blogPosts[slug]

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="max-w-4xl w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center space-x-2">
              <Badge>{post.category}</Badge>
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <div className="mb-4">
            {post.image && (
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full rounded-lg" />
            )}
          </div>
          <div className="prose max-w-none">
            <p>{post.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </CardContent>
      </Card>
      <LanguageSelector />
    </div>
  )
}

export default BlogPostPage
