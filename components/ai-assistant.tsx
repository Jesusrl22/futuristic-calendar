"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, Sparkles, Loader2, Lightbulb, Target, Calendar, Clock } from "lucide-react"

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

export function AIAssistant({ onAIRequest, theme, t, user }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "¡Hola! Soy tu asistente de IA. Puedo ayudarte a crear planes personalizados para cualquier objetivo. Por ejemplo, puedes decirme 'quiero aprender inglés' o 'quiero hacer ejercicio' y crearé un plan completo con tareas, objetivos y cronograma. ¿En qué te gustaría que te ayude?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickSuggestions = [
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Quiero aprender inglés",
      description: "Plan completo de aprendizaje",
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "Quiero hacer ejercicio",
      description: "Rutina de fitness personalizada",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      text: "Organizar mi tiempo",
      description: "Gestión de tiempo eficiente",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Mejorar mi productividad",
      description: "Técnicas y hábitos productivos",
    },
  ]

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Get AI response and create plan
      const aiResponse = await onAIRequest(messageToSend)

      // Add AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Show success message with details
      if (aiResponse.tasks || aiResponse.wishlistItems || aiResponse.notes) {
        const detailsMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: `✅ Plan creado exitosamente:\n\n${aiResponse.tasks ? `📋 ${aiResponse.tasks.length} tareas programadas\n` : ""}${aiResponse.wishlistItems ? `⭐ ${aiResponse.wishlistItems.length} objetivos añadidos\n` : ""}${aiResponse.notes ? `📝 ${aiResponse.notes.length} notas de referencia\n` : ""}\n¡Revisa tus otras pestañas para ver todo organizado!`,
          timestamp: new Date(),
        }

        setTimeout(() => {
          setMessages((prev) => [...prev, detailsMessage])
        }, 1000)
      }
    } catch (error) {
      console.error("Error with AI request:", error)

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.",
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
      handleSendMessage()
    }
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border} h-[600px] flex flex-col`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
          <Bot className="w-5 h-5 text-purple-400" />
          <span>{t("aiAssistant")}</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </CardTitle>
        <div className={`text-xs ${theme.textMuted} flex items-center space-x-2`}>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>IA Pro activa</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
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
                    <span className="text-xs text-purple-400 font-medium">Asistente IA</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-2 opacity-70`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-lg ${theme.cardBg} ${theme.border} ${theme.textPrimary}`}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-sm">Creando tu plan personalizado...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className={`text-xs ${theme.textMuted}`}>Sugerencias rápidas:</p>
            <div className="grid grid-cols-1 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(suggestion.text)}
                  className={`${theme.buttonSecondary} text-left justify-start h-auto p-2`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    {suggestion.icon}
                    <div>
                      <div className="text-xs font-medium">{suggestion.text}</div>
                      <div className={`text-xs ${theme.textMuted}`}>{suggestion.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu objetivo o pregunta aquí... (ej: 'quiero aprender programación')"
            className={`${theme.inputBg} text-sm resize-none`}
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className={`${theme.buttonPrimary} px-3`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {/* Pro Features Info */}
        <div className={`text-xs ${theme.textMuted} text-center p-2 border border-purple-500/20 rounded`}>
          <Sparkles className="w-3 h-3 inline mr-1" />
          Plan Pro: IA ilimitada • Creación automática • Planificación inteligente
        </div>
      </CardContent>
    </Card>
  )
}
