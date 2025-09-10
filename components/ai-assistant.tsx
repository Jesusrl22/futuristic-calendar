"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Sparkles } from "lucide-react"

interface AIAssistantProps {
  onAIRequest: (request: string) => Promise<any>
  theme: any
  t: (key: string) => string
  user: any
}

export function AIAssistant({ onAIRequest, theme, t, user }: AIAssistantProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await onAIRequest(userMessage)
      setMessages((prev) => [...prev, { role: "assistant", content: response.response }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lo siento, hubo un error procesando tu solicitud." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!user?.is_pro) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
            <Bot className="w-5 h-5 text-purple-400" />
            <span>{t("aiAssistant")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Sparkles className={`w-12 h-12 mx-auto mb-4 ${theme.textMuted}`} />
          <p className={theme.textPrimary}>Función Pro</p>
          <p className={theme.textSecondary}>Actualiza a Pro para usar la IA</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
          <Bot className="w-5 h-5 text-purple-400" />
          <span>{t("aiAssistant")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 overflow-y-auto space-y-3 p-3 border rounded-lg border-purple-500/20">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
              <p className={theme.textSecondary}>¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte?</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${message.role === "user" ? "bg-purple-500/20 ml-8" : "bg-gray-500/20 mr-8"}`}
            >
              <p className={`text-sm ${theme.textPrimary}`}>{message.content}</p>
            </div>
          ))}

          {isLoading && (
            <div className="bg-gray-500/20 mr-8 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
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
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Pregúntame algo o pídeme que cree un plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 ${theme.inputBg}`}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className={theme.buttonPrimary}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
