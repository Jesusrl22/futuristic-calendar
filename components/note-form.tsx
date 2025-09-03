"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface NoteFormProps {
  onAddNote: (note: {
    title: string
    content: string
    color?: string
  }) => void
  onEditNote?: (
    noteId: string,
    updates: {
      title: string
      content: string
      color?: string
    },
  ) => void
  editingNote?: {
    id: string
    title: string
    content: string
    color?: string
  } | null
  translations: (key: string) => string
}

const NOTE_COLORS = [
  { name: "Amarillo", value: "yellow", class: "bg-yellow-200 border-yellow-300" },
  { name: "Rosa", value: "pink", class: "bg-pink-200 border-pink-300" },
  { name: "Azul", value: "blue", class: "bg-blue-200 border-blue-300" },
  { name: "Verde", value: "green", class: "bg-green-200 border-green-300" },
  { name: "Púrpura", value: "purple", class: "bg-purple-200 border-purple-300" },
  { name: "Naranja", value: "orange", class: "bg-orange-200 border-orange-300" },
]

export function NoteForm({ onAddNote, onEditNote, editingNote, translations: t }: NoteFormProps) {
  const [open, setOpen] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteColor, setNoteColor] = useState("yellow")

  useEffect(() => {
    if (editingNote) {
      setNoteTitle(editingNote.title)
      setNoteContent(editingNote.content)
      setNoteColor(editingNote.color || "yellow")
      setOpen(true)
    }
  }, [editingNote])

  const handleSubmit = () => {
    if (!noteTitle.trim()) return

    if (editingNote && onEditNote) {
      onEditNote(editingNote.id, {
        title: noteTitle,
        content: noteContent,
        color: noteColor,
      })
    } else {
      onAddNote({
        title: noteTitle,
        content: noteContent,
        color: noteColor,
      })
    }

    // Reset form
    setNoteTitle("")
    setNoteContent("")
    setNoteColor("yellow")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          {t("addNote")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{editingNote ? "Editar Nota" : t("addNote")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="noteTitle">{t("noteTitle")}</Label>
            <Input
              id="noteTitle"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder={t("noteTitle")}
            />
          </div>

          <div>
            <Label htmlFor="noteContent">{t("noteContent")}</Label>
            <Textarea
              id="noteContent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white min-h-[120px]"
              placeholder={t("noteContent")}
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setNoteColor(color.value)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    noteColor === color.value ? "border-white shadow-lg" : "border-transparent hover:border-gray-300"
                  } ${color.class}`}
                >
                  <div className="w-full h-4 rounded"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-cyan-500">
              {editingNote ? "Actualizar" : t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
