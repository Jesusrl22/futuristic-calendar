"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Send,
  Zap,
  Crown,
  Sparkles,
  MessageSquare,
  Target,
  Heart,
  FileText,
  Timer,
  Lightbulb,
  Loader2,
} from "lucide-react"

interface AIAssistantProps {
  userId: string
  isPro: boolean
  aiCredits: number
  onUpgrade: () => void
  onTasksGenerated?: (tasks: any[]) => void
  onWishlistGenerated?: (items: any[]) => void
  onNotesGenerated?: (notes: any[]) => void
  compact?: boolean
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  creditsUsed?: number
  generatedContent?: {
    tasks?: any[]
    wishlistItems?: any[]
    notes?: any[]
    pomodoroSessions?: any[]
  }
}

export function AIAssistant({
  userId,
  isPro,
  aiCredits,
  onUpgrade,
  onTasksGenerated,
  onWishlistGenerated,
  onNotesGenerated,
  compact = false,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>("chat")

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`ai_messages_${userId}`)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })))
      } catch (error) {
        console.error("Error loading AI messages:", error)
      }
    }
  }, [userId])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`ai_messages_${userId}`, JSON.stringify(messages))
    }
  }, [messages, userId])

  const handleSendMessage = async () => {
    if (!input.trim() || !isPro || aiCredits <= 0 || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the AI API
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId: userId,
          action: selectedAction,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la solicitud")
      }

      // Generate content based on action type and AI response
      const generatedContent: any = {}

      if (selectedAction === "tasks" || data.tasks) {
        generatedContent.tasks = data.tasks || generateTasksFromResponse(input, data.response)
      }

      if (selectedAction === "wishlist" || data.wishlistItems) {
        generatedContent.wishlistItems = data.wishlistItems || generateWishlistFromResponse(input, data.response)
      }

      if (selectedAction === "notes" || data.notes) {
        generatedContent.notes = data.notes || generateNotesFromResponse(input, data.response)
      }

      if (selectedAction === "pomodoro") {
        generatedContent.pomodoroSessions = generatePomodoroSessions(input)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        creditsUsed: data.usage?.creditsUsed || 1,
        generatedContent,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Trigger callbacks for generated content
      if (generatedContent.tasks && onTasksGenerated) {
        onTasksGenerated(generatedContent.tasks)
      }
      if (generatedContent.wishlistItems && onWishlistGenerated) {
        onWishlistGenerated(generatedContent.wishlistItems)
      }
      if (generatedContent.notes && onNotesGenerated) {
        onNotesGenerated(generatedContent.notes)
      }
    } catch (error) {
      console.error("AI Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateTasksFromResponse = (userInput: string, aiResponse: string): any[] => {
    const tasks = []
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("ejercicio") || lowerInput.includes("fitness")) {
      tasks.push(
        {
          text: "Rutina de ejercicio matutina",
          description: "30 minutos de cardio y ejercicios de fuerza",
          category: "health",
          priority: "high",
          estimatedTime: 30,
        },
        {
          text: "Planificar comidas saludables",
          description: "Preparar menú semanal con opciones nutritivas",
          category: "health",
          priority: "medium",
          estimatedTime: 20,
        },
      )
    } else if (lowerInput.includes("trabajo") || lowerInput.includes("productividad")) {
      tasks.push(
        {
          text: "Revisar emails importantes",
          description: "Responder emails urgentes y organizar bandeja",
          category: "work",
          priority: "high",
          estimatedTime: 25,
        },
        {
          text: "Planificar tareas de la semana",
          description: "Organizar prioridades y establecer deadlines",
          category: "work",
          priority: "medium",
          estimatedTime: 15,
        },
      )
    } else {
      // Generic tasks based on AI response
      tasks.push({
        text: `Investigar: ${userInput.substring(0, 50)}`,
        description: "Buscar información y recursos relevantes",
        category: "personal",
        priority: "medium",
        estimatedTime: 30,
      })
    }

    return tasks
  }

  const generateWishlistFromResponse = (userInput: string, aiResponse: string): any[] => {
    const items = []
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("productividad")) {
      items.push(
        {
          text: "Curso de gestión del tiempo",
          description: "Curso online para mejorar productividad personal",
          category: "education",
          priority: "medium",
          estimatedCost: 99,
        },
        {
          text: "App de seguimiento de hábitos premium",
          description: "Suscripción anual para app de productividad",
          category: "tools",
          priority: "low",
          estimatedCost: 60,
        },
      )
    } else if (lowerInput.includes("salud") || lowerInput.includes("fitness")) {
      items.push({
        text: "Membresía de gimnasio",
        description: "Acceso completo a instalaciones y clases",
        category: "health",
        priority: "high",
        estimatedCost: 50,
      })
    }

    return items
  }

  const generateNotesFromResponse = (userInput: string, aiResponse: string): any[] => {
    return [
      {
        title: `Plan IA: ${userInput.substring(0, 40)}...`,
        content: `🤖 Respuesta de FutureTask AI\n\n${aiResponse}\n\n---\nConsulta original: "${userInput}"\nFecha: ${new Date().toLocaleString("es-ES")}\nModelo: GPT-4o-mini`,
        category: "ai-generated",
        tags: ["ia", "planificacion", "productividad"],
      },
    ]
  }

  const generatePomodoroSessions = (userInput: string): any[] => {
    return [
      {
        task: userInput.substring(0, 50),
        duration: 25,
        breakDuration: 5,
        sessions: 4,
        description: "Sesión de Pomodoro recomendada por IA",
      },
    ]
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(`ai_messages_${userId}`)
  }

  if (compact) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Asistente IA
            {isPro && (
              <Badge className="ml-2 bg-purple-500 text-white text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {aiCredits}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isPro ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-4">Actualiza a Pro para acceder al Asistente IA</p>
              <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
                <Crown className="w-4 h-4 mr-2" />
                Actualizar a Pro
              </Button>
            </div>
          ) : aiCredits <= 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-4">Sin créditos IA disponibles</p>
              <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Comprar Créditos
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat General
                    </div>
                  </SelectItem>
                  <SelectItem value="tasks">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Generar Tareas
                    </div>
                  </SelectItem>
                  <SelectItem value="wishlist">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Lista de Deseos
                    </div>
                  </SelectItem>
                  <SelectItem value="notes">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Generar Notas
                    </div>
                  </SelectItem>
                  <SelectItem value="pomodoro">
                    <div className="flex items-center">
                      <Timer className="w-4 h-4 mr-2" />
                      Sesión Pomodoro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              {messages.length > 0 && (
                <ScrollArea className="h-32 w-full">
                  <div className="space-y-2">
                    {messages.slice(-3).map((message) => (
                      <div
                        key={message.id}
                        className={`text-xs p-2 rounded ${
                          message.role === "user"
                            ? "bg-blue-500/20 text-blue-200 ml-4"
                            : "bg-purple-500/20 text-purple-200 mr-4"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{message.role === "user" ? "Tú" : "IA"}</span>
                          {message.creditsUsed && (
                            <Badge className="bg-yellow-500 text-black text-xs">-{message.creditsUsed}</Badge>
                          )}
                        </div>
                        <p>{message.content.substring(0, 100)}...</p>

                        {/* Show generated content buttons */}
                        {message.generatedContent && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.generatedContent.tasks && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 px-2 bg-transparent"
                                onClick={() => onTasksGenerated?.(message.generatedContent!.tasks!)}
                              >
                                +{message.generatedContent.tasks.length} Tareas
                              </Button>
                            )}
                            {message.generatedContent.wishlistItems && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 px-2 bg-transparent"
                                onClick={() => onWishlistGenerated?.(message.generatedContent!.wishlistItems!)}
                              >
                                +{message.generatedContent.wishlistItems.length} Deseos
                              </Button>
                            )}
                            {message.generatedContent.notes && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 px-2 bg-transparent"
                                onClick={() => onNotesGenerated?.(message.generatedContent!.notes!)}
                              >
                                +{message.generatedContent.notes.length} Notas
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Asistente IA</h2>
            <p className="text-white/70">Tu compañero inteligente de productividad</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isPro && (
            <Badge className="bg-purple-500 text-white">
              <Zap className="w-4 h-4 mr-2" />
              {aiCredits} créditos disponibles
            </Badge>
          )}
          {messages.length > 0 && (
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="text-white border-white/20 bg-transparent"
            >
              Limpiar Chat
            </Button>
          )}
        </div>
      </div>

      {!isPro ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Bot className="w-16 h-16 text-white/50 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Desbloquea el Poder de la IA</h3>
              <p className="text-white/70 mb-6">
                Actualiza a Pro para acceder a nuestro asistente IA avanzado que puede generar tareas, gestionar
                pomodoros, crear listas de deseos y mucho más.
              </p>
              <Button onClick={onUpgrade} size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Crown className="w-5 h-5 mr-2" />
                Actualizar a Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : aiCredits <= 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Zap className="w-16 h-16 text-white/50 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Sin Créditos IA</h3>
              <p className="text-white/70 mb-6">
                Has agotado tus créditos de IA. Compra más créditos para continuar usando el asistente.
              </p>
              <Button onClick={onUpgrade} size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-5 h-5 mr-2" />
                Comprar Créditos
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Chat con IA</span>
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat General
                        </div>
                      </SelectItem>
                      <SelectItem value="tasks">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Generar Tareas
                        </div>
                      </SelectItem>
                      <SelectItem value="wishlist">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          Lista de Deseos
                        </div>
                      </SelectItem>
                      <SelectItem value="notes">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Generar Notas
                        </div>
                      </SelectItem>
                      <SelectItem value="pomodoro">
                        <div className="flex items-center">
                          <Timer className="w-4 h-4 mr-2" />
                          Sesión Pomodoro
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-96 w-full p-4 bg-black/20 rounded-lg">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-white/50 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4" />
                        <p>¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?</p>
                        <div className="mt-4 text-sm text-white/40">
                          <p>Puedo ayudarte a:</p>
                          <ul className="mt-2 space-y-1">
                            <li>• Generar tareas y planificar tu día</li>
                            <li>• Crear listas de deseos personalizadas</li>
                            <li>• Tomar notas y organizar ideas</li>
                            <li>• Configurar sesiones de Pomodoro</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-purple-500/20 text-purple-100 border border-purple-500/30"
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              {message.role === "assistant" && <Bot className="w-4 h-4 mt-1 text-purple-400" />}
                              <div className="flex-1">
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-xs opacity-70">
                                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                  {message.creditsUsed && (
                                    <Badge className="bg-yellow-500 text-black text-xs">
                                      -{message.creditsUsed} créditos
                                    </Badge>
                                  )}
                                </div>

                                {/* Generated Content Actions */}
                                {message.generatedContent && (
                                  <div className="mt-3 space-y-2">
                                    {message.generatedContent.tasks && message.generatedContent.tasks.length > 0 && (
                                      <div className="flex items-center justify-between p-2 bg-blue-50/10 rounded border border-blue-500/20">
                                        <span className="text-xs text-blue-200">
                                          {message.generatedContent.tasks.length} tareas generadas
                                        </span>
                                        <Button
                                          size="sm"
                                          onClick={() => onTasksGenerated?.(message.generatedContent!.tasks!)}
                                          className="bg-blue-600 hover:bg-blue-700 text-xs h-6"
                                        >
                                          Agregar Tareas
                                        </Button>
                                      </div>
                                    )}

                                    {message.generatedContent.wishlistItems &&
                                      message.generatedContent.wishlistItems.length > 0 && (
                                        <div className="flex items-center justify-between p-2 bg-pink-50/10 rounded border border-pink-500/20">
                                          <span className="text-xs text-pink-200">
                                            {message.generatedContent.wishlistItems.length} elementos de lista de deseos
                                          </span>
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              onWishlistGenerated?.(message.generatedContent!.wishlistItems!)
                                            }
                                            className="bg-pink-600 hover:bg-pink-700 text-xs h-6"
                                          >
                                            Agregar a Lista
                                          </Button>
                                        </div>
                                      )}

                                    {message.generatedContent.notes && message.generatedContent.notes.length > 0 && (
                                      <div className="flex items-center justify-between p-2 bg-green-50/10 rounded border border-green-500/20">
                                        <span className="text-xs text-green-200">
                                          {message.generatedContent.notes.length} notas generadas
                                        </span>
                                        <Button
                                          size="sm"
                                          onClick={() => onNotesGenerated?.(message.generatedContent!.notes!)}
                                          className="bg-green-600 hover:bg-green-700 text-xs h-6"
                                        >
                                          Guardar Notas
                                        </Button>
                                      </div>
                                    )}

                                    {message.generatedContent.pomodoroSessions &&
                                      message.generatedContent.pomodoroSessions.length > 0 && (
                                        <div className="flex items-center justify-between p-2 bg-orange-50/10 rounded border border-orange-500/20">
                                          <span className="text-xs text-orange-200">Sesión Pomodoro configurada</span>
                                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs h-6">
                                            Iniciar Pomodoro
                                          </Button>
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-purple-500/20 text-purple-100 border border-purple-500/30 px-4 py-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-purple-400" />
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Pensando...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <Separator className="bg-white/10" />

                {/* Input Area */}
                <div className="space-y-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu mensaje aquí... Ejemplo: 'Ayúdame a crear un plan de ejercicios para la semana'"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none min-h-[80px]"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-white/50">
                      Presiona Enter para enviar, Shift+Enter para nueva línea
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => {
                    setSelectedAction("tasks")
                    setInput("Genera 3 tareas importantes para hoy basadas en productividad y organización personal")
                  }}
                  className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-200"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Generar Tareas
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAction("wishlist")
                    setInput(
                      "Crea elementos para mi lista de deseos relacionados con productividad y crecimiento personal",
                    )
                  }}
                  className="w-full justify-start bg-pink-500/20 hover:bg-pink-500/30 text-pink-200"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Lista de Deseos
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAction("notes")
                    setInput("Genera notas útiles sobre técnicas de productividad y gestión del tiempo")
                  }}
                  className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-200"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Crear Notas
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAction("pomodoro")
                    setInput("Configura una sesión de Pomodoro para estudiar programación durante 2 horas")
                  }}
                  className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 text-orange-200"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Sesión Pomodoro
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAction("chat")
                    setInput("Dame consejos personalizados para mejorar mi productividad diaria")
                  }}
                  className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-200"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Consejos IA
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Créditos restantes:</span>
                    <Badge className="bg-purple-500 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      {aiCredits}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Mensajes hoy:</span>
                    <span className="text-white">{messages.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Tareas generadas:</span>
                    <span className="text-white">
                      {messages.reduce((acc, msg) => acc + (msg.generatedContent?.tasks?.length || 0), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Tips de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• Sé específico en tus consultas para mejores resultados</p>
                  <p>• Usa los botones de acción rápida para tareas comunes</p>
                  <p>• El IA puede generar contenido directamente en tu calendario</p>
                  <p>• Cada consulta consume créditos según la complejidad</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
