"use client"

import { useState, useEffect } from "react"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskForm } from "@/components/task-form"
import { StatsCards } from "@/components/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Trash2, Star, StickyNote, Target, Plus } from "lucide-react"

// Tipos básicos
interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  date: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  time?: string
  notificationEnabled?: boolean
}

interface Note {
  id: string
  title: string
  content: string
  color?: string
}

interface WishlistItem {
  id: string
  title: string
  description?: string
  price?: number
  url?: string
  priority: "low" | "medium" | "high"
  category: string
}

// Traducciones básicas
const translations = {
  calendar: "Calendario",
  tasks: "Tareas",
  notes: "Notas",
  wishlist: "Lista de Deseos",
  addTask: "Agregar Tarea",
  addNote: "Agregar Nota",
  addWishlistItem: "Agregar Deseo",
  taskTitle: "Título de la tarea",
  taskDescription: "Descripción",
  noteTitle: "Título de la nota",
  noteContent: "Contenido",
  wishlistTitle: "Título del deseo",
  wishlistDescription: "Descripción",
  date: "Fecha",
  time: "Hora",
  category: "Categoría",
  priority: "Prioridad",
  price: "Precio",
  work: "Trabajo",
  personal: "Personal",
  health: "Salud",
  learning: "Aprendizaje",
  other: "Otro",
  high: "Alta",
  medium: "Media",
  low: "Baja",
  save: "Guardar",
  cancel: "Cancelar",
  edit: "Editar",
  update: "Actualizar",
}

const t = (key: string) => translations[key as keyof typeof translations] || key

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Estados para formularios simples
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showWishlistForm, setShowWishlistForm] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteColor, setNoteColor] = useState("yellow")
  const [wishlistTitle, setWishlistTitle] = useState("")
  const [wishlistDescription, setWishlistDescription] = useState("")
  const [wishlistPrice, setWishlistPrice] = useState("")
  const [wishlistUrl, setWishlistUrl] = useState("")

  const [currentUser] = useState({
    id: "1",
    name: "Usuario Demo",
    email: "demo@example.com",
    theme: "default",
    language: "es",
    isPremium: false,
    pomodoroSessions: 5,
  })

  // Cargar datos del localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("futureTask_tasks_1")
    const savedNotes = localStorage.getItem("futureTask_notes_1")
    const savedWishlist = localStorage.getItem("futureTask_wishlist_1")

    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem("futureTask_tasks_1", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("futureTask_notes_1", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("futureTask_wishlist_1", JSON.stringify(wishlist))
  }, [wishlist])

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const editTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
    setEditingTask(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const addNote = () => {
    if (!noteTitle.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      color: noteColor,
    }
    setNotes((prev) => [...prev, newNote])

    // Reset form
    setNoteTitle("")
    setNoteContent("")
    setNoteColor("yellow")
    setShowNoteForm(false)
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  const addWishlistItem = () => {
    if (!wishlistTitle.trim()) return

    const newItem: WishlistItem = {
      id: Date.now().toString(),
      title: wishlistTitle,
      description: wishlistDescription || undefined,
      price: wishlistPrice ? Number.parseFloat(wishlistPrice) : undefined,
      url: wishlistUrl || undefined,
      priority: "medium",
      category: "personal",
    }
    setWishlist((prev) => [...prev, newItem])

    // Reset form
    setWishlistTitle("")
    setWishlistDescription("")
    setWishlistPrice("")
    setWishlistUrl("")
    setShowWishlistForm(false)
  }

  const deleteWishlistItem = (itemId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== itemId))
  }

  const NOTE_COLORS = [
    { name: "Amarillo", value: "yellow", class: "bg-yellow-100 border-yellow-300 text-yellow-900" },
    { name: "Rosa", value: "pink", class: "bg-pink-100 border-pink-300 text-pink-900" },
    { name: "Azul", value: "blue", class: "bg-blue-100 border-blue-300 text-blue-900" },
    { name: "Verde", value: "green", class: "bg-green-100 border-green-300 text-green-900" },
    { name: "Púrpura", value: "purple", class: "bg-purple-100 border-purple-300 text-purple-900" },
    { name: "Naranja", value: "orange", class: "bg-orange-100 border-orange-300 text-orange-900" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            🚀 FutureTask
          </h1>
          <p className="text-gray-300">Tu calendario inteligente del futuro</p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border-purple-500/20">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-500/20">
              <Calendar className="w-4 h-4 mr-2" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-purple-500/20">
              <StickyNote className="w-4 h-4 mr-2" />
              Notas
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-purple-500/20">
              <Star className="w-4 h-4 mr-2" />
              Deseos
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-500/20">
              <Target className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CalendarWidget
                  tasks={tasks}
                  onTaskToggle={toggleTask}
                  onEditTask={setEditingTask}
                  currentUser={currentUser}
                  translations={t}
                />
              </div>
              <div className="space-y-6">
                <TaskForm onAddTask={addTask} onEditTask={editTask} editingTask={editingTask} translations={t} />
                <StatsCards tasks={tasks} achievements={[]} currentUser={currentUser} translations={t} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <StickyNote className="w-5 h-5" />
                    <span>Mis Notas ({notes.length})</span>
                  </CardTitle>
                  <Button
                    onClick={() => setShowNoteForm(!showNoteForm)}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNoteForm && (
                  <div className="mb-6 p-4 bg-black/30 rounded-lg border border-purple-500/30">
                    <div className="space-y-4">
                      <Input
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Título de la nota"
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                      <Textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Contenido de la nota"
                        className="bg-black/30 border-purple-500/30 text-white min-h-[100px]"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        {NOTE_COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setNoteColor(color.value)}
                            className={`p-2 rounded-lg border-2 transition-all ${
                              noteColor === color.value
                                ? "border-white shadow-lg"
                                : "border-transparent hover:border-gray-300"
                            } ${color.class}`}
                          >
                            <div className="w-full h-4 rounded"></div>
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={addNote} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={() => setShowNoteForm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map((note) => {
                    const colorClass = NOTE_COLORS.find((c) => c.value === note.color)?.class || NOTE_COLORS[0].class
                    return (
                      <div
                        key={note.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-lg ${colorClass}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{note.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>
                    )
                  })}
                </div>

                {notes.length === 0 && !showNoteForm && (
                  <div className="text-center py-12">
                    <StickyNote className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-white text-lg">No tienes notas aún</p>
                    <p className="text-gray-400">¡Crea tu primera nota para comenzar!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Lista de Deseos ({wishlist.length})</span>
                  </CardTitle>
                  <Button
                    onClick={() => setShowWishlistForm(!showWishlistForm)}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Deseo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showWishlistForm && (
                  <div className="mb-6 p-4 bg-black/30 rounded-lg border border-purple-500/30">
                    <div className="space-y-4">
                      <Input
                        value={wishlistTitle}
                        onChange={(e) => setWishlistTitle(e.target.value)}
                        placeholder="¿Qué deseas conseguir?"
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                      <Textarea
                        value={wishlistDescription}
                        onChange={(e) => setWishlistDescription(e.target.value)}
                        placeholder="Descripción (opcional)"
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={wishlistPrice}
                          onChange={(e) => setWishlistPrice(e.target.value)}
                          placeholder="Precio (opcional)"
                          type="number"
                          className="bg-black/30 border-purple-500/30 text-white"
                        />
                        <Input
                          value={wishlistUrl}
                          onChange={(e) => setWishlistUrl(e.target.value)}
                          placeholder="URL (opcional)"
                          type="url"
                          className="bg-black/30 border-purple-500/30 text-white"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={addWishlistItem} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={() => setShowWishlistForm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border bg-black/30 border-purple-500/30 hover:bg-purple-500/10 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                          {item.description && <p className="text-gray-300 text-sm mt-1">{item.description}</p>}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-purple-500/20 text-purple-300">{item.category}</Badge>
                            {item.price && <Badge className="bg-green-500/20 text-green-300">${item.price}</Badge>}
                          </div>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 inline-block"
                            >
                              Ver enlace →
                            </a>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWishlistItem(item.id)}
                          className="text-red-300 hover:bg-red-500/20 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {wishlist.length === 0 && !showWishlistForm && (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-white text-lg">Tu lista de deseos está vacía</p>
                    <p className="text-gray-400">¡Agrega algo que desees conseguir!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsCards tasks={tasks} achievements={[]} currentUser={currentUser} translations={t} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
