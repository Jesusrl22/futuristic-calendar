import { type NextRequest, NextResponse } from "next/server"
import { getUserAICredits } from "@/lib/ai-credits"

// Mock AI response for demo purposes
const mockAIResponses = [
  "¡Excelente pregunta! Te puedo ayudar con eso. Basándome en tu consulta, te recomiendo organizar tus tareas por prioridad y establecer bloques de tiempo específicos para cada una.",
  "Entiendo tu situación. Una buena estrategia sería implementar la técnica Pomodoro: trabaja 25 minutos, descansa 5. Esto mejora la concentración y productividad.",
  "Para mejorar tu gestión del tiempo, te sugiero: 1) Planificar el día anterior, 2) Eliminar distracciones, 3) Usar herramientas de seguimiento, 4) Establecer metas claras.",
  "¡Perfecto! Puedo ayudarte a crear un plan personalizado. Considera dividir tus objetivos grandes en tareas más pequeñas y manejables.",
  "Basándome en las mejores prácticas de productividad, te recomiendo establecer rutinas matutinas, priorizar tareas importantes y revisar tu progreso semanalmente.",
]

export const maxDuration = 60 // Allow up to 60 seconds for AI processing

export async function POST(req: NextRequest) {
  try {
    const { message, userId, creditsConsumed } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Select a random response
    const response = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)]

    // In a real implementation, you would:
    // 1. Call OpenAI API
    // 2. Process the response
    // 3. Update user's AI credits
    // 4. Log the interaction

    // Generate AI response
    // const { text, usage } = await generateText({
    //   model: openai("gpt-4o-mini"),
    //   prompt: `You are a helpful productivity assistant. Respond in Spanish. User message: ${message}`,
    //   maxTokens: 1000,
    // })

    // Calculate actual cost based on tokens used
    // const actualCreditsUsed = calculateActualCost(usage?.promptTokens || 200, usage?.completionTokens || 800)

    // Log for analytics
    // console.log("AI Chat Usage:", {
    //   userId,
    //   creditsConsumed,
    //   actualCreditsUsed,
    //   promptTokens: usage?.promptTokens,
    //   completionTokens: usage?.completionTokens,
    //   message: message.substring(0, 100) + "...",
    // })

    // Determine request type based on content
    const requestType = determineRequestType(message)

    // Parse the AI response to extract tasks, goals, etc.
    const aiResponse = parseAIResponse(response, message)

    // Get updated credits info
    const updatedCreditsInfo = await getUserAICredits(userId)

    return NextResponse.json({
      response,
      tasks: aiResponse.tasks,
      wishlistItems: aiResponse.wishlistItems,
      notes: aiResponse.notes,
      creditsInfo: updatedCreditsInfo,
      creditsConsumed: creditsConsumed || 1,
      remainingCredits: 50 - (creditsConsumed || 1), // Mock remaining credits
    })
  } catch (creditError) {
    return NextResponse.json(
      {
        error: "Insufficient AI credits",
        message: "No tienes suficientes créditos de IA para esta consulta",
      },
      { status: 402 },
    )
  }
}

function determineRequestType(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("inglés") || lowerMessage.includes("english") || lowerMessage.includes("idioma")) {
    return "language_learning"
  }
  if (lowerMessage.includes("ejercicio") || lowerMessage.includes("fitness") || lowerMessage.includes("deporte")) {
    return "fitness"
  }
  if (lowerMessage.includes("trabajo") || lowerMessage.includes("carrera") || lowerMessage.includes("profesional")) {
    return "career"
  }
  if (lowerMessage.includes("estudio") || lowerMessage.includes("aprender") || lowerMessage.includes("curso")) {
    return "education"
  }
  if (lowerMessage.includes("proyecto") || lowerMessage.includes("planificar") || lowerMessage.includes("organizar")) {
    return "project_planning"
  }
  if (lowerMessage.includes("salud") || lowerMessage.includes("bienestar") || lowerMessage.includes("hábito")) {
    return "health_wellness"
  }
  if (lowerMessage.includes("dinero") || lowerMessage.includes("finanzas") || lowerMessage.includes("presupuesto")) {
    return "finance"
  }
  if (lowerMessage.includes("cocina") || lowerMessage.includes("receta") || lowerMessage.includes("cocinar")) {
    return "cooking"
  }

  return "general"
}

function parseAIResponse(aiText: string, originalRequest: string) {
  const lowerRequest = originalRequest.toLowerCase()
  const tasks = []
  const wishlistItems = []
  const notes = []

  // Create a comprehensive note with the AI response
  notes.push({
    title: `Plan IA: ${originalRequest.substring(0, 50)}${originalRequest.length > 50 ? "..." : ""}`,
    content: `🤖 Respuesta generada por FutureTask AI\n\n${aiText}\n\n---\nConsulta original: "${originalRequest}"\nFecha: ${new Date().toLocaleString("es-ES")}\nModelo: GPT-4o-mini`,
  })

  // Extract specific tasks based on request type
  if (lowerRequest.includes("inglés") || lowerRequest.includes("english")) {
    tasks.push(
      {
        text: "Estudiar vocabulario básico (30 palabras nuevas)",
        description: "Usar flashcards, Anki o apps similares",
        time: "09:00",
        category: "learning",
        priority: "high",
      },
      {
        text: "Practicar pronunciación (15 minutos)",
        description: "Usar Forvo, YouTube o repetir después de nativos",
        time: "10:00",
        category: "learning",
        priority: "medium",
      },
      {
        text: "Ver contenido en inglés con subtítulos",
        description: "Netflix, YouTube, TED Talks - 30 minutos",
        time: "20:00",
        category: "learning",
        priority: "medium",
      },
    )

    wishlistItems.push(
      {
        text: "Alcanzar nivel B1 en inglés",
        description: "Objetivo para los próximos 6 meses con certificación",
      },
      {
        text: "Mantener conversación de 30 minutos en inglés",
        description: "Sin pausas largas ni traducción mental",
      },
    )
  } else if (lowerRequest.includes("ejercicio") || lowerRequest.includes("fitness")) {
    tasks.push(
      {
        text: "Rutina de cardio matutina (30 min)",
        description: "Caminar rápido, correr o bicicleta",
        time: "07:00",
        category: "health",
        priority: "high",
      },
      {
        text: "Ejercicios de fuerza (45 min)",
        description: "Pesas, ejercicios corporales o gimnasio",
        time: "18:00",
        category: "health",
        priority: "high",
      },
      {
        text: "Estiramientos y relajación (15 min)",
        description: "Yoga, pilates o estiramientos básicos",
        time: "21:30",
        category: "health",
        priority: "medium",
      },
    )

    wishlistItems.push(
      {
        text: "Mejorar condición física general",
        description: "Aumentar resistencia y fuerza en 3 meses",
      },
      {
        text: "Establecer rutina de ejercicio constante",
        description: "Ejercitarse mínimo 4 días por semana",
      },
    )
  } else if (lowerRequest.includes("trabajo") || lowerRequest.includes("productividad")) {
    tasks.push(
      {
        text: "Planificar tareas del día (10 min)",
        description: "Revisar prioridades y establecer objetivos",
        time: "08:00",
        category: "work",
        priority: "high",
      },
      {
        text: "Sesión de trabajo enfocado (90 min)",
        description: "Sin distracciones, usar técnica Pomodoro",
        time: "09:00",
        category: "work",
        priority: "high",
      },
      {
        text: "Revisar progreso y ajustar plan",
        description: "Evaluar lo completado y planificar siguiente día",
        time: "17:00",
        category: "work",
        priority: "medium",
      },
    )

    wishlistItems.push({
      text: "Aumentar productividad personal",
      description: "Implementar sistema de gestión de tareas efectivo",
    })
  } else if (lowerRequest.includes("finanzas") || lowerRequest.includes("dinero")) {
    tasks.push(
      {
        text: "Revisar gastos del mes anterior",
        description: "Analizar extractos bancarios y categorizar gastos",
        time: "09:00",
        category: "personal",
        priority: "high",
      },
      {
        text: "Crear presupuesto mensual",
        description: "Establecer límites por categoría de gasto",
        time: "10:00",
        category: "personal",
        priority: "high",
      },
      {
        text: "Investigar opciones de ahorro",
        description: "Comparar cuentas de ahorro y productos financieros",
        time: "16:00",
        category: "personal",
        priority: "medium",
      },
    )

    wishlistItems.push({
      text: "Ahorrar €1000 en 6 meses",
      description: "Fondo de emergencia básico",
    })
  } else {
    // Generic tasks for other requests
    tasks.push(
      {
        text: `Investigar sobre: ${originalRequest}`,
        description: "Buscar información relevante y recursos útiles",
        time: "10:00",
        category: "learning",
        priority: "medium",
      },
      {
        text: `Planificar estrategia para: ${originalRequest}`,
        description: "Definir pasos específicos y cronograma detallado",
        time: "15:00",
        category: "personal",
        priority: "high",
      },
    )

    wishlistItems.push({
      text: `Dominar: ${originalRequest}`,
      description: "Objetivo principal basado en la consulta de IA",
    })
  }

  return { tasks, wishlistItems, notes }
}
