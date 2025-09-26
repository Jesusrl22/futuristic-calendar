"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  TrendingUp,
  BookOpen,
  Bookmark,
  ArrowLeft,
  Trash2,
  Eye,
  MessageCircle,
  ChevronRight,
  BarChart3,
  Filter,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  image: string
  views: number
  comments: number
  likes: number
}

const allBlogPosts: BlogPost[] = [
  {
    id: "productividad-2025",
    title: "Las 10 Mejores Estrategias de Productividad para 2025",
    excerpt:
      "Descubre las técnicas más efectivas para maximizar tu productividad en el nuevo año, desde la gestión del tiempo hasta la automatización de tareas.",
    author: "María González",
    date: "2024-12-15",
    readTime: "12 min",
    category: "Productividad",
    tags: ["productividad", "estrategias", "2025", "eficiencia"],
    image: "/productivity-workspace-2025.jpg",
    views: 2847,
    comments: 23,
    likes: 156,
  },
  {
    id: "ia-trabajo-remoto",
    title: "Cómo la IA está Revolucionando el Trabajo Remoto",
    excerpt:
      "Explora las herramientas de inteligencia artificial que están transformando la forma en que trabajamos desde casa y mejorando la colaboración virtual.",
    author: "Carlos Rodríguez",
    date: "2024-12-10",
    readTime: "15 min",
    category: "Tecnología",
    tags: ["IA", "trabajo remoto", "tecnología", "futuro"],
    image: "/remote-work-ai-technology.jpg",
    views: 1923,
    comments: 18,
    likes: 89,
  },
  {
    id: "organizacion-digital",
    title: "Organización Digital: Herramientas y Métodos para 2025",
    excerpt:
      "Una guía completa sobre las mejores herramientas y metodologías para organizar tu vida digital y maximizar tu eficiencia personal.",
    author: "Ana Martínez",
    date: "2024-12-08",
    readTime: "18 min",
    category: "Organización",
    tags: ["organización", "digital", "herramientas", "productividad"],
    image: "/digital-organization-planning.jpg",
    views: 1456,
    comments: 12,
    likes: 67,
  },
  {
    id: "habitos-exitosos-2025",
    title: "7 Hábitos de Personas Altamente Exitosas en 2025",
    excerpt:
      "Descubre los hábitos modernos que están adoptando los profesionales más exitosos para mantenerse competitivos en la era digital.",
    author: "Diego Fernández",
    date: "2024-12-05",
    readTime: "10 min",
    category: "Desarrollo Personal",
    tags: ["hábitos", "éxito", "desarrollo personal", "liderazgo"],
    image: "/success-habits-2025.jpg",
    views: 2156,
    comments: 31,
    likes: 124,
  },
  {
    id: "herramientas-ia-productividad",
    title: "Las Mejores Herramientas de IA para Aumentar tu Productividad",
    excerpt:
      "Una revisión exhaustiva de las herramientas de inteligencia artificial más efectivas para automatizar tareas y optimizar tu flujo de trabajo.",
    author: "Laura Sánchez",
    date: "2024-12-03",
    readTime: "14 min",
    category: "Tecnología",
    tags: ["IA", "herramientas", "automatización", "eficiencia"],
    image: "/ai-productivity-tools.jpg",
    views: 1789,
    comments: 22,
    likes: 98,
  },
  {
    id: "gestion-tiempo-profesionales",
    title: "Gestión del Tiempo para Profesionales Ocupados",
    excerpt:
      "Técnicas avanzadas de gestión del tiempo específicamente diseñadas para profesionales con agendas complejas y múltiples responsabilidades.",
    author: "Roberto Jiménez",
    date: "2024-12-01",
    readTime: "11 min",
    category: "Productividad",
    tags: ["gestión del tiempo", "profesionales", "planificación", "eficiencia"],
    image: "/time-management-professional.jpg",
    views: 1634,
    comments: 19,
    likes: 87,
  },
]

export default function GuardadosPage() {
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [isLoading, setIsLoading] = useState(true)

  // Load saved articles from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedArticles")
      if (saved) {
        try {
          setSavedArticles(JSON.parse(saved))
        } catch (error) {
          console.error("Error parsing saved articles:", error)
          setSavedArticles([])
        }
      }
    }
    setIsLoading(false)
  }, [])

  // Save articles to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles))
    }
  }, [savedArticles])

  const removeSavedArticle = (articleId: string) => {
    setSavedArticles((prev) => prev.filter((id) => id !== articleId))
  }

  // Get saved posts data
  const savedPosts = allBlogPosts.filter((post) => savedArticles.includes(post.id))

  // Filter and sort saved posts
  const filteredPosts = savedPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "views":
          return b.views - a.views
        case "likes":
          return b.likes - a.likes
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const categories = ["all", ...Array.from(new Set(savedPosts.map((post) => post.category)))]

  // Statistics
  const totalViews = savedPosts.reduce((sum, post) => sum + post.views, 0)
  const totalReadTime = savedPosts.reduce((sum, post) => sum + Number.parseInt(post.readTime), 0)
  const mostPopularCategory =
    savedPosts.length > 0
      ? savedPosts.reduce(
          (acc, post) => {
            acc[post.category] = (acc[post.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )
      : {}

  const topCategory = Object.entries(mostPopularCategory).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 w-48 animate-pulse"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg max-w-2xl animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Posts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Blog
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Artículos Guardados
          </h1>
          <p className="text-xl text-muted-foreground">Tus artículos favoritos guardados para leer más tarde</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Guardados</p>
                  <p className="text-2xl font-bold">{savedPosts.length}</p>
                </div>
                <Bookmark className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tiempo de Lectura</p>
                  <p className="text-2xl font-bold">{totalReadTime} min</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vistas</p>
                  <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categoría Top</p>
                  <p className="text-2xl font-bold">{topCategory}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {savedPosts.length > 0 ? (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar en guardados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas las categorías" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="views">Vistas</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Mostrando {filteredPosts.length} de {savedPosts.length} artículos guardados
                {searchTerm && ` para "${searchTerm}"`}
                {selectedCategory !== "all" && ` en ${selectedCategory}`}
              </p>
            </div>

            {/* Saved Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSavedArticle(post.id)}
                          className="backdrop-blur-sm bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 p-2 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <Badge variant="outline">{post.category}</Badge>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{post.likes}</span>
                          </div>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <Button size="sm" variant="outline">
                            Leer
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron artículos</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar tus filtros de búsqueda para encontrar los artículos guardados
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-4">No tienes artículos guardados</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Comienza a guardar artículos interesantes desde el blog para crear tu biblioteca personal de contenido
            </p>
            <Link href="/blog">
              <Button size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar Blog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
