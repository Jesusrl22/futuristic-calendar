"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  CalendarIcon,
  User,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
  Brain,
  Target,
  Zap,
  BarChart3,
  Smartphone,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"

export default function BlogPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Todos", count: 10 },
    { id: "productivity", name: "Productividad", count: 4 },
    { id: "technology", name: "Tecnología", count: 3 },
    { id: "organization", name: "Organización", count: 3 },
  ]

  const featuredPosts = [
    {
      id: 1,
      title: "Cómo la IA está revolucionando la productividad personal",
      excerpt: "Descubre las últimas tendencias en inteligencia artificial aplicada a la gestión del tiempo y tareas.",
      category: "technology",
      author: "María González",
      date: "2025-01-15",
      readTime: "8 min",
      views: 2340,
      comments: 23,
      featured: true,
    },
    {
      id: 2,
      title: "10 técnicas de organización que cambiarán tu vida",
      excerpt: "Métodos probados para organizar tu espacio de trabajo y aumentar tu eficiencia diaria.",
      category: "organization",
      author: "Carlos Rodríguez",
      date: "2025-01-12",
      readTime: "6 min",
      views: 1890,
      comments: 18,
      featured: true,
    },
  ]

  const allPosts = [
    ...featuredPosts,
    {
      id: 3,
      title: "El método Pomodoro en la era digital",
      excerpt: "Cómo adaptar esta técnica clásica de productividad a las herramientas modernas de trabajo.",
      category: "productivity",
      author: "Ana Martín",
      date: "2025-01-10",
      readTime: "5 min",
      views: 1567,
      comments: 15,
      featured: false,
    },
    {
      id: 4,
      title: "Automatización de tareas: Guía completa para principiantes",
      excerpt: "Aprende a automatizar tareas repetitivas y libera tiempo para actividades más importantes.",
      category: "technology",
      author: "David López",
      date: "2025-01-08",
      readTime: "10 min",
      views: 2100,
      comments: 31,
      featured: false,
    },
    {
      id: 5,
      title: "Workspace minimalista: Menos es más",
      excerpt: "Cómo crear un espacio de trabajo limpio y organizado que potencie tu concentración.",
      category: "organization",
      author: "Laura Sánchez",
      date: "2025-01-05",
      readTime: "4 min",
      views: 1234,
      comments: 12,
      featured: false,
    },
    {
      id: 6,
      title: "Gestión del tiempo para emprendedores",
      excerpt: "Estrategias específicas para maximizar la productividad cuando cada minuto cuenta.",
      category: "productivity",
      author: "Roberto Fernández",
      date: "2025-01-03",
      readTime: "7 min",
      views: 1876,
      comments: 22,
      featured: false,
    },
    {
      id: 7,
      title: "Inteligencia artificial y el futuro del trabajo",
      excerpt: "Análisis de cómo la IA transformará nuestras rutinas laborales en los próximos años.",
      category: "technology",
      author: "Elena Ruiz",
      date: "2025-01-01",
      readTime: "9 min",
      views: 2567,
      comments: 45,
      featured: false,
    },
    {
      id: 8,
      title: "Técnicas de priorización: Matriz de Eisenhower 2.0",
      excerpt: "Una versión actualizada del clásico método de priorización adaptado a la era digital.",
      category: "productivity",
      author: "Miguel Torres",
      date: "2024-12-28",
      readTime: "6 min",
      views: 1445,
      comments: 19,
      featured: false,
    },
    {
      id: 9,
      title: "Organización digital: Domina tus archivos y carpetas",
      excerpt: "Sistema completo para mantener organizados todos tus documentos digitales.",
      category: "organization",
      author: "Carmen Jiménez",
      date: "2024-12-25",
      readTime: "8 min",
      views: 1678,
      comments: 16,
      featured: false,
    },
    {
      id: 10,
      title: "Productividad móvil: Las mejores apps del 2025",
      excerpt: "Selección de aplicaciones móviles que te ayudarán a ser más productivo desde cualquier lugar.",
      category: "productivity",
      author: "Javier Moreno",
      date: "2024-12-22",
      readTime: "5 min",
      views: 1923,
      comments: 28,
      featured: false,
    },
  ]

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "productivity":
        return <Target className="h-4 w-4" />
      case "technology":
        return <Brain className="h-4 w-4" />
      case "organization":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "productivity":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "technology":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "organization":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
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
          <span className="text-foreground">Blog</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="w-fit mx-auto">
              📝 Blog
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold">Recursos y consejos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre las últimas tendencias en productividad, organización y tecnología para optimizar tu día a día.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  {getCategoryIcon(category.id)}
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "all" && (
        <section className="py-12">
          <div className="container">
            <div className="flex items-center space-x-2 mb-8">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Artículos destacados</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="hover-lift transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1 capitalize">{post.category}</span>
                      </Badge>
                      <Badge variant="outline">Destacado</Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all"
                ? "Todos los artículos"
                : `Artículos de ${categories.find((c) => c.id === selectedCategory)?.name}`}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} artículo{filteredPosts.length !== 1 ? "s" : ""} encontrado
              {filteredPosts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover-lift transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {getCategoryIcon(post.category)}
                      <span className="ml-1 capitalize">{post.category}</span>
                    </Badge>
                    {post.featured && <Badge variant="outline">Destacado</Badge>}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="leading-relaxed">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No se encontraron artículos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-white" />
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
                  <User className="h-4 w-4" />
                  <span>support@future-task.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
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
