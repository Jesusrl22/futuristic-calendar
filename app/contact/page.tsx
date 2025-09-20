"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  Calendar,
  ChevronRight,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const faqs = [
    {
      question: "¿Cómo funciona la IA en FutureTask?",
      answer:
        "Nuestra IA analiza tus patrones de trabajo, aprende de tus preferencias y te ayuda a optimizar tu tiempo. Sugiere horarios, prioriza tareas y te recuerda actividades importantes.",
    },
    {
      question: "¿Es seguro almacenar mis datos en FutureTask?",
      answer:
        "Absolutamente. Utilizamos encriptación de nivel empresarial, backups automáticos y cumplimos con todas las regulaciones de privacidad como GDPR.",
    },
    {
      question: "¿Puedo usar FutureTask en múltiples dispositivos?",
      answer:
        "Sí, FutureTask se sincroniza automáticamente entre todos tus dispositivos. Puedes acceder desde web, móvil o tablet sin perder ningún dato.",
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer:
        "Sí, ofrecemos soporte técnico 24/7 por email y chat en vivo. También tenemos una extensa documentación y tutoriales en video.",
    },
    {
      question: "¿Hay una versión gratuita disponible?",
      answer:
        "Sí, ofrecemos un plan gratuito con funcionalidades básicas. Puedes actualizar a un plan premium en cualquier momento para acceder a características avanzadas de IA.",
    },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FutureTask
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                Características
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonios
              </Link>
              <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contacto
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/app">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/app">Comenzar Gratis</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Success Page */}
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">¡Mensaje Enviado!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos en las próximas 24 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog">
                  Leer el Blog
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FutureTask
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Características
            </Link>
            <Link href="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonios
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/app">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/app">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Contacto</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="w-fit mx-auto">
              📞 Contacto
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold">¿Necesitas ayuda?</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Envíanos un mensaje</span>
                  </CardTitle>
                  <CardDescription>
                    Completa el formulario y nos pondremos en contacto contigo en las próximas 24 horas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="¿En qué podemos ayudarte?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe tu consulta o problema..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                  <CardDescription>Otras formas de ponerte en contacto con nosotros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@future-task.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-muted-foreground">Granada, España</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Horario de atención</p>
                      <p className="text-sm text-muted-foreground">Lunes a Viernes: 9:00 - 18:00</p>
                      <p className="text-sm text-muted-foreground">Soporte 24/7 por email</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Prefieres hablar?</CardTitle>
                  <CardDescription>Programa una llamada con nuestro equipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Programar llamada
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background/50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="w-fit mx-auto">
              ❓ FAQ
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">Preguntas frecuentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encuentra respuestas rápidas a las preguntas más comunes sobre FutureTask.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-start space-x-3 text-lg">
                    <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pl-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">¿No encuentras lo que buscas?</p>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Envíanos tu pregunta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FutureTask</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                La plataforma de productividad más avanzada del 2025. Organiza tu vida con inteligencia artificial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="hover:text-white transition-colors">
                    Aplicación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Comunidad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@future-task.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Granada, España</span>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors flex items-center space-x-1">
                    <span>Página de contacto</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2025 FutureTask. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
