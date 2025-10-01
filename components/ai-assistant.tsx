"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Zap, AlertTriangle, Sparkles, ShoppingCart, Crown } from "lucide-react"
import { AiCreditsDisplay } from "@/components/ai-credits-display"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  creditsUsed?: number
}

interface AiAssistantProps {
  userId: string
  credits: number
  onCreditsUpdate: (newCredits: number) => void
  userPlan?: string
  onUpgrade?: () => void
}

export function AiAssistant({ userId, credits, onCreditsUpdate, userPlan = "free", onUpgrade }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de IA personal. Puedo ayudarte con tareas de productividad, planificación, ideas creativas y mucho más. Para usar mis servicios necesitas créditos IA. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const hasAICredits = () => {
    return credits > 0
  }

  const isProUser = () => {
    return userPlan === "pro" || userPlan === "pro-yearly"
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading || !hasAICredits()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response with demo responses
      const demoResponses = [
        "Excelente pregunta. Basándome en las mejores prácticas de productividad, te recomiendo dividir esa tarea en pasos más pequeños y manejables. ¿Te gustaría que te ayude a crear un plan detallado?",
        "Entiendo tu situación. Una estrategia efectiva sería aplicar la técnica Pomodoro: trabaja en bloques de 25 minutos con descansos de 5 minutos. Esto puede mejorar significativamente tu concentración.",
        "Esa es una idea interesante. Para implementarla de manera efectiva, considera estos factores clave: tiempo disponible, recursos necesarios y posibles obstáculos. ¿Quieres que profundicemos en alguno de estos aspectos?",
        "Te sugiero crear una lista de prioridades usando la matriz de Eisenhower: urgente/importante, importante/no urgente, urgente/no importante, y ni urgente ni importante. Esto te ayudará a enfocar tu energía en lo que realmente importa.",
        "Para mejorar tu organización, podrías implementar un sistema de etiquetas por colores, establecer recordatorios automáticos y revisar tus objetivos semanalmente. ¿Te gustaría que te ayude a configurar alguno de estos sistemas?",
      ]

      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const creditsUsed = Math.floor(Math.random() * 3) + 1 // 1-3 credits
      const newCredits = Math.max(0, credits - creditsUsed)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        creditsUsed,
      }

      setMessages((prev) => [...prev, assistantMessage])
      onCreditsUpdate(newCredits)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getPlanDisplayName = () => {
    switch (userPlan) {
      case "pro":
      case "pro-yearly":
        return "Pro"
      case "premium":
      case "premium-yearly":
        return "Premium"
      default:
        return "Free"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Asistente IA</h2>
            <p className="text-gray-400">Tu compañero inteligente de productividad</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-800 border-purple-500/30">
            Plan {getPlanDisplayName()}
          </Badge>
          <AiCreditsDisplay credits={credits} />
        </div>
      </div>

      {/* No Credits Warning for Free/Premium Users */}
      {!hasAICredits() && !isProUser() && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">¡Desbloquea el poder de la IA!</h3>
                <p className="text-gray-300 mb-4">Los planes {getPlanDisplayName()} no incluyen créditos IA. Puedes:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <Crown className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white mb-1">Actualizar a Pro</h4>
                    <p className="text-gray-400">Incluye 500-6000 créditos IA mensuales</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white mb-1">Comprar Créditos</h4>
                    <p className="text-gray-400">Paquetes desde 2,99€ (100 créditos)</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Actualizar a Pro
                </Button>
                <Button
                  onClick={onUpgrade}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Comprar Créditos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
        <CardHeader className="border-b border-purple-500/20">
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            Chat con IA
            {hasAICredits() && (
              <Badge variant="secondary" className="ml-auto bg-green-600/20 text-green-400">
                Activo
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-purple-600"
                          : "bg-gradient-to-br from-purple-500 to-pink-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-600/20 border border-blue-500/30"
                          : "bg-slate-800/50 border border-purple-500/30"
                      }`}
                    >
                      <p className="text-white text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.creditsUsed && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {message.creditsUsed} créditos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-sm">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-purple-500/20 p-4">
            {!hasAICredits() ? (
              <div className="text-center py-4">
                <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-amber-400 font-medium">Sin créditos IA disponibles</p>
                <p className="text-gray-400 text-sm">
                  {isProUser()
                    ? "Tus créditos mensuales se han agotado. Compra más créditos para continuar."
                    : "Los planes Free y Premium no incluyen créditos IA. Actualiza a Pro o compra créditos."}
                </p>
                <Button
                  onClick={onUpgrade}
                  className="mt-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  {isProUser() ? "Comprar Créditos" : "Ver Planes"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje aquí... (Shift+Enter para nueva línea)"
                  className="flex-1 bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !hasAICredits()}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Info */}
      <Card className="bg-slate-900/30 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="h-4 w-4" />
              <span>Cada mensaje consume 1-3 créditos según la complejidad</span>
            </div>
            <div className={`${hasAICredits() ? "text-purple-400" : "text-amber-400"}`}>
              {credits} créditos restantes
            </div>
          </div>
          {!isProUser() && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 Los planes Pro incluyen créditos IA mensuales automáticos
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
