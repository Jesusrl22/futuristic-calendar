"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, Sparkles, Target, BookOpen, Dumbbell, Code, Briefcase, Heart } from "lucide-react"

interface AIAssistantProps {
  onAIRequest: (request: string) => Promise<any>
  theme: any
  t: (key: string) => string
  user: any
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
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
    text: "Quiero hacer ejercicio",
    category: "health",
  },
  {
    icon: <Code className="w-4 h-4" />,
    text: "Aprender programación",
    category: "learning",
  },
  {
    icon: <Briefcase className="w-4 h-4" />,
    text: "Mejorar productividad",
    category: "work",
  },
  {
    icon: <Heart className="w-4 h-4" />,
    text: "Cuidar mi salud mental",
    category: "health",
  },
  {
    icon: <Target className="w-4 h-4" />,
    text: "Organizar mi tiempo",
    category: "personal",
  },
]

export function AIAssistant({ onAIRequest, theme, t, user }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content: `¡Hola ${user.name}! 👋 Soy tu asistente IA personal. Puedo ayudarte a crear planes detallados para cualquier objetivo. Solo dime qué quieres lograr y yo me encargo del resto: crearé tareas, objetivos y un cronograma personalizado para ti.`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await onAIRequest(message)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error with AI request:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputMessage)
    }
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border} h-full flex flex-col`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
          <Bot className="w-5 h-5 text-purple-400" />
          <span>{t("aiAssistant")}</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div className="space-y-3">
            <p className={`text-sm ${theme.textSecondary}`}>Sugerencias rápidas:</p>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion.text)}
                  className={`${theme.buttonSecondary} justify-start text-left h-auto py-2 px-3`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    {suggestion.icon}
                    <span className="text-sm">{suggestion.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : `${theme.cardBg} ${theme.border} ${theme.textPrimary}`
                }`}
              >
                {message.type === "ai" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium">IA Assistant</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 opacity-60`}>{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-lg ${theme.cardBg} ${theme.border}`}>
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-purple-400" />
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
                  <span className={`text-sm ${theme.textSecondary}`}>Creando tu plan...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu objetivo aquí... (ej: 'Quiero aprender guitarra')"
              className={`${theme.inputBg} resize-none`}
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className={`text-xs ${theme.textMuted} text-center`}>
            💡 Sé específico con tus objetivos para obtener mejores resultados
          </div>
        </div>

        {/* Pro Features Info */}
        <div
          className={`text-xs ${theme.textMuted} text-center p-2 border border-purple-500/20 rounded bg-purple-500/5`}
        >
          <Sparkles className="w-3 h-3 inline mr-1" />
          Plan Pro: Consultas IA ilimitadas • Planes personalizados • Creación automática
        </div>
      </CardContent>
    </Card>
  )
}
