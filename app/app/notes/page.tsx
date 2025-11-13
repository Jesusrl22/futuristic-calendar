"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Trash2, Edit2 } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [noteForm, setNoteForm] = useState({ title: "", content: "" })
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubscriptionAndFetch()
  }, [])

  const checkSubscriptionAndFetch = async () => {
    const sessionResponse = await fetch("/api/auth/check-session")
    const sessionData = await sessionResponse.json()

    if (sessionData.hasSession && sessionData.userId) {
      const profileResponse = await fetch(`/api/user/profile?userId=${sessionData.userId}`)
      const profileData = await profileResponse.json()

      setSubscriptionTier(profileData.profile?.subscription_tier || "free")
      setLoading(false)

      if (profileData.profile?.subscription_tier === "premium" || profileData.profile?.subscription_tier === "pro") {
        fetchNotes()
      }
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (!response.ok) {
        console.error("Failed to fetch notes:", response.status)
        setNotes([])
        return
      }
      const data = await response.json()
      setNotes(data.notes || [])
    } catch (error) {
      console.error("Error fetching notes:", error)
      setNotes([])
    }
  }

  const handleSaveNote = async () => {
    try {
      if (editingNote) {
        await fetch("/api/notes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingNote.id,
            title: noteForm.title,
            content: noteForm.content,
          }),
        })
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: noteForm.title,
            content: noteForm.content,
          }),
        })
      }

      setNoteForm({ title: "", content: "" })
      setEditingNote(null)
      setIsDialogOpen(false)
      fetchNotes()
    } catch (error) {
      console.error("Error saving note:", error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
      })
      fetchNotes()
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (subscriptionTier !== "premium" && subscriptionTier !== "pro") {
    return <UpgradeModal feature="Notes" requiredPlan="premium" />
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-primary neon-text">Notes</span>
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="neon-glow-hover"
              onClick={() => {
                setEditingNote(null)
                setNoteForm({ title: "", content: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                className="bg-secondary/50"
              />
              <Textarea
                placeholder="Note content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                className="bg-secondary/50 min-h-[200px]"
              />
              <Button onClick={handleSaveNote} className="w-full neon-glow-hover">
                {editingNote ? "Update Note" : "Create Note"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card p-6 neon-glow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id}>
            <Card className="glass-card p-6 neon-glow-hover transition-all duration-300 h-full flex flex-col">
              <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 line-clamp-4">{note.content}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">{new Date(note.updated_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingNote(note)
                      setNoteForm({ title: note.title, content: note.content })
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No notes found</p>
        </Card>
      )}
    </div>
  )
}
