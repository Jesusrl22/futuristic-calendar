"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const faqItems = [
    {
      question: "¿Cómo funciona la IA de FutureTask?",
      answer:
        "Nuestra IA analiza tus patrones de trabajo, horarios de mayor productividad y tipos de tareas para optimizar automáticamente tu calendario y sugerir los mejores momentos para cada actividad.",
    },
    {
      question: "¿Puedo sincronizar con otros calendarios?",
      answer:
        "Sí, FutureTask se integra perfectamente con Google Calendar, Outlook, Apple Calendar y la mayoría de aplicaciones de calendario populares.",
    },
    {
      question: "¿Hay una aplicación móvil disponible?",
      answer:
        "Actualmente estamos desarrollando nuestras aplicaciones nativas para iOS y Android. Mientras tanto, nuestra aplicación web es completamente responsive y funciona perfectamente en dispositivos móviles.",
    },
    {
      question: "¿Qué incluye el plan gratuito?",
      answer:
        "El plan gratuito incluye hasta 10 tareas por día, calendario básico, timer Pomodoro y estadísticas básicas. Es perfecto para usuarios individuales que quieren probar nuestras funcionalidades principales.",
    },
    {
      question: "¿Cómo puedo cancelar mi suscripción?",
      answer:
        "Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta. No hay penalizaciones y mantendrás acceso hasta el final de tu período de facturación actual.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center text-white hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al Inicio
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">FutureTask</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">Contáctanos</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ayudarte a maximizar tu productividad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Información de Contacto</CardTitle>
                <CardDescription className="text-slate-300">
                  Múltiples formas de ponerte en contacto con nosotros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-slate-300 text-sm">support@future-task.com</p>
                    <p className="text-slate-400 text-xs mt-1">Respuesta en 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Chat en Vivo</h3>
                    <p className="text-slate-300 text-sm">Disponible en la aplicación</p>
                    <p className="text-slate-400 text-xs mt-1">Lun-Vie 9:00-18:00 CET</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Teléfono</h3>
                    <p className="text-slate-300 text-sm">+34 958 123 456</p>
                    <p className="text-slate-400 text-xs mt-1">Solo usuarios Pro</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Oficina</h3>
                    <p className="text-slate-300 text-sm">Granada, España</p>
                    <p className="text-slate-400 text-xs mt-1">Cita previa requerida</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Lunes - Viernes</span>
                    <span className="text-white">9:00 - 18:00 CET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Sábado</span>
                    <span className="text-white">10:00 - 14:00 CET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Domingo</span>
                    <span className="text-slate-400">Cerrado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Envíanos un Mensaje</CardTitle>
                <CardDescription className="text-slate-300">
                  Completa el formulario y te responderemos lo antes posible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-slate-300">
                      Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">
                          Nombre
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-white">
                        Asunto
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">
                        Mensaje
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        placeholder="Describe tu consulta o problema en detalle..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Preguntas Frecuentes</CardTitle>
              <CardDescription className="text-slate-300">
                Encuentra respuestas rápidas a las preguntas más comunes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-white/10 last:border-b-0 pb-4 last:pb-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex justify-between items-center w-full text-left py-2 hover:text-blue-300 transition-colors"
                    >
                      <span className="text-white font-medium">{item.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="mt-2 text-slate-300 text-sm leading-relaxed">{item.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
