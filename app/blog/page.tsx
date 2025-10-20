import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Search,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "Todos", count: 8 },
  { name: "Productividad", count: 3 },
  { name: "Gestión del tiempo", count: 2 },
  { name: "Tecnología", count: 2 },
  { name: "Bienestar", count: 1 },
]

const featuredArticles = [
  {
    id: 1,
    title: "Maximiza tu productividad en 2025",
    excerpt: "Descubre las mejores estrategias y herramientas para ser más productivo este año.",
    category: "Productividad",
    author: "María García",
    date: "15 Ene 2025",
    readTime: "5 min",
    image: "/productivity-workspace-2025.jpg",
    views: 1234,
    likes: 89,
    comments: 23,
    featured: true,
  },
  {
    id: 2,
    title: "La ciencia detrás de la técnica Pomodoro",
    excerpt: "Aprende por qué funciona esta técnica y cómo implementarla correctamente.",
    category: "Gestión del tiempo",
    author: "Carlos López",
    date: "12 Ene 2025",
    readTime: "8 min",
    image: "/time-management-professional.jpg",
    views: 987,
    likes: 67,
    comments: 15,
    featured: true,
  },
  {
    id: 3,
    title: "Organización digital: Guía completa",
    excerpt: "Todo lo que necesitas saber para organizar tu vida digital de manera eficiente.",
    category: "Tecnología",
    author: "Ana Martínez",
    date: "10 Ene 2025",
    readTime: "12 min",
    image: "/digital-organization-planning.jpg",
    views: 856,
    likes: 54,
    comments: 12,
    featured: false,
  },
]

const allArticles = [
  {
    id: 4,
    title: "Hábitos de éxito para profesionales",
    excerpt: "Los hábitos que practican las personas más exitosas en sus carreras.",
    category: "Productividad",
    author: "Pedro Ramírez",
    date: "8 Ene 2025",
    readTime: "6 min",
    image: "/success-habits-2025.jpg",
    views: 745,
    likes: 42,
    comments: 9,
  },
  {
    id: 5,
    title: "IA y productividad: El futuro del trabajo",
    excerpt: "Cómo la inteligencia artificial está transformando la manera en que trabajamos.",
    category: "Tecnología",
    author: "Laura Sánchez",
    date: "5 Ene 2025",
    readTime: "10 min",
    image: "/ai-productivity-tools.jpg",
    views: 623,
    likes: 38,
    comments: 7,
  },
  {
    id: 6,
    title: "Mindfulness en el lugar de trabajo",
    excerpt: "Técnicas de mindfulness para reducir el estrés y mejorar el rendimiento laboral.",
    category: "Bienestar",
    author: "Diego Torres",
    date: "3 Ene 2025",
    readTime: "7 min",
    image: "/mindfulness-workplace.jpg",
    views: 512,
    likes: 31,
    comments: 5,
  },
  {
    id: 7,
    title: "Automatización de tareas con IA",
    excerpt: "Aprende a automatizar tus tareas repetitivas con herramientas de IA.",
    category: "Productividad",
    author: "Carmen Ruiz",
    date: "1 Ene 2025",
    readTime: "9 min",
    image: "/task-automation-technology.jpg",
    views: 445,
    likes: 27,
    comments: 4,
  },
  {
    id: 8,
    title: "Gestión del tiempo para equipos remotos",
    excerpt: "Estrategias efectivas para gestionar el tiempo en equipos distribuidos.",
    category: "Gestión del tiempo",
    author: "Roberto Fernández",
    date: "29 Dic 2024",
    readTime: "11 min",
    image: "/remote-work-ai-technology.jpg",
    views: 389,
    likes: 22,
    comments: 3,
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <ArrowLeft className="h-6 w-6 text-purple-300 group-hover:text-purple-200 transition-colors" />
            <span className="text-xl font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
              Volver al inicio
            </span>
          </Link>

          <Link href="/" className="flex items-center space-x-2 group">
            <Calendar className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              FutureTask
            </span>
          </Link>

          <Link href="/login">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Comenzar gratis
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <BookOpen className="h-4 w-4 text-purple-300 animate-pulse" />
            <span className="text-sm">Blog de Productividad</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Aprende a ser más{" "}
            <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              productivo
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Consejos, estrategias y herramientas para mejorar tu productividad y alcanzar tus objetivos
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar artículos..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-xl focus:bg-white/15 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in animation-delay-200">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-white/10">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-bold">Artículos Destacados</h2>
          </div>
          <TrendingUp className="h-6 w-6 text-purple-300" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.id}`}>
              <Card
                className={`bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up ${
                  article.featured ? "ring-2 ring-purple-400/50" : ""
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg?height=200&width=400"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm">{article.category}</Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 line-clamp-2">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{article.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{article.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-400">{article.author}</span>
                    <span className="text-sm text-gray-400">{article.date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* All Articles */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 animate-fade-in">Todos los Artículos</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allArticles.map((article, index) => (
            <Link key={article.id} href={`/blog/${article.id}`}>
              <Card
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg?height=160&width=320"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute top-3 right-3 bg-purple-500/90 backdrop-blur-sm text-xs">
                    {article.category}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 pt-2">{article.date}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300 animate-fade-in">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-3xl font-bold">Suscríbete a nuestro Newsletter</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Recibe los últimos artículos y consejos de productividad directamente en tu correo
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <Input
                type="email"
                placeholder="Tu email..."
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400"
              />
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105">
                Suscribirse
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-purple-300" />
            <span className="text-lg font-semibold">FutureTask</span>
          </Link>

          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contacto
            </Link>
          </div>

          <div className="text-sm text-gray-300">© 2025 FutureTask. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  )
}
