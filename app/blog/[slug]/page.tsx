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
      avatar: "/professional-woman.png",
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
    const post = blogPosts[slug]
    setPost(post)

    if (post) {
      const relatedPosts = Object.values(blogPosts)
        .filter((p) => p.id !== post.id)
        .slice(0, 2)
      setRelatedPosts(relatedPosts)
    }
  }, [slug])

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Post no encontrado</h1>
          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-white hover:text-purple-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            <LanguageSelector variant="compact" />
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-400 mb-6">
          <span className="hover:text-white cursor-pointer" onClick={() => router.push("/")}>
            {t("home")}
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-white cursor-pointer" onClick={() => router.push("/#blog")}>
            {t("blog")}
          </span>
          <span className="mx-2">/</span>
          <span className="text-white">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
              {post.category}
            </Badge>
            <div className="flex items-center text-slate-400 text-sm gap-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

          <p className="text-xl text-slate-300 mb-6 leading-relaxed">{post.excerpt}</p>

          {/* Article Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Share Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-slate-200 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/\n/g, "<br>")
                .replace(/#{3}\s(.+)/g, '<h3 class="text-2xl font-bold text-white mt-8 mb-4">$1</h3>')
                .replace(/#{2}\s(.+)/g, '<h2 class="text-3xl font-bold text-white mt-10 mb-6">$1</h2>')
                .replace(/#{1}\s(.+)/g, '<h1 class="text-4xl font-bold text-white mt-12 mb-8">$1</h1>')
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/\*(.+?)\*/g, '<em class="text-purple-300">$1</em>')
                .replace(
                  /```(.+?)```/gs,
                  '<pre class="bg-slate-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-green-400">$1</code></pre>',
                )
                .replace(/`(.+?)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-green-400">$1</code>')
                .replace(/^- (.+)/gm, '<li class="ml-4 mb-2">$1</li>')
                .replace(/(\d+)\.\s(.+)/g, '<li class="ml-4 mb-2 list-decimal">$2</li>'),
            }}
          />
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <img
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-full h-full rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{post.author.name}</h3>
              <p className="text-slate-400">{post.author.role}</p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              Artículos Relacionados
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.slug}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                        {relatedPost.category}
                      </Badge>
                      <span className="text-slate-400 text-sm">{relatedPost.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-slate-400 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">{relatedPost.author.name}</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        {t("readMore")} →
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
          <Button
            onClick={() => router.push("/#blog")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Blog
          </Button>
        </div>
      </article>
    </div>
  )
}
