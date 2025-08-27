"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  LayoutTemplate,
  Timer,
  Edit,
  Trash2,
  Copy,
  Star,
  Briefcase,
  Home,
  Heart,
  BookOpen,
  DollarSign,
  Users,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { TASK_TEMPLATES, PRIORITY_COLORS } from "@/constants"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: Date
  completed: boolean
  createdAt: Date
  completedAt?: Date
  estimatedTime?: number
  tags?: string[]
}

interface TaskTemplate {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  category: string
  estimatedTime?: number
  tags?: string[]
  isCustom?: boolean
}

interface TaskTemplatesProps {
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void
}

export default function TaskTemplates({ onCreateTask }: TaskTemplatesProps) {
  const { toast } = useToast()
  const [customTemplates, setCustomTemplates] = useLocalStorage<TaskTemplate[]>("customTemplates", [])
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [newTemplate, setNewTemplate] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    category: "work",
    estimatedTime: 30,
    tags: "",
  })

  const categories = [
    { id: "work", name: "Trabajo", icon: Briefcase },
    { id: "personal", name: "Personal", icon: Home },
    { id: "health", name: "Salud", icon: Heart },
    { id: "learning", name: "Aprendizaje", icon: BookOpen },
    { id: "finance", name: "Finanzas", icon: DollarSign },
    { id: "social", name: "Social", icon: Users },
  ]

  const systemTemplates = TASK_TEMPLATES.SYSTEM
  const allTemplates = [...systemTemplates, ...customTemplates]

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || template.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateTemplate = () => {
    const template: TaskTemplate = {
      id: Date.now().toString(),
      title: newTemplate.title,
      description: newTemplate.description,
      priority: newTemplate.priority,
      category: newTemplate.category,
      estimatedTime: newTemplate.estimatedTime,
      tags: newTemplate.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isCustom: true,
    }

    setCustomTemplates([...customTemplates, template])
    setNewTemplate({
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      estimatedTime: 30,
      tags: "",
    })
    setShowCreateTemplate(false)

    toast({
      title: "Plantilla creada",
      description: `"${template.title}" ha sido añadida a tus plantillas`,
    })
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return

    const updatedTemplate: TaskTemplate = {
      ...editingTemplate,
      title: newTemplate.title,
      description: newTemplate.description,
      priority: newTemplate.priority,
      category: newTemplate.category,
      estimatedTime: newTemplate.estimatedTime,
      tags: newTemplate.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    setCustomTemplates(customTemplates.map((t) => (t.id === editingTemplate.id ? updatedTemplate : t)))
    setEditingTemplate(null)
    setNewTemplate({
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      estimatedTime: 30,
      tags: "",
    })
    setShowCreateTemplate(false)

    toast({
      title: "Plantilla actualizada",
      description: "Los cambios han sido guardados exitosamente",
    })
  }

  const handleEditTemplate = (template: TaskTemplate) => {
    setEditingTemplate(template)
    setNewTemplate({
      title: template.title,
      description: template.description || "",
      priority: template.priority,
      category: template.category,
      estimatedTime: template.estimatedTime || 30,
      tags: template.tags?.join(", ") || "",
    })
    setShowCreateTemplate(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    const template = customTemplates.find((t) => t.id === templateId)
    setCustomTemplates(customTemplates.filter((t) => t.id !== templateId))

    if (template) {
      toast({
        title: "Plantilla eliminada",
        description: `"${template.title}" ha sido eliminada`,
      })
    }
  }

  const handleUseTemplate = (template: TaskTemplate) => {
    onCreateTask({
      title: template.title,
      description: template.description,
      priority: template.priority,
      category: template.category,
      estimatedTime: template.estimatedTime,
      tags: template.tags,
    })

    toast({
      title: "Tarea creada desde plantilla",
      description: `"${template.title}" ha sido añadida a tu lista de tareas`,
    })
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.icon || Briefcase
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plantillas de Tareas</h2>
          <p className="text-gray-600">Crea tareas rápidamente usando plantillas predefinidas</p>
        </div>
        <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "Editar Plantilla" : "Nueva Plantilla"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <Input
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Título de la plantilla"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción opcional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Prioridad</Label>
                  <Select
                    value={newTemplate.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setNewTemplate((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) => setNewTemplate((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <category.icon className="h-4 w-4 mr-2" />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Tiempo estimado (minutos)</Label>
                <Input
                  type="number"
                  value={newTemplate.estimatedTime}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({ ...prev, estimatedTime: Number.parseInt(e.target.value) || 30 }))
                  }
                  min="5"
                  max="480"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Etiquetas (separadas por comas)</Label>
                <Input
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="trabajo, urgente, proyecto"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateTemplate(false)
                    setEditingTemplate(null)
                    setNewTemplate({
                      title: "",
                      description: "",
                      priority: "medium",
                      category: "work",
                      estimatedTime: 30,
                      tags: "",
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                  disabled={!newTemplate.title.trim()}
                >
                  {editingTemplate ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar plantillas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredTemplates.length})</TabsTrigger>
          <TabsTrigger value="system">
            Sistema ({systemTemplates.filter((t) => filterCategory === "all" || t.category === filterCategory).length})
          </TabsTrigger>
          <TabsTrigger value="custom">
            Personalizadas (
            {customTemplates.filter((t) => filterCategory === "all" || t.category === filterCategory).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <LayoutTemplate className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas</h3>
                <p className="text-gray-600 mb-4">
                  {allTemplates.length === 0
                    ? "Crea tu primera plantilla para comenzar"
                    : "No se encontraron plantillas con los filtros actuales"}
                </p>
                {allTemplates.length === 0 && (
                  <Button onClick={() => setShowCreateTemplate(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Plantilla
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category)
                const category = categories.find((c) => c.id === template.category)
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-5 w-5 text-gray-600" />
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!template.isCustom && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Sistema
                            </Badge>
                          )}
                          {template.isCustom && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditTemplate(template)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {template.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Badge className={PRIORITY_COLORS[template.priority]}>
                          {template.priority === "high" ? "Alta" : template.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                        <Badge variant="outline">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {category?.name}
                        </Badge>
                        {template.estimatedTime && (
                          <Badge variant="secondary">
                            <Timer className="h-3 w-3 mr-1" />
                            {template.estimatedTime}m
                          </Badge>
                        )}
                      </div>

                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button
                        onClick={() => handleUseTemplate(template)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Usar Plantilla
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemTemplates
              .filter((template) => filterCategory === "all" || template.category === filterCategory)
              .filter(
                (template) =>
                  template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  template.description?.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((template) => {
                const CategoryIcon = getCategoryIcon(template.category)
                const category = categories.find((c) => c.id === template.category)
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-5 w-5 text-gray-600" />
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Sistema
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {template.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Badge className={PRIORITY_COLORS[template.priority]}>
                          {template.priority === "high" ? "Alta" : template.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                        <Badge variant="outline">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {category?.name}
                        </Badge>
                        {template.estimatedTime && (
                          <Badge variant="secondary">
                            <Timer className="h-3 w-3 mr-1" />
                            {template.estimatedTime}m
                          </Badge>
                        )}
                      </div>

                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button
                        onClick={() => handleUseTemplate(template)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Usar Plantilla
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {customTemplates.filter((template) => filterCategory === "all" || template.category === filterCategory)
            .length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <LayoutTemplate className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas personalizadas</h3>
                <p className="text-gray-600 mb-4">Crea plantillas personalizadas para tus tareas más frecuentes</p>
                <Button onClick={() => setShowCreateTemplate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Plantilla
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates
                .filter((template) => filterCategory === "all" || template.category === filterCategory)
                .filter(
                  (template) =>
                    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    template.description?.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((template) => {
                  const CategoryIcon = getCategoryIcon(template.category)
                  const category = categories.find((c) => c.id === template.category)
                  return (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-5 w-5 text-gray-600" />
                            <CardTitle className="text-lg">{template.title}</CardTitle>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTemplate(template)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {template.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Badge className={PRIORITY_COLORS[template.priority]}>
                            {template.priority === "high" ? "Alta" : template.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                          <Badge variant="outline">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {category?.name}
                          </Badge>
                          {template.estimatedTime && (
                            <Badge variant="secondary">
                              <Timer className="h-3 w-3 mr-1" />
                              {template.estimatedTime}m
                            </Badge>
                          )}
                        </div>

                        {template.tags && template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {template.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <Button
                          onClick={() => handleUseTemplate(template)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Usar Plantilla
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
