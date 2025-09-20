"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, User } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  content: string
  excerpt: string
  image: string
  date: string
  readTime: string
  category: string
  author: {
    name: string
    role: string
    avatar: string
  }
  tags: string[]
  relatedPosts: string[]
}

const blogPosts: Record<string, BlogPost> = {
  "productividad-2025": {
    slug: "productividad-2025",
    title: "10 Estrategias para Maximizar tu Productividad en 2025",
    excerpt: "Descubre las técnicas más efectivas para ser más productivo en el nuevo año con herramientas de IA.",
    image: "/productivity-workspace.png",
    date: "15 Ene 2025",
    readTime: "8 min",
    category: "Productividad",
    author: {
      name: "Dr. Elena Martínez",
      role: "Experta en Productividad",
      avatar: "/professional-woman-diverse.png",
    },
    tags: ["Productividad", "IA", "Estrategias", "2025", "Eficiencia"],
    relatedPosts: ["futuro-trabajo-remoto", "organizacion-digital-2025"],
    content: `
# 10 Estrategias para Maximizar tu Productividad en 2025

El año 2025 marca un punto de inflexión en cómo trabajamos y gestionamos nuestro tiempo. Con la integración masiva de la inteligencia artificial en nuestras herramientas diarias, tenemos oportunidades sin precedentes para optimizar nuestra productividad.

## 1. Adopta la IA como tu Copiloto Personal

La inteligencia artificial ya no es el futuro; es el presente. Herramientas como **FutureTask** utilizan IA para:

- **Priorización automática**: La IA analiza tus patrones de trabajo y sugiere qué tareas abordar primero
- **Planificación inteligente**: Optimiza tu calendario basándose en tu energía y disponibilidad
- **Automatización de rutinas**: Elimina tareas repetitivas para que te enfoques en lo importante

> "La IA no reemplaza la creatividad humana, la amplifica" - Dr. Elena Martínez

## 2. Implementa el Método de Bloques de Tiempo 2.0

El tradicional time-blocking evoluciona con IA:

### Bloques Adaptativos
- **Duración flexible**: La IA ajusta la duración según la complejidad de la tarea
- **Buffers inteligentes**: Añade tiempo extra automáticamente para tareas complejas
- **Sincronización contextual**: Agrupa tareas similares para maximizar el flujo

### Ejemplo Práctico

Imagina que tienes estas tareas:
1. Escribir propuesta de proyecto (2 horas estimadas)
2. Revisar emails (30 minutos)
3. Llamada con cliente (1 hora)

La IA de FutureTask analizaría:
- Tu energía histórica por horas del día
- La complejidad de cada tarea
- Tus patrones de interrupción

Y crearía un horario optimizado como:
- 9:00-11:30: Escribir propuesta (bloque de alta energía + buffer)
- 11:30-12:00: Revisar emails (transición)
- 14:00-15:00: Llamada con cliente (post-almuerzo, energía media)

## 3. Utiliza la Técnica Pomodoro Inteligente

### Pomodoros Adaptativos
- **25 minutos** para tareas rutinarias
- **45 minutos** para trabajo creativo profundo
- **15 minutos** para tareas administrativas
- **90 minutos** para proyectos complejos

### Métricas que Importan
- **Tasa de completación**: >85% de pomodoros completados
- **Calidad del enfoque**: Medida por interrupciones
- **Energía residual**: Cómo te sientes después de cada sesión

## 4. Automatiza las Decisiones Pequeñas

### Decisiones que Puedes Automatizar
- **Qué ropa usar**: Planifica outfits semanalmente
- **Qué desayunar**: Menú fijo para días laborables
- **Cuándo hacer ejercicio**: Horario fijo, no negociable
- **Qué tareas hacer primero**: Deja que la IA decida

### Beneficio Cognitivo
Cada decisión pequeña que automatizas libera energía mental para decisiones importantes. Steve Jobs usaba el mismo outfit diariamente por esta razón.

## 5. Implementa la Regla de los 2 Minutos Plus

### Versión Tradicional
Si algo toma menos de 2 minutos, hazlo inmediatamente.

### Versión 2025 con IA
- **Menos de 2 minutos**: Hazlo ahora
- **2-5 minutos**: Programa para el próximo "bloque de tareas rápidas"
- **5+ minutos**: Agenda específicamente con contexto y recursos

### Herramientas Recomendadas
- **Todoist** con IA para categorización automática
- **Notion** para captura rápida con templates
- **FutureTask** para programación inteligente

## 6. Domina el Arte del "No" Estratégico

### Framework RICE para Decisiones
Evalúa cada oportunidad con:
- **R**each: ¿A cuántas personas impacta?
- **I**mpact: ¿Qué tan significativo es el impacto?
- **C**onfidence: ¿Qué tan seguro estás del resultado?
- **E**ffort: ¿Cuánto esfuerzo requiere?

### Respuestas Preparadas
- "Suena interesante, pero no se alinea con mis prioridades actuales"
- "Mi calendario está completo hasta [fecha], ¿podemos revisarlo entonces?"
- "No es mi área de expertise, te recomiendo hablar con [persona]"

## 7. Optimiza tu Entorno Digital

### Configuración de Dispositivos
- **Teléfono**: Solo notificaciones críticas durante horas de trabajo
- **Computadora**: Escritorio limpio, apps organizadas por frecuencia de uso
- **Navegador**: Máximo 5 pestañas abiertas simultáneamente

### Apps Esenciales para 2025
1. **FutureTask**: Gestión integral con IA
2. **Forest**: Mantener el enfoque
3. **RescueTime**: Análisis de tiempo automático
4. **Grammarly**: Comunicación eficiente
5. **Calendly**: Programación sin fricción

## 8. Practica la Recuperación Activa

### Tipos de Descanso
- **Descanso físico**: Caminar, estirar, ejercicio ligero
- **Descanso mental**: Meditación, respiración profunda
- **Descanso social**: Conversación casual con colegas
- **Descanso creativo**: Dibujar, música, actividades artísticas

### Protocolo 52-17
Basado en estudios de DeskTime:
- **52 minutos** de trabajo enfocado
- **17 minutos** de descanso activo
- Repetir máximo 4 ciclos por día

## 9. Implementa Revisiones Sistemáticas

### Revisión Diaria (5 minutos)
- ¿Qué logré hoy?
- ¿Qué obstáculos encontré?
- ¿Qué haré diferente mañana?

### Revisión Semanal (30 minutos)
- Análisis de métricas de productividad
- Ajuste de sistemas y procesos
- Planificación de la próxima semana

### Revisión Mensual (2 horas)
- Evaluación de objetivos a largo plazo
- Actualización de sistemas y herramientas
- Planificación estratégica

## 10. Cultiva la Mentalidad de Crecimiento Continuo

### Aprendizaje Micro
- **5 minutos diarios** leyendo sobre tu industria
- **1 podcast** por semana sobre productividad
- **1 curso online** por trimestre para nuevas habilidades

### Experimentación Constante
- Prueba una nueva técnica cada mes
- Mide resultados objetivamente
- Adopta lo que funciona, descarta lo que no

### Red de Aprendizaje
- Únete a comunidades de productividad
- Comparte tus experimentos y resultados
- Aprende de otros profesionales

## Conclusión

La productividad en 2025 no se trata de trabajar más horas, sino de trabajar de manera más inteligente. La clave está en combinar la potencia de la IA con técnicas probadas de gestión del tiempo y energía.

Recuerda: la mejor técnica de productividad es la que realmente implementas y mantienes consistentemente. Comienza con 2-3 estrategias de esta lista, domínalas, y luego expande gradualmente tu arsenal de productividad.

El futuro del trabajo es ahora, y con las herramientas correctas como FutureTask, puedes estar a la vanguardia de esta revolución de productividad.
    `,
  },
  "futuro-trabajo-remoto": {
    slug: "futuro-trabajo-remoto",
    title: "El Futuro del Trabajo Remoto: Cómo la IA está Transformando Equipos",
    excerpt:
      "Explora cómo la inteligencia artificial está revolucionando la colaboración y gestión de equipos remotos.",
    image: "/ai-technology.png",
    date: "12 Ene 2025",
    readTime: "12 min",
    category: "Tecnología",
    author: {
      name: "Carlos Rodríguez",
      role: "Analista de Tecnología",
      avatar: "/professional-man.png",
    },
    tags: ["Trabajo Remoto", "IA", "Equipos", "Futuro"],
    relatedPosts: ["productividad-2025", "organizacion-digital-2025"],
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
  },
  "organizacion-digital-2025": {
    slug: "organizacion-digital-2025",
    title: "Organización Personal en la Era Digital: Guía Completa 2025",
    excerpt: "Domina las herramientas digitales para organizar tu vida personal y profesional de manera efectiva.",
    image: "/futuristic-dashboard.png",
    date: "10 Ene 2025",
    readTime: "15 min",
    category: "Organización",
    author: {
      name: "Ana Martínez",
      role: "Consultora de Organización Digital",
      avatar: "/confident-business-woman.png",
    },
    tags: ["Organización", "Productividad", "Herramientas Digitales", "Sistemas"],
    relatedPosts: ["productividad-2025", "futuro-trabajo-remoto"],
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
- **Google Calendar** o **Outlook** como base
- **Calendly** para programación automática
- **RescueTime** para análisis de tiempo
- **Forest** para mantener el enfoque

### 4. Gestión de Archivos y Documentos

#### Estructura de Carpetas Universal
\`\`\`
📁 01_INBOX (Procesamiento temporal)
📁 02_PROYECTOS_ACTIVOS
   └── 📁 2025_Proyecto_Nombre
       ├── 📁 01_Documentos
       ├── 📁 02_Recursos
       └── 📁 03_Entregables
📁 03_AREAS_RESPONSABILIDAD
📁 04_RECURSOS_REFERENCIA
📁 05_ARCHIVO
\`\`\`

#### Convención de Nombres
\`\`\`
YYYY-MM-DD_Tipo_Descripción_v01
2025-01-15_Propuesta_ClienteABC_v03.docx
2025-01-15_Reunión_EquipoVentas_Notas.md
\`\`\`

### 5. Seguridad y Respaldos

#### Estrategia 3-2-1
- **3** copias de datos importantes
- **2** medios de almacenamiento diferentes
- **1** copia fuera del sitio (nube)

#### Gestión de Contraseñas
- **1Password**: Para equipos y familias
- **Bitwarden**: Opción open-source
- **Dashlane**: Para usuarios avanzados

## Herramientas por Categoría

### Productividad Personal
| Herramienta | Propósito | Precio | Plataformas |
|-------------|-----------|--------|-------------|
| Notion | PKM completo | €0-16/mes | Todas |
| Todoist | Gestión tareas | €0-5/mes | Todas |
| Calendly | Programación | €0-12/mes | Web |
| RescueTime | Análisis tiempo | €0-12/mes | Todas |

### Comunicación y Colaboración
| Herramienta | Propósito | Precio | Plataformas |
|-------------|-----------|--------|-------------|
| Slack | Comunicación equipo | €0-15/mes | Todas |
| Zoom | Videoconferencias | €0-20/mes | Todas |
| Loom | Videos asincrónicos | €0-8/mes | Todas |
| Discord | Comunidades | €0-10/mes | Todas |

### Almacenamiento y Sincronización
| Herramienta | Propósito | Precio | Espacio |
|-------------|-----------|--------|---------|
| Google Drive | Colaboración | €0-10/mes | 15GB-2TB |
| Dropbox | Sincronización | €0-20/mes | 2GB-3TB |
| OneDrive | Ecosistema Microsoft | €0-10/mes | 5GB-1TB |
| iCloud | Ecosistema Apple | €0-10/mes | 5GB-2TB |

## Rutinas Digitales Esenciales

### Rutina Matutina (15 minutos)
1. **Revisar calendario** del día (2 min)
2. **Procesar inbox** de tareas (5 min)
3. **Establecer 3 prioridades** principales (3 min)
4. **Configurar modo enfoque** en dispositivos (2 min)
5. **Revisar métricas** del día anterior (3 min)

### Rutina Vespertina (10 minutos)
1. **Capturar pensamientos** pendientes (3 min)
2. **Revisar logros** del día (2 min)
3. **Planificar mañana** siguiente (3 min)
4. **Limpiar escritorio** digital (2 min)

### Rutina Semanal (30 minutos)
1. **Revisión completa** de proyectos (10 min)
2. **Limpieza de archivos** y descargas (5 min)
3. **Actualización de sistemas** (5 min)
4. **Planificación** semana siguiente (10 min)

## Automatizaciones Inteligentes

### IFTTT/Zapier - Recetas Útiles
- **Email → Todoist**: Emails importantes se convierten en tareas
- **Calendario → Slack**: Recordatorios de reuniones al equipo
- **Instagram → Google Photos**: Backup automático de fotos
- **Evernote → Google Drive**: Sincronización de notas importantes

### Shortcuts/Automatizaciones Móviles
- **"Modo Trabajo"**: Activa no molestar, abre apps de productividad
- **"Llegué a Casa"**: Desactiva trabajo, activa entretenimiento
- **"Reunión Terminó"**: Envía resumen automático por email

## Métricas y Análisis

### KPIs de Organización Personal
- **Tiempo en tareas importantes**: >60% del día laboral
- **Emails en inbox**: <25 al final del día
- **Tareas completadas vs planificadas**: >80%
- **Tiempo de respuesta promedio**: <24 horas
- **Archivos encontrados en <30 segundos**: >90%

### Herramientas de Análisis
- **RescueTime**: Análisis automático de tiempo
- **Toggl**: Tracking manual detallado
- **Screen Time**: Análisis de uso móvil
- **Google Analytics**: Para sitios web personales

## Errores Comunes y Cómo Evitarlos

### 1. Sobre-optimización
**Error**: Pasar más tiempo organizando que ejecutando
**Solución**: Regla 80/20 - 80% ejecución, 20% organización

### 2. Múltiples Sistemas
**Error**: Usar diferentes apps para lo mismo
**Solución**: Un sistema por función, máximo 2 alternativas

### 3. Perfeccionismo Digital
**Error**: Buscar la herramienta "perfecta"
**Solución**: Elegir "suficientemente buena" y dominarla

### 4. Falta de Mantenimiento
**Error**: No revisar y actualizar sistemas
**Solución**: Revisiones semanales obligatorias

## Plan de Implementación de 30 Días

### Semana 1: Fundamentos
- Día 1-2: Auditoría digital completa
- Día 3-4: Elección de herramientas principales
- Día 5-7: Configuración básica y migración

### Semana 2: Estructura
- Día 8-10: Implementación de sistema de archivos
- Día 11-12: Configuración de gestión de tareas
- Día 13-14: Establecimiento de rutinas básicas

### Semana 3: Automatización
- Día 15-17: Configuración de automatizaciones
- Día 18-19: Integración entre herramientas
- Día 20-21: Pruebas y ajustes

### Semana 4: Optimización
- Día 22-24: Análisis de métricas iniciales
- Día 25-26: Ajustes basados en uso real
- Día 27-30: Establecimiento de hábitos permanentes

## Conclusión

La organización digital no es un destino, sino un proceso continuo de mejora. La clave está en encontrar el equilibrio entre estructura y flexibilidad, automatización y control personal.

Recuerda: el mejor sistema es el que realmente usas. Comienza simple, mantén consistencia y evoluciona gradualmente hacia mayor sofisticación.

En 2025, quien domine su organización digital tendrá una ventaja competitiva significativa tanto en lo personal como en lo profesional.
    `,
  },
}

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const currentPost = blogPosts[slug]
    setPost(currentPost)

    if (currentPost) {
      const related = Object.values(blogPosts)
        .filter((p) => p.slug !== currentPost.slug)
        .slice(0, 2)
      setRelatedPosts(related)
    }
  }, [slug])

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Post no encontrado</h1>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  const formatContent = (content: string) => {
    return content
      .replace(/\n/g, "<br>")
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-4xl font-bold text-slate-900 dark:text-white mt-12 mb-8 leading-tight">$1</h1>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-3xl font-bold text-slate-900 dark:text-white mt-10 mb-6 leading-tight">$1</h2>',
      )
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4 leading-tight">$1</h3>',
      )
      .replace(
        /^#### (.+)$/gm,
        '<h4 class="text-xl font-semibold text-slate-700 dark:text-slate-300 mt-6 mb-3 leading-tight">$1</h4>',
      )
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>')
      .replace(
        /```(.+?)```/gs,
        '<pre class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto my-6 border border-slate-200 dark:border-slate-700"><code class="text-sm text-slate-800 dark:text-slate-200 font-mono">$1</code></pre>',
      )
      .replace(
        /`(.+?)`/g,
        '<code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono text-slate-800 dark:text-slate-200">$1</code>',
      )
      .replace(
        /^- (.+)$/gm,
        '<li class="ml-6 mb-2 text-slate-700 dark:text-slate-300 leading-relaxed list-disc">$1</li>',
      )
      .replace(
        /^(\d+)\. (.+)$/gm,
        '<li class="ml-6 mb-2 text-slate-700 dark:text-slate-300 leading-relaxed list-decimal">$2</li>',
      )
      .replace(
        /> (.+)/g,
        '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 italic text-slate-700 dark:text-slate-300 rounded-r-lg">$1</blockquote>',
      )
      .replace(
        /\| (.+) \|/g,
        '<tr class="border-b border-slate-200 dark:border-slate-700"><td class="px-4 py-2 text-slate-700 dark:text-slate-300">$1</td></tr>',
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back") || "Volver"}
            </Button>
            <LanguageSelector variant="compact" />
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          <span
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/")}
          >
            {t("home") || "Inicio"}
          </span>
          <span className="mx-2">/</span>
          <span
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/#blog")}
          >
            {t("blog") || "Blog"}
          </span>
          <span className="mx-2">/</span>
          <span className="text-slate-700 dark:text-slate-300">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              {post.category}
            </Badge>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{post.excerpt}</p>

          {/* Article Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Share Button and Tags */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: formatContent(post.content),
            }}
          />
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{post.author.name}</h3>
              <p className="text-slate-600 dark:text-slate-400">{post.author.role}</p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-500" />
              Artículos Relacionados
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.slug}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                  onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      >
                        {relatedPost.category}
                      </Badge>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{relatedPost.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{relatedPost.author.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {t("readMore") || "Leer más"} →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="mt-16 text-center">
          <Button onClick={() => router.push("/#blog")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Blog
          </Button>
        </div>
      </article>
    </div>
  )
}
