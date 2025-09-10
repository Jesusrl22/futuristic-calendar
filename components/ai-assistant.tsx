"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Bot, Send, Lightbulb, BookOpen, Dumbbell, Briefcase, Heart, Target, User } from "lucide-react"

interface AIAssistantProps {
  onAIRequest: (request: string) => Promise<any>
  theme: any
  t: (key: string) => string
  user: any
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

const QUICK_SUGGESTIONS = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    text: "Quiero aprender inglés",
    category: "learning",
  },
  {
    icon: <Dumbbell className="w-4 h-4" />,
    text: "Crear rutina de ejercicios",
    category: "health",
  },
  {
    icon: <Briefcase className="w-4 h-4" />,
    text: "Organizar mi trabajo",
    category: "work",
  },
  {
    icon: <Heart className="w-4 h-4" />,
    text: "Mejorar mi bienestar",
    category: "personal",
  },
  {
    icon: <Target className="w-4 h-4" />,
    text: "Establecer metas mensuales",
    category: "goals",
  },
  {
    icon: <Lightbulb className="w-4 h-4" />,
    text: "Desarrollar una habilidad nueva",
    category: "learning",
  },
]

export function AIAssistant({ onAIRequest, theme, t, user }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: `¡Hola ${user.name}! 👋 Soy tu asistente de IA personal. Puedo ayudarte a crear planes detallados, organizar tareas y establecer objetivos. ¿En qué te gustaría que te ayude hoy?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await onAIRequest(message)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error with AI request:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Lo siento, hubo un error procesando tu solicitud. Por favor intenta de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user?.is_pro) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <CardTitle className={`${theme.textPrimary} text-xl`}>Asistente IA</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`p-4 rounded-lg border border-purple-500/20 ${theme.cardBg}`}>
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-400" />
            <h3 className={`${theme.textPrimary} font-semibold mb-2`}>Funciones Pro</h3>
            <p className={`${theme.textSecondary} text-sm mb-4`}>
              Desbloquea el poder de la IA para planificación inteligente y creación automática de tareas.
            </p>
            <div className={`text-xs ${theme.textMuted} space-y-1`}>
              <div>• Planificación con IA</div>
              <div>• Creación automática de tareas</div>
              <div>• Objetivos inteligentes</div>
              <div>• Consultas ilimitadas</div>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Actualizar a Pro
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border} h-[600px] flex flex-col`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span>Asistente IA</span>
          <div className="flex items-center space-x-1 ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className={`text-xs ${theme.textMuted}`}>En línea</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[85%]`}>
                {message.type === "assistant" && (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : `${theme.cardBg} border ${theme.border}`
                  }`}
                >
                  <p className={`text-sm ${message.type === "user" ? "text-white" : theme.textPrimary}`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${message.type === "user" ? "text-purple-100" : theme.textMuted}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.type === "user" && (
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className={`p-3 rounded-lg ${theme.cardBg} border ${theme.border}`}>
                  <div className="flex items-center space-x-2">
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
                    <span className={`text-xs ${theme.textMuted}`}>Pensando...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="space-y-3">
            <p className={`text-xs ${theme.textMuted} text-center`}>Sugerencias rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion.text)}
                  className={`${theme.buttonSecondary} text-xs p-2 h-auto flex items-center space-x-2 justify-start`}
                  disabled={isLoading}
                >
                  {suggestion.icon}
                  <span className="truncate">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className={`${theme.inputBg} text-sm`}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage(inputValue)}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className={`${theme.buttonPrimary} px-3`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Tips */}
        <div className={`text-xs ${theme.textMuted} text-center p-2 border border-purple-500/20 rounded`}>
          💡 Tip: Sé específico en tus objetivos para obtener mejores planes personalizados
        </div>
      </CardContent>
    </Card>
  )
}
