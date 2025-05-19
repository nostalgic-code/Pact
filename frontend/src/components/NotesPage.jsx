import { useState, useEffect } from "react"
import { getAuth } from "firebase/auth"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { StickyNote, CheckCircle2, X } from "lucide-react"

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return

        const token = await user.getIdToken()
        const response = await fetch("https://56ff-102-39-173-168.ngrok-free.app/api/checkins/", {
          headers: { Authorization: token }
        })

        if (!response.ok) throw new Error("Failed to fetch notes")
        const data = await response.json()
        // Only include check-ins with notes
        const notesData = data.filter(checkin => checkin.note)
        setNotes(notesData)
      } catch (error) {
        console.error("Failed to fetch notes:", error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  if (loading) return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )

  if (error) return (
    <div className="p-6">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
        Failed to load notes. Please try again later.
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900/50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
          <p className="text-zinc-400 mb-6">Your reflections and insights across all pacts</p>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
              >
                All Notes
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Completed Days
              </TabsTrigger>
              <TabsTrigger 
                value="missed"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                Missed Days
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <NotesGrid notes={notes} />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <NotesGrid notes={notes.filter(note => note.did_perform_action)} />
            </TabsContent>

            <TabsContent value="missed" className="space-y-4">
              <NotesGrid notes={notes.filter(note => !note.did_perform_action)} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

function NotesGrid({ notes }) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <StickyNote className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-400 text-lg">No notes found</p>
        <p className="text-zinc-500 text-sm mt-2">Add notes when checking in to see them here</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="grid gap-4 pb-6">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl backdrop-blur-sm overflow-hidden">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-white">{note.pact.action}</CardTitle>
                    <p className="text-sm text-zinc-400">
                      {new Date(note.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    note.did_perform_action
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {note.did_perform_action ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Missed
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 text-sm text-zinc-300">
                  {note.note}
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}
