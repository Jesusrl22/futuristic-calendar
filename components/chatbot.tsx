"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2, Trash2, Download, Settings } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "suggestion" | "help"
}

interface ChatbotProps {
  language: string
}

const responses = {
  es: {
    greeting: "¡Hola! Soy tu asistente de FutureTask. ¿En qué puedo ayudarte hoy?",
    help: "Puedo ayudarte con:\n• Crear y gestionar tareas\n• Configurar recordatorios\n• Usar el temporizador Pomodoro\n• Organizar tu calendario\n• Consejos de productividad",
    taskHelp:
      "Para crear una tarea, haz clic en el botón 'Añadir Tarea' o dime qué necesitas hacer y te ayudo a organizarlo.",
    pomodoroHelp:
      "El método Pomodoro te ayuda a mantener el foco. Trabaja 25 minutos, descansa 5. ¿Quieres que configure un temporizador?",
    productivityTips: [
      "Divide las tareas grandes en subtareas más pequeñas",
      "Usa la técnica Pomodoro para mantener el foco",
      "Prioriza tus tareas según su importancia y urgencia",
      "Toma descansos regulares para mantener la productividad",
      "Revisa y ajusta tus objetivos semanalmente",
    ],
    unknown:
      "No estoy seguro de cómo ayudarte con eso. ¿Podrías ser más específico? Puedo ayudarte con tareas, calendario, Pomodoro y productividad.",
    goodbye: "¡Hasta luego! Estaré aquí cuando me necesites. ¡Que tengas un día productivo!",
  },
  en: {
    greeting: "Hello! I'm your FutureTask assistant. How can I help you today?",
    help: "I can help you with:\n• Creating and managing tasks\n• Setting up reminders\n• Using the Pomodoro timer\n• Organizing your calendar\n• Productivity tips",
    taskHelp:
      "To create a task, click the 'Add Task' button or tell me what you need to do and I'll help you organize it.",
    pomodoroHelp:
      "The Pomodoro method helps you stay focused. Work for 25 minutes, rest for 5. Would you like me to set up a timer?",
    productivityTips: [
      "Break large tasks into smaller subtasks",
      "Use the Pomodoro technique to maintain focus",
      "Prioritize tasks based on importance and urgency",
      "Take regular breaks to maintain productivity",
      "Review and adjust your goals weekly",
    ],
    unknown:
      "I'm not sure how to help with that. Could you be more specific? I can help with tasks, calendar, Pomodoro, and productivity.",
    goodbye: "See you later! I'll be here when you need me. Have a productive day!",
  },
  fr: {
    greeting: "Salut ! Je suis votre assistant FutureTask. Comment puis-je vous aider aujourd'hui ?",
    help: "Je peux vous aider avec :\n• Créer et gérer des tâches\n• Configurer des rappels\n• Utiliser le minuteur Pomodoro\n• Organiser votre calendrier\n• Conseils de productivité",
    taskHelp:
      "Pour créer une tâche, cliquez sur le bouton 'Ajouter une tâche' ou dites-moi ce que vous devez faire et je vous aiderai à l'organiser.",
    pomodoroHelp:
      "La méthode Pomodoro vous aide à rester concentré. Travaillez 25 minutes, reposez-vous 5. Voulez-vous que je configure un minuteur ?",
    productivityTips: [
      "Divisez les grandes tâches en sous-tâches plus petites",
      "Utilisez la technique Pomodoro pour maintenir la concentration",
      "Priorisez les tâches selon leur importance et urgence",
      "Prenez des pauses régulières pour maintenir la productivité",
      "Révisez et ajustez vos objectifs chaque semaine",
    ],
    unknown:
      "Je ne suis pas sûr de comment vous aider avec ça. Pourriez-vous être plus précis ? Je peux aider avec les tâches, le calendrier, Pomodoro et la productivité.",
    goodbye: "À bientôt ! Je serai là quand vous aurez besoin de moi. Passez une journée productive !",
  },
  de: {
    greeting: "Hallo! Ich bin Ihr FutureTask-Assistent. Wie kann ich Ihnen heute helfen?",
    help: "Ich kann Ihnen helfen mit:\n• Aufgaben erstellen und verwalten\n• Erinnerungen einrichten\n• Den Pomodoro-Timer verwenden\n• Ihren Kalender organisieren\n• Produktivitätstipps",
    taskHelp:
      "Um eine Aufgabe zu erstellen, klicken Sie auf 'Aufgabe hinzufügen' oder sagen Sie mir, was Sie tun müssen, und ich helfe Ihnen bei der Organisation.",
    pomodoroHelp:
      "Die Pomodoro-Methode hilft Ihnen, fokussiert zu bleiben. Arbeiten Sie 25 Minuten, ruhen Sie 5. Soll ich einen Timer einrichten?",
    productivityTips: [
      "Teilen Sie große Aufgaben in kleinere Unteraufgaben auf",
      "Verwenden Sie die Pomodoro-Technik, um den Fokus zu behalten",
      "Priorisieren Sie Aufgaben nach Wichtigkeit und Dringlichkeit",
      "Machen Sie regelmäßige Pausen, um produktiv zu bleiben",
      "Überprüfen und passen Sie Ihre Ziele wöchentlich an",
    ],
    unknown:
      "Ich bin mir nicht sicher, wie ich dabei helfen kann. Könnten Sie spezifischer sein? Ich kann bei Aufgaben, Kalender, Pomodoro und Produktivität helfen.",
    goodbye: "Bis später! Ich bin da, wenn Sie mich brauchen. Haben Sie einen produktiven Tag!",
  },
  it: {
    greeting: "Ciao! Sono il tuo assistente FutureTask. Come posso aiutarti oggi?",
    help: "Posso aiutarti con:\n• Creare e gestire attività\n• Impostare promemoria\n• Usare il timer Pomodoro\n• Organizzare il tuo calendario\n• Consigli di produttività",
    taskHelp:
      "Per creare un'attività, clicca sul pulsante 'Aggiungi Attività' o dimmi cosa devi fare e ti aiuterò a organizzarlo.",
    pomodoroHelp:
      "Il metodo Pomodoro ti aiuta a rimanere concentrato. Lavora 25 minuti, riposa 5. Vuoi che imposti un timer?",
    productivityTips: [
      "Dividi le attività grandi in sotto-attività più piccole",
      "Usa la tecnica Pomodoro per mantenere la concentrazione",
      "Prioritizza le attività in base a importanza e urgenza",
      "Fai pause regolari per mantenere la produttività",
      "Rivedi e aggiusta i tuoi obiettivi settimanalmente",
    ],
    unknown:
      "Non sono sicuro di come aiutarti con questo. Potresti essere più specifico? Posso aiutare con attività, calendario, Pomodoro e produttività.",
    goodbye: "A dopo! Sarò qui quando avrai bisogno di me. Buona giornata produttiva!",
  },
}

export function Chatbot({ language = "es" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatbot-messages")
      if (saved) {
        try {
          return JSON.parse(saved).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        } catch (error) {
          console.error("Error parsing saved messages:", error)
        }
      }
    }
    return []
  })
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentResponses = responses[language as keyof typeof responses] || responses.es

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatbot-messages", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addMessage = (content: string, sender: "user" | "bot", type: "text" | "suggestion" | "help" = "text") => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender,
      timestamp: new Date(),
      type,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (
      message.includes("hola") ||
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("salut") ||
      message.includes("ciao")
    ) {
      return currentResponses.greeting
    }

    if (
      message.includes("ayuda") ||
      message.includes("help") ||
      message.includes("aide") ||
      message.includes("hilfe") ||
      message.includes("aiuto")
    ) {
      return currentResponses.help
    }

    if (
      message.includes("tarea") ||
      message.includes("task") ||
      message.includes("tâche") ||
      message.includes("aufgabe") ||
      message.includes("attività")
    ) {
      return currentResponses.taskHelp
    }

    if (
      message.includes("pomodoro") ||
      message.includes("timer") ||
      message.includes("temporizador") ||
      message.includes("minuteur")
    ) {
      return currentResponses.pomodoroHelp
    }

    if (
      message.includes("consejo") ||
      message.includes("tip") ||
      message.includes("conseil") ||
      message.includes("tipp") ||
      message.includes("consiglio") ||
      message.includes("productividad") ||
      message.includes("productivity") ||
      message.includes("productivité") ||
      message.includes("produktivität") ||
      message.includes("produttività")
    ) {
      const randomTip =
        currentResponses.productivityTips[Math.floor(Math.random() * currentResponses.productivityTips.length)]
      return `💡 Consejo de productividad: ${randomTip}`
    }

    if (
      message.includes("adiós") ||
      message.includes("bye") ||
      message.includes("au revoir") ||
      message.includes("auf wiedersehen") ||
      message.includes("ciao")
    ) {
      return currentResponses.goodbye
    }

    return currentResponses.unknown
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, "user")
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = getBotResponse(userMessage)
        addMessage(botResponse, "bot")
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearMessages = () => {
    setMessages([])
    toast.success("Conversación limpiada")
  }

  const exportMessages = () => {
    const data = {
      messages,
      exportDate: new Date().toISOString(),
      language,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chatbot-conversation-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Conversación exportada")
  }

  const addSuggestion = (suggestion: string) => {
    addMessage(suggestion, "user")
    setTimeout(() => {
      const botResponse = getBotResponse(suggestion)
      addMessage(botResponse, "bot")
    }, 500)
  }

  const suggestions = [
    "¿Cómo crear una tarea?",
    "Consejos de productividad",
    "¿Cómo usar Pomodoro?",
    "Ayuda con el calendario",
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? "w-80" : "w-96"}`}>
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-white text-lg">
              <Bot className="h-5 w-5 mr-2 text-purple-400" />
              Asistente FutureTask
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">En línea</Badge>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Configuración del Chat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button
                      onClick={clearMessages}
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar Conversación
                    </Button>
                    <Button
                      onClick={exportMessages}
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Conversación
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            <ScrollArea className="h-80 px-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">¡Hola! ¿En qué puedo ayudarte?</p>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => addSuggestion(suggestion)}
                          className="block w-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-white/10 text-white border border-white/20"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "bot" && <Bot className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />}
                        {message.sender === "user" && <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-purple-400" />
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
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/20">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export default Chatbot
