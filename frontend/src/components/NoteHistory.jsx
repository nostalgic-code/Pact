import { useState, useEffect } from "react"
import { getAuth } from "firebase/auth"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X } from "lucide-react"

export default function NoteHistory({ pactId, isOpen, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !pactId) return

    const fetchHistory = async () => {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return

        const token = await user.getIdToken()
        const response = await fetch(`http://127.0.0.1:8000/api/pacts/${pactId}/checkins/`, {
          headers: { Authorization: token }
        })

        if (!response.ok) throw new Error("Failed to fetch history")
        const data = await response.json()
        setHistory(data)
      } catch (error) {
        console.error("Failed to fetch note history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [pactId, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Check-in History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {history.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    entry.did_perform_action 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  )}>
                    {entry.did_perform_action ? (
                      <>
                        <Check className="w-3 h-3" /> Completed
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Skipped
                      </>
                    )}
                  </div>
                </div>
                {entry.note && (
                  <p className="text-sm text-zinc-300 bg-zinc-800 rounded-md p-3">
                    {entry.note}
                  </p>
                )}
              </div>
            ))}
            {history.length === 0 && !loading && (
              <div className="text-center py-8 text-zinc-500">
                No check-ins recorded yet
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}