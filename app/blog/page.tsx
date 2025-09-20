"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Search, Clock, Eye, MessageCircle, ArrowRight, Star, Mail } from "lucide-react"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const blogPosts = [
    {
      id: 1,
      title: "10 Técnicas de Productividad que Cambiarán tu Vida en 2024",
      excerpt:
        "Descubre las estrategias más efectivas para maximizar tu productividad personal y profesional. Desde la técnica Pomodoro hasta el time-blocking.",
      content: `La productividad no se trata de trabajar más horas, sino de trabajar de manera más inteligente. En este artículo, exploraremos 10 técnicas probadas que pueden transformar completamente tu enfoque hacia el trabajo y la vida personal.

## 1. La Técnica Pomodoro Avanzada

La técnica Pomodoro tradicional utiliza intervalos de 25 minutos, pero la versión avanzada se adapta a tu ritmo natural. Algunos días puedes necesitar sesiones de 45 minutos, otros de 15. La clave está en escuchar a tu cuerpo y mente.

## 2. Time Blocking Estratégico

En lugar de simplemente bloquear tiempo para tareas, asigna bloques específicos según tu energía natural. Reserva las mañanas para trabajo creativo y las tardes para tareas administrativas.

## 3. La Regla de los Dos Minutos

Si una tarea toma menos de dos minutos, hazla inmediatamente. Esta simple regla puede eliminar el 40% de tu lista de pendientes.

## 4. Batch Processing

Agrupa tareas similares y hazlas en bloques. Responde todos los emails de una vez, haz todas las llamadas juntas, procesa todos los documentos en una sesión.

## 5. El Método Getting Things Done (GTD)

Captura todo en un sistema confiable, clarifica qué significa cada elemento, organiza por contexto y proyecto, revisa regularmente y ejecuta con confianza.

La implementación de estas técnicas requiere práctica y paciencia, pero los resultados son transformadores.`,
      author: "María González",
      date: "2024-01-15",
      category: "Productividad",
      tags: ["productividad", "técnicas", "pomodoro", "gtd"],
      readTime: "8 min",
      views: 2847,
      comments: 23,
      featured: true,
      image: "/placeholder.svg?height=400&width=600&text=Técnicas+de+Productividad",
    },
    {
      id: 2,
      title: "Cómo la Inteligencia Artificial Está Revolucionando la Gestión del Tiempo",
      excerpt:
        "Explora cómo las herramientas de IA pueden predecir tus patrones de productividad y optimizar automáticamente tu calendario para máxima eficiencia.",
      content: `La inteligencia artificial está transformando la manera en que gestionamos nuestro tiempo. Ya no se trata solo de calendarios digitales, sino de sistemas inteligentes que aprenden de nuestros hábitos y optimizan nuestro día automáticamente.

## El Poder del Aprendizaje Automático

Los algoritmos de machine learning pueden analizar miles de puntos de datos sobre tu comportamiento laboral: cuándo eres más productivo, qué tipo de tareas requieren más energía, cuánto tiempo realmente tomas para completar diferentes actividades.

## Predicción de Patrones

La IA puede identificar patrones que nosotros no vemos. Por ejemplo, puede detectar que eres 30% más productivo los martes por la mañana, o que las reuniones después del almuerzo tienden a ser menos efectivas.

## Optimización Automática

Basándose en estos patrones, la IA puede:
- Sugerir los mejores momentos para tareas específicas
- Reorganizar automáticamente tu calendario cuando surgen imprevistos
- Predecir cuánto tiempo necesitarás realmente para cada tarea
- Identificar momentos óptimos para descansos

## El Futuro de la Productividad

Estamos entrando en una era donde nuestros asistentes digitales no solo organizan nuestro tiempo, sino que lo optimizan continuamente basándose en datos reales de rendimiento.`,
      author: "Carlos Rodríguez",
      date: "2024-01-12",
      category: "IA",
      tags: ["inteligencia artificial", "automatización", "calendario", "optimización"],
      readTime: "6 min",
      views: 1923,
      comments: 18,
      featured: false,
    },
    {
      id: 3,
      title: "El Arte del Deep Work: Cómo Lograr Concentración Profunda en un Mundo Distraído",
      excerpt:
        "En una era de notificaciones constantes, aprende a cultivar la capacidad de concentración profunda que te permitirá producir trabajo de alta calidad.",
      content: `El concepto de "Deep Work", popularizado por Cal Newport, se refiere a la capacidad de concentrarse sin distracción en una tarea cognitivamente demandante. En nuestro mundo hiperconectado, esta habilidad se ha vuelto tanto más rara como más valiosa.

## ¿Qué es el Deep Work?

El Deep Work es trabajo profesional realizado en un estado de concentración libre de distracciones que empuja tus capacidades cognitivas a su límite. Estas actividades crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.

## Los Cuatro Tipos de Deep Work

### 1. Filosofía Monástica
Eliminación radical de todas las distracciones. Ideal para escritores, investigadores o cualquiera que pueda permitirse largos períodos de aislamiento.

### 2. Filosofía Bimodal
Alternancia entre períodos de deep work y períodos de colaboración. Puedes dedicar días completos o incluso semanas al trabajo profundo.

### 3. Filosofía Rítmica
Establecimiento de una rutina regular de deep work. Por ejemplo, todas las mañanas de 6 a 9 AM son sagradas para trabajo profundo.

### 4. Filosofía Periodística
Capacidad de cambiar al modo deep work cuando sea necesario. Requiere mucha práctica y disciplina mental.

## Estrategias Prácticas

1. **Crea rituales**: Establece rutinas específicas que señalen el inicio del trabajo profundo
2. **Elimina distracciones**: Usa bloqueadores de sitios web, pon el teléfono en modo avión
3. **Entrena tu concentración**: Como un músculo, la concentración se fortalece con la práctica
4. **Mide tu progreso**: Lleva registro de cuánto tiempo pasas en deep work cada día

El deep work no es solo una técnica de productividad, es una filosofía de vida que puede transformar la calidad de tu trabajo y tu satisfacción profesional.`,
      author: "Ana Martín",
      date: "2024-01-10",
      category: "Concentración",
      tags: ["deep work", "concentración", "productividad", "cal newport"],
      readTime: "10 min",
      views: 3156,
      comments: 31,
      featured: true,
    },
    {
      id: 4,
      title: "Gestión de Energía vs Gestión de Tiempo: El Cambio de Paradigma",
      excerpt:
        "Descubre por qué gestionar tu energía es más importante que gestionar tu tiempo, y cómo alinear tus tareas con tus ritmos naturales.",
      content: `Durante décadas nos han enseñado a gestionar el tiempo, pero el tiempo es un recurso finito e inflexible. Todos tenemos las mismas 24 horas al día. La verdadera diferencia está en cómo gestionamos nuestra energía.

## Los Cuatro Tipos de Energía

### 1. Energía Física
Tu capacidad corporal para realizar trabajo. Incluye tu nivel de fitness, nutrición, sueño y salud general.

### 2. Energía Emocional
Tu capacidad para mantener emociones positivas y manejar las negativas. Afecta directamente tu motivación y resistencia.

### 3. Energía Mental
Tu capacidad para concentrarte, procesar información y tomar decisiones. Se agota con el uso y se restaura con el descanso.

### 4. Energía Espiritual
Tu conexión con un propósito más grande. Proporciona la motivación y resistencia para perseverar en momentos difíciles.

## Estrategias de Gestión de Energía

### Mapea tu Energía Natural
Lleva un registro durante una semana de tus niveles de energía cada hora. Identifica patrones: ¿cuándo eres más creativo? ¿cuándo tienes más energía física?

### Alinea Tareas con Energía
- **Alta energía mental**: Trabajo creativo, resolución de problemas complejos
- **Media energía**: Reuniones, comunicación, planificación
- **Baja energía**: Tareas administrativas, organización, limpieza

### Rituales de Renovación
- **Física**: Ejercicio regular, alimentación saludable, sueño de calidad
- **Emocional**: Tiempo con seres queridos, actividades que disfrutes
- **Mental**: Meditación, lectura, aprendizaje
- **Espiritual**: Reflexión, conexión con valores, servicio a otros

## El Resultado

Cuando gestionas tu energía efectivamente, no solo eres más productivo, sino que también experimentas mayor satisfacción y menor estrés en tu trabajo diario.`,
      author: "David López",
      date: "2024-01-08",
      category: "Bienestar",
      tags: ["energía", "gestión", "bienestar", "productividad"],
      readTime: "7 min",
      views: 2134,
      comments: 19,
      featured: false,
    },
    {
      id: 5,
      title: "Minimalismo Digital: Cómo Reducir el Ruido Tecnológico para Aumentar tu Productividad",
      excerpt:
        "Aprende a crear un entorno digital limpio y enfocado que apoye tus objetivos en lugar de distraerte de ellos.",
      content: `El minimalismo digital no se trata de rechazar la tecnología, sino de ser más intencional sobre cómo la usamos. Se trata de crear un entorno digital que sirva a tus objetivos en lugar de sabotearlos.

## Los Principios del Minimalismo Digital

### 1. Filosofía de Valor
Cada herramienta digital debe aportar valor significativo a tu vida. No basta con que sea útil; debe ser esencial.

### 2. Optimización sobre Conveniencia
Elige herramientas que optimicen lo que valoras, no necesariamente las más convenientes.

### 3. Intencionalidad sobre Impulso
Usa la tecnología de manera intencional, no como respuesta a impulsos o aburrimiento.

## Estrategias Prácticas

### Auditoría Digital
1. Lista todas las aplicaciones en tu teléfono y computadora
2. Categorízalas: Esencial, Útil, Entretenimiento, Problemática
3. Elimina las problemáticas, limita el entretenimiento, optimiza las útiles

### Diseño de Fricción
Añade fricción a comportamientos que quieres reducir:
- Elimina aplicaciones de redes sociales del teléfono
- Usa bloqueadores de sitios web durante horas de trabajo
- Configura tu teléfono en escala de grises

### Batching Digital
Agrupa actividades digitales similares:
- Revisa email solo 2-3 veces al día
- Dedica tiempo específico para redes sociales
- Procesa todas las notificaciones de una vez

El objetivo no es usar menos tecnología, sino usarla de manera más intencional y efectiva.`,
      author: "Laura Fernández",
      date: "2024-01-05",
      category: "Minimalismo",
      tags: ["minimalismo digital", "tecnología", "distracciones", "enfoque"],
      readTime: "6 min",
      views: 1876,
      comments: 15,
      featured: false,
    },
    {
      id: 6,
      title: "La Ciencia del Sueño y su Impacto en la Productividad",
      excerpt:
        "Explora cómo la calidad de tu sueño afecta directamente tu rendimiento cognitivo y descubre estrategias para optimizar tu descanso.",
      content: `El sueño no es tiempo perdido; es una inversión en tu productividad del día siguiente. La investigación científica ha demostrado que la calidad del sueño tiene un impacto directo y medible en nuestro rendimiento cognitivo.

## Los Ciclos del Sueño

### Fase 1: Sueño Ligero
Transición entre vigilia y sueño. Dura 5-10 minutos.

### Fase 2: Sueño Profundo Ligero
Representa el 45-55% del sueño total. Importante para la consolidación de memoria.

### Fase 3: Sueño Profundo
Crucial para la recuperación física y mental. Representa el 15-20% del sueño.

### Fase REM
Esencial para la creatividad y procesamiento emocional. Representa el 20-25% del sueño.

## Impacto en la Productividad

### Memoria y Aprendizaje
Durante el sueño, el cerebro consolida las memorias del día, transfiriendo información de la memoria a corto plazo a la de largo plazo.

### Toma de Decisiones
La privación de sueño afecta la corteza prefrontal, reduciendo nuestra capacidad para tomar decisiones racionales.

### Creatividad
El sueño REM es crucial para la creatividad, permitiendo que el cerebro haga conexiones nuevas e inesperadas.

## Estrategias de Optimización

### Higiene del Sueño
- Mantén un horario consistente
- Crea un ambiente oscuro y fresco
- Evita pantallas 1 hora antes de dormir
- Limita la cafeína después de las 2 PM

### Técnicas Avanzadas
- **Napping estratégico**: Siestas de 10-20 minutos para recuperar energía
- **Sleep tracking**: Usa dispositivos para monitorear la calidad del sueño
- **Cronotipos**: Identifica si eres matutino o nocturno y ajusta tu horario

Invertir en la calidad de tu sueño es una de las mejores inversiones que puedes hacer en tu productividad.`,
      author: "Dr. Miguel Santos",
      date: "2024-01-03",
      category: "Salud",
      tags: ["sueño", "productividad", "salud", "ciencia"],
      readTime: "8 min",
      views: 2567,
      comments: 22,
      featured: false,
    },
    {
      id: 7,
      title: "Automatización Personal: Cómo Crear Sistemas que Trabajen por Ti",
      excerpt:
        "Descubre cómo automatizar tareas repetitivas y crear sistemas que te permitan enfocarte en lo que realmente importa.",
      content: `La automatización personal no se trata solo de usar herramientas tecnológicas, sino de crear sistemas y procesos que reduzcan la fricción en tu vida diaria y te permitan enfocarte en actividades de alto valor.

## Principios de la Automatización Personal

### 1. Identifica Tareas Repetitivas
Busca actividades que realizas regularmente y que siguen un patrón predecible.

### 2. Evalúa el ROI de Tiempo
Calcula cuánto tiempo inviertes en automatizar vs. cuánto tiempo ahorrarás a largo plazo.

### 3. Comienza Simple
No necesitas automatizar todo de una vez. Comienza con las tareas más frecuentes y molestas.

## Áreas Clave para Automatizar

### Finanzas Personales
- Transferencias automáticas a ahorros
- Pago automático de facturas
- Categorización automática de gastos
- Alertas de presupuesto

### Comunicación
- Respuestas automáticas de email
- Plantillas para mensajes frecuentes
- Programación de publicaciones en redes sociales
- Filtros automáticos de email

### Gestión de Información
- Agregadores de noticias
- Sincronización automática de archivos
- Backup automático de datos
- Organización automática de fotos

### Salud y Bienestar
- Recordatorios de medicamentos
- Seguimiento automático de ejercicio
- Pedidos automáticos de suplementos
- Programación de citas médicas

## Herramientas Recomendadas

### Nivel Básico
- **IFTTT**: Conecta diferentes servicios web
- **Zapier**: Automatización más avanzada entre aplicaciones
- **Calendly**: Programación automática de reuniones

### Nivel Intermedio
- **Notion**: Base de datos personal automatizada
- **Airtable**: Hojas de cálculo inteligentes
- **Shortcuts (iOS)**: Automatización móvil

### Nivel Avanzado
- **Python scripts**: Automatización personalizada
- **APIs**: Integración directa entre servicios
- **Webhooks**: Automatización en tiempo real

La clave está en encontrar el equilibrio entre automatización y control personal.`,
      author: "Elena Ruiz",
      date: "2024-01-01",
      category: "Automatización",
      tags: ["automatización", "sistemas", "eficiencia", "herramientas"],
      readTime: "9 min",
      views: 1654,
      comments: 17,
      featured: false,
    },
    {
      id: 8,
      title: "Gestión de Proyectos Personales: Del Caos a la Claridad",
      excerpt:
        "Aprende metodologías probadas para gestionar tus proyectos personales de manera efectiva, desde la concepción hasta la ejecución.",
      content: `La gestión de proyectos no es solo para el ámbito profesional. Aplicar metodologías estructuradas a tus proyectos personales puede ser la diferencia entre el éxito y el abandono.

## Definición de Proyecto Personal

Un proyecto personal es cualquier iniciativa con:
- Un objetivo específico y medible
- Un plazo definido
- Recursos limitados
- Múltiples tareas interconectadas

Ejemplos: aprender un idioma, escribir un libro, renovar la casa, cambiar de carrera.

## Metodologías Adaptadas

### Getting Things Done (GTD) para Proyectos
1. **Captura**: Registra todas las ideas relacionadas con el proyecto
2. **Clarifica**: Define el resultado deseado y los próximos pasos
3. **Organiza**: Estructura las tareas por contexto y prioridad
4. **Reflexiona**: Revisa el progreso regularmente
5. **Ejecuta**: Actúa con confianza

### Kanban Personal
Usa tres columnas básicas:
- **Por Hacer**: Tareas identificadas pero no iniciadas
- **En Progreso**: Tareas actualmente en desarrollo (máximo 3)
- **Completado**: Tareas finalizadas

### Scrum Adaptado
- **Sprints de 1-2 semanas**: Períodos de trabajo enfocado
- **Daily standups personales**: Reflexión diaria de 5 minutos
- **Sprint reviews**: Evaluación semanal del progreso
- **Retrospectivas**: Análisis de qué funcionó y qué no

## Herramientas Recomendadas

### Digitales
- **Notion**: Para proyectos complejos con múltiples componentes
- **Trello**: Kanban visual simple y efectivo
- **Todoist**: Gestión de tareas con fechas y proyectos
- **Obsidian**: Para proyectos que requieren mucha investigación

### Analógicas
- **Bullet Journal**: Sistema flexible en papel
- **Tableros físicos**: Kanban con post-its
- **Calendarios de pared**: Visualización temporal

## Claves del Éxito

1. **Comienza pequeño**: Mejor un proyecto pequeño completado que uno grande abandonado
2. **Mantén momentum**: Trabaja en el proyecto regularmente, aunque sea poco tiempo
3. **Celebra hitos**: Reconoce el progreso para mantener la motivación
4. **Ajusta sobre la marcha**: Los proyectos personales deben ser flexibles

La gestión efectiva de proyectos personales puede transformar tus aspiraciones en realidades tangibles.`,
      author: "Roberto Jiménez",
      date: "2023-12-28",
      category: "Gestión",
      tags: ["proyectos", "gestión", "metodologías", "organización"],
      readTime: "7 min",
      views: 1432,
      comments: 12,
      featured: false,
    },
    {
      id: 9,
      title: "El Poder de los Hábitos Atómicos en la Productividad Diaria",
      excerpt:
        "Descubre cómo pequeños cambios en tus hábitos diarios pueden generar resultados extraordinarios a largo plazo.",
      content: `Los hábitos atómicos, concepto popularizado por James Clear, son pequeños cambios que parecen insignificantes pero que, cuando se acumulan, generan resultados extraordinarios.

## La Anatomía de un Hábito

Todo hábito sigue un ciclo de cuatro pasos:

### 1. Señal (Cue)
El disparador que inicia el comportamiento. Puede ser:
- **Tiempo**: "Después de despertarme"
- **Ubicación**: "Cuando entro a la oficina"
- **Evento anterior**: "Después de tomar café"
- **Estado emocional**: "Cuando me siento estresado"

### 2. Anhelo (Craving)
La motivación detrás del hábito. No deseamos el hábito en sí, sino el cambio de estado que proporciona.

### 3. Respuesta (Response)
El hábito actual que realizas. Puede ser un pensamiento o una acción.

### 4. Recompensa (Reward)
El beneficio que obtienes del hábito. Satisface el anhelo y enseña al cerebro a recordar este ciclo.

## Las Cuatro Leyes del Cambio de Comportamiento

### Para Crear Buenos Hábitos:

#### 1. Hazlo Obvio
- **Diseño del entorno**: Coloca señales visuales
- **Stacking de hábitos**: "Después de [hábito actual], haré [nuevo hábito]"
- **Implementación de intenciones**: "Haré [comportamiento] a las [tiempo] en [lugar]"

#### 2. Hazlo Atractivo
- **Bundling de tentaciones**: Combina algo que necesitas hacer con algo que quieres hacer
- **Únete a una cultura**: Rodéate de personas que ya tienen el hábito deseado
- **Crea un ritual motivacional**: Haz algo que disfrutes inmediatamente antes del hábito

#### 3. Hazlo Fácil
- **Regla de los 2 minutos**: Cuando empiezas un nuevo hábito, debe tomar menos de 2 minutos
- **Reduce la fricción**: Disminuye los pasos entre tú y tus buenos hábitos
- **Prepara el entorno**: Diseña tu entorno para que los buenos hábitos sean más fáciles

#### 4. Hazlo Satisfactorio
- **Refuerzo inmediato**: Usa recompensas inmediatas para hábitos con beneficios a largo plazo
- **Tracking de hábitos**: Lleva registro visual de tu progreso
- **Nunca falles dos veces**: Si fallas un día, asegúrate de volver al hábito al día siguiente

### Para Eliminar Malos Hábitos:

1. **Hazlo Invisible**: Elimina las señales
2. **Hazlo Poco Atractivo**: Resalta los beneficios de evitarlo
3. **Hazlo Difícil**: Aumenta la fricción
4. **Hazlo Insatisfactorio**: Crea consecuencias inmediatas

## Hábitos Atómicos para Productividad

### Mañana
- **2 minutos de planificación**: Revisa las 3 tareas más importantes del día
- **Preparación la noche anterior**: Deja la ropa y materiales listos
- **Rutina de activación**: Secuencia que te pone en modo productivo

### Durante el día
- **Pomodoros de 25 minutos**: Trabajo enfocado con descansos regulares
- **Captura inmediata**: Anota ideas y tareas tan pronto como surjan
- **Revisión cada 2 horas**: Evalúa progreso y ajusta si es necesario

### Noche
- **Reflexión de 5 minutos**: ¿Qué funcionó? ¿Qué mejorar mañana?
- **Preparación del día siguiente**: Deja todo listo para empezar bien
- **Desconexión digital**: 1 hora antes de dormir sin pantallas

El poder está en la consistencia, no en la perfección.`,
      author: "Patricia Morales",
      date: "2023-12-25",
      category: "Hábitos",
      tags: ["hábitos", "james clear", "productividad", "cambio"],
      readTime: "11 min",
      views: 3421,
      comments: 28,
      featured: true,
    },
    {
      id: 10,
      title: "Trabajo Remoto Efectivo: Estrategias para Mantener la Productividad desde Casa",
      excerpt:
        "Guía completa para optimizar tu productividad trabajando desde casa, incluyendo configuración del espacio y gestión de distracciones.",
      content: `El trabajo remoto ha pasado de ser una excepción a convertirse en la norma para millones de profesionales. Sin embargo, mantener la productividad desde casa requiere estrategias específicas y disciplina personal.

## Configuración del Espacio de Trabajo

### Elementos Esenciales

#### Ergonomía
- **Silla adecuada**: Soporte lumbar y altura ajustable
- **Escritorio**: Altura correcta para evitar tensión en cuello y hombros
- **Monitor**: A la altura de los ojos, brazo de distancia
- **Iluminación**: Luz natural complementada con luz artificial adecuada

#### Tecnología
- **Internet confiable**: Conexión estable y rápida
- **Audio de calidad**: Auriculares con cancelación de ruido
- **Cámara web**: Para videollamadas profesionales
- **Backup de energía**: UPS para cortes de luz

### Psicología del Espacio

#### Separación Física
Crea una separación clara entre espacio de trabajo y espacio personal, incluso en espacios pequeños.

#### Ritual de Inicio y Cierre
Establece rutinas que marquen el inicio y fin de la jornada laboral.

## Gestión de Distracciones

### Distracciones Externas
- **Ruido**: Usa auriculares con cancelación de ruido o ruido blanco
- **Interrupciones familiares**: Establece horarios y señales claras
- **Notificaciones**: Desactiva notificaciones no esenciales durante horas de trabajo

### Distracciones Internas
- **Procrastinación**: Usa técnicas como Pomodoro para mantener enfoque
- **Multitasking**: Enfócate en una tarea a la vez
- **Perfectionism**: Establece estándares realistas y deadlines

## Comunicación Efectiva

### Herramientas de Comunicación
- **Síncronas**: Videollamadas, llamadas telefónicas
- **Asíncronas**: Email, mensajes, documentos compartidos
- **Colaborativas**: Pizarras digitales, documentos en tiempo real

### Mejores Prácticas
- **Sobrecomunica**: En remoto, más comunicación es mejor que menos
- **Sé específico**: Usa ejemplos concretos y plazos claros
- **Documenta todo**: Mantén registro de decisiones y acuerdos

## Mantenimiento del Bienestar

### Salud Física
- **Movimiento regular**: Levántate cada hora, haz estiramientos
- **Ejercicio**: Mantén rutina de actividad física
- **Alimentación**: Evita comer en el escritorio, mantén horarios regulares

### Salud Mental
- **Conexión social**: Programa interacciones regulares con colegas
- **Límites claros**: Respeta horarios de trabajo y descanso
- **Espacio personal**: Mantén tiempo para hobbies y relajación

## Productividad Avanzada

### Time Blocking
Asigna bloques específicos de tiempo para diferentes tipos de trabajo:
- **Deep work**: 2-4 horas de trabajo concentrado
- **Comunicación**: 1-2 horas para emails y reuniones
- **Administración**: 30-60 minutos para tareas organizativas

### Batch Processing
Agrupa tareas similares:
- **Todas las llamadas en la mañana**
- **Emails en momentos específicos**
- **Trabajo creativo en horas de mayor energía**

### Medición y Ajuste
- **Tracking de tiempo**: Usa herramientas para entender dónde va tu tiempo
- **Métricas de productividad**: Define KPIs personales
- **Revisión semanal**: Evalúa qué funcionó y qué necesita ajuste

El trabajo remoto efectivo no es solo sobre tecnología, sino sobre crear sistemas y hábitos que sostengan tu productividad a largo plazo.`,
      author: "Fernando Castro",
      date: "2023-12-22",
      category: "Trabajo Remoto",
      tags: ["trabajo remoto", "productividad", "home office", "bienestar"],
      readTime: "12 min",
      views: 2876,
      comments: 24,
      featured: false,
    },
  ]

  const categories = [
    "all",
    "Productividad",
    "IA",
    "Concentración",
    "Bienestar",
    "Minimalismo",
    "Salud",
    "Automatización",
    "Gestión",
    "Hábitos",
    "Trabajo Remoto",
  ]

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, blogPosts])

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center text-white hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al Inicio
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">FutureTask</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">Blog de Productividad</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Descubre las últimas tendencias, consejos y estrategias para maximizar tu productividad personal y
            profesional.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category === "all" ? "Todos" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === "all" && searchTerm === "" && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Artículos Destacados</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Star className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Por {post.author} • {new Date(post.date).toLocaleDateString("es-ES")}
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          Leer más
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {searchTerm || selectedCategory !== "all" ? "Resultados de Búsqueda" : "Todos los Artículos"}
            </h2>
            <div className="text-slate-400 text-sm">
              {filteredPosts.length} artículo{filteredPosts.length !== 1 ? "s" : ""} encontrado
              {filteredPosts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron artículos</h3>
                <p className="text-slate-300 mb-4">
                  Intenta con otros términos de búsqueda o selecciona una categoría diferente.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Ver todos los artículos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-white/20 text-white">
                        {post.category}
                      </Badge>
                      {post.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <Star className="h-3 w-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/10 text-slate-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="bg-white/10 text-slate-300 text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Por {post.author} • {new Date(post.date).toLocaleDateString("es-ES")}
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          Leer más
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Mantente al Día</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Recibe consejos semanales de productividad, actualizaciones de funciones y contenido exclusivo
              directamente en tu bandeja de entrada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="tu@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Suscribirse</Button>
            </div>
            <p className="text-slate-400 text-sm mt-4">No spam. Cancela tu suscripción en cualquier momento.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
