import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getUserAICredits, consumeAICredits, calculateCreditsNeeded, calculateActualCost } from "@/lib/ai-credits"

export const maxDuration = 60 // Allow up to 60 seconds for AI processing

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Check user's AI credits
    const creditsInfo = await getUserAICredits(userId)
    const estimatedCredits = calculateCreditsNeeded(message)

    if (!creditsInfo.canUseAI) {
      return NextResponse.json(
        {
          error: "AI_NO_CREDITS",
          message: "No tienes créditos suficientes para usar la IA",
          creditsInfo,
        },
        { status: 402 },
      )
    }

    if (creditsInfo.remaining < estimatedCredits) {
      return NextResponse.json(
        {
          error: "AI_INSUFFICIENT_CREDITS",
          message: `Esta consulta requiere ~${estimatedCredits} créditos, pero solo tienes ${creditsInfo.remaining}`,
          creditsInfo,
          estimatedCredits,
        },
        { status: 402 },
      )
    }

    // Generate AI response using OpenAI with real API
    const { text, usage } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `Eres un asistente personal especializado en productividad y planificación llamado FutureTask AI. 
      Tu trabajo es ayudar a los usuarios a crear planes detallados, organizar tareas y establecer objetivos.
      
      Cuando el usuario te pida ayuda con algo específico, debes:
      1. Crear un plan detallado y estructurado
      2. Sugerir tareas específicas con horarios recomendados
      3. Proponer objetivos alcanzables y medibles
      4. Dar consejos prácticos y personalizados
      5. Incluir motivación y tips para mantener la constancia
      
      Responde en español de manera clara, estructurada y práctica. 
      Usa emojis ocasionalmente para hacer el contenido más atractivo.
      Sé específico con horarios, duraciones y pasos concretos.
      
      Si el usuario pregunta sobre costos o créditos, explica que:
      - Cada consulta consume créditos basados en el uso real de tokens
      - 1 crédito = €0.02 (costo real de OpenAI + infraestructura)
      - Los usuarios Pro obtienen créditos incluidos en su plan
      - Plan mensual: 150 créditos/mes (€3.00 de valor)
      - Plan anual: 1,500 créditos/año (~125/mes, €30.00 de valor)`,
      prompt: message,
      maxTokens: 1500,
      temperature: 0.7,
    })

    // Get actual token usage from OpenAI response
    const inputTokens = usage?.promptTokens || 0
    const outputTokens = usage?.completionTokens || 0
    const totalTokens = usage?.totalTokens || inputTokens + outputTokens

    // Calculate actual cost based on real token usage
    const { costUsd, costEur, creditsConsumed } = calculateActualCost(inputTokens, outputTokens)

    // Check if user still has enough credits for actual consumption
    if (creditsInfo.remaining < creditsConsumed) {
      return NextResponse.json(
        {
          error: "AI_INSUFFICIENT_CREDITS_ACTUAL",
          message: `Esta consulta consumió ${creditsConsumed} créditos (${costEur.toFixed(4)}€), pero solo tienes ${creditsInfo.remaining}`,
          creditsInfo,
          actualCredits: creditsConsumed,
          actualCost: costEur,
        },
        { status: 402 },
      )
    }

    // Determine request type based on content
    const requestType = determineRequestType(message)

    // Consume credits with actual cost tracking
    const creditsConsumedSuccess = await consumeAICredits(
      userId,
      message,
      text,
      inputTokens,
      outputTokens,
      "gpt-4o-mini",
      requestType,
    )

    if (!creditsConsumedSuccess) {
      return NextResponse.json(
        {
          error: "Failed to consume credits",
          message: "Error al procesar el pago de créditos",
        },
        { status: 500 },
      )
    }

    // Parse the AI response to extract tasks, goals, etc.
    const aiResponse = parseAIResponse(text, message)

    // Get updated credits info
    const updatedCreditsInfo = await getUserAICredits(userId)

    return NextResponse.json({
      response: text,
      tasks: aiResponse.tasks,
      wishlistItems: aiResponse.wishlistItems,
      notes: aiResponse.notes,
      creditsInfo: updatedCreditsInfo,
      usage: {
        creditsUsed: creditsConsumed,
        costEur: costEur,
        costUsd: costUsd,
        inputTokens,
        outputTokens,
        totalTokens,
        model: "gpt-4o-mini",
        requestType,
        efficiency: creditsConsumed <= 2 ? "excellent" : creditsConsumed <= 4 ? "good" : "complex",
      },
    })
  } catch (error) {
    console.error("AI API Error:", error)

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "Invalid API key configuration" }, { status: 500 })
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "OpenAI quota exceeded" }, { status: 503 })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded, try again later" }, { status: 429 })
      }
      if (error.message.includes("insufficient_quota")) {
        return NextResponse.json({ error: "OpenAI account quota exceeded" }, { status: 503 })
      }
    }

    return NextResponse.json({ error: "Error processing AI request" }, { status: 500 })
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
