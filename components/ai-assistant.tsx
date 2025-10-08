"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Loader2, Zap, Crown, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIAssistantProps {
  userId: string
  credits: number
  onCreditsUpdate: (newCredits: number) => void
  userPlan: string
  onUpgrade?: () => void
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistant({ userId, credits, onCreditsUpdate, userPlan, onUpgrade }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de IA. Puedo ayudarte a organizar tareas, crear listas, generar ideas y mucho más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    if (credits <= 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, no tienes créditos suficientes. Por favor, actualiza tu plan para continuar usando el asistente de IA.",
          timestamp: new Date(),
        },
      ])
      return
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message: input,
          conversationHistory: messages.slice(-5),
        }),
      })

      if (!response.ok) {
        throw new Error("Error al comunicarse con el asistente")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      onCreditsUpdate(data.remainingCredits)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
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

  const isPro = userPlan === "pro" || userPlan === "pro-yearly"

  return (
    <Card className="glass-effect border-purple-500/20 h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Asistente IA
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
              <Zap className="h-3 w-3 mr-1" />
              {credits} créditos
            </Badge>
            {isPro && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {!isPro && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/50">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              El asistente de IA solo está disponible en el plan Pro.{" "}
              {onUpgrade && (
                <button onClick={onUpgrade} className="underline font-semibold hover:text-yellow-100">
                  Actualiza ahora
                </button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800/50 text-gray-100 border border-purple-500/20"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isPro ? "Escribe tu mensaje..." : "Actualiza a Pro para usar el asistente"}
            disabled={!isPro || isLoading}
            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!isPro || !input.trim() || isLoading || credits <= 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { AIAssistant as default }
