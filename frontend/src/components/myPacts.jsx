"use client"

import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock, MoreVertical, Edit2, Trash2, Play, Pause, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import NoteHistory from "./NoteHistory"

export default function MyPactsPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [editingPact, setEditingPact] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editedAction, setEditedAction] = useState("")
  const [editedDuration, setEditedDuration] = useState("")
  const [selectedPactId, setSelectedPactId] = useState(null)
  const [showNoteHistory, setShowNoteHistory] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [pauseReason, setPauseReason] = useState("")

  const fetchPacts = async (token) => {
    try {
      setIsLoading(true)
      const res = await fetch("https://3453-102-39-173-168.ngrok-free.app/api/pacts", {
        headers: { Authorization: token },
      })
      if (!res.ok) throw new Error("Failed to fetch pacts")
      const json = await res.json()
      console.log('MyPacts - All pacts:', json) // Debug log
      setData(json)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError(new Error("User not authenticated"))
        setIsLoading(false)
        return
      }
      const token = await user.getIdToken()
      setUserToken(token)
      fetchPacts(token)
    })

    return () => unsubscribe()
  }, [])

  const handleCheckInComplete = () => {
    if (userToken) {
      fetchPacts(userToken)
    }
  }

  const handleEdit = (pact) => {
    setEditingPact(pact)
    setEditedAction(pact.action)
    setEditedDuration(pact.duration_days.toString())
  }

  const handleDelete = async (pactId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pacts/${pactId}/`, {
        method: "DELETE",
        headers: {
          Authorization: userToken,
        },
      })

      if (!response.ok) throw new Error("Failed to delete pact")
      
      toast.success("Pact deleted successfully")
      fetchPacts(userToken)
      setShowDeleteDialog(false)
    } catch (error) {
      toast.error("Failed to delete pact")
      console.error("Delete error:", error)
    }
  }

  const handleUpdatePact = async () => {
    try {
      const response = await fetch(`https://3453-102-39-173-168.ngrok-free.app/api/pacts/${editingPact.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: userToken,
        },
        body: JSON.stringify({
          action: editedAction,
          duration_days: parseInt(editedDuration),
        }),
      })

      if (!response.ok) throw new Error("Failed to update pact")
      
      toast.success("Pact updated successfully")
      fetchPacts(userToken)
      setEditingPact(null)
    } catch (error) {
      toast.error("Failed to update pact")
      console.error("Update error:", error)
    }
  }

  const handleNoteChange = (pactId, note) => {
    setData(prevData => 
      prevData.map(pact => 
        pact.id === pactId ? { ...pact, todayNote: note } : pact
      )
    )
  }

  const viewNoteHistory = (pactId) => {
    setSelectedPactId(pactId)
    setShowNoteHistory(true)
  }

  const handlePauseToggle = async (pact) => {
    try {
      const response = await fetch(`https://3453-102-39-173-168.ngrok-free.app/api/pacts/${pact.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: userToken,
        },
        body: JSON.stringify({
          is_paused: !pact.is_paused
        }),
      })

      if (!response.ok) throw new Error("Failed to update pact status")
      
      // Create status history entry
      const statusResponse = await fetch("https://3453-102-39-173-168.ngrok-free.app/api/status-history/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userToken,
        },
        body: JSON.stringify({
          pact: pact.id,
          status: pact.is_paused ? 'continue' : 'pause',
          reason: pauseReason || (pact.is_paused ? 'Resumed pact' : 'Paused pact')
        }),
      })

      if (!statusResponse.ok) throw new Error("Failed to record status change")
      
      toast.success(pact.is_paused ? "Pact resumed" : "Pact paused")
      fetchPacts(userToken)
      setShowPauseDialog(false)
      setPauseReason("")
    } catch (error) {
      toast.error("Failed to update pact status")
      console.error("Status update error:", error)
    }
  }

  if (isLoading) return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="h-12 w-full mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
  
  if (error && !data) return (
    <div className="p-6">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
        Failed to load pacts. Please try again later.
      </div>
    </div>
  )

  // Separate active and completed pacts
  const activePacts = data?.filter(pact => pact.is_active)
  const completedPacts = data?.filter(pact => pact.is_completed)

  return (
    <div className="min-h-screen bg-zinc-900/50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Pacts</h1>
          <p className="text-zinc-400 mb-6">Track and manage your daily commitments</p>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                value="active"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activePacts?.length > 0 ? (
                <div className="grid gap-4">
                  {activePacts.map((pact, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={pact.id}
                    >
                      <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl backdrop-blur-sm overflow-hidden group hover:border-green-500/50 transition-all duration-300">
                        <div className="p-6 space-y-4">
                          {/* Header Section */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-xl text-white font-semibold group-hover:text-green-400 transition-colors">
                                {pact.action}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-zinc-400">
                                <Clock className="w-4 h-4" />
                                <p className="text-sm">
                                  Day {Math.min((pact.current_day ?? 0) + 1, pact.duration_days)} of {pact.duration_days}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs rounded-full px-3 py-1 font-medium flex items-center gap-1",
                                pact.is_paused
                                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  : "bg-green-500/10 text-green-400 border border-green-500/20"
                              )}>
                                {pact.is_paused ? (
                                  <>
                                    <Pause className="w-3 h-3" /> Paused
                                  </>
                                ) : (
                                  <>
                                    <BadgeCheck className="w-3 h-3" /> Active
                                  </>
                                )}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32 bg-zinc-900 border-zinc-800">
                                  <DropdownMenuItem 
                                    className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                                    onClick={() => handleEdit(pact)}
                                  >
                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                                    onClick={() => {
                                      setShowPauseDialog(pact.id)
                                      setPauseReason("")
                                    }}
                                  >
                                    {pact.is_paused ? (
                                      <>
                                        <Play className="mr-2 h-4 w-4" /> Resume
                                      </>
                                    ) : (
                                      <>
                                        <Pause className="mr-2 h-4 w-4" /> Pause
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-400 focus:text-red-400 focus:bg-zinc-800"
                                    onClick={() => setShowDeleteDialog(pact.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <CardContent className="p-0 space-y-4">
                            {/* Check-in Section */}
                            <div className="space-y-3">
                              <p className="text-white font-medium">Did you complete this today?</p>
                              <div className="flex gap-3">
                                <CheckInButton 
                                  pactId={pact.id} 
                                  choice="yes" 
                                  note={pact.todayNote}
                                  onCheckIn={handleCheckInComplete} 
                                />
                                <CheckInButton 
                                  pactId={pact.id} 
                                  choice="no" 
                                  note={pact.todayNote}
                                  onCheckIn={handleCheckInComplete} 
                                />
                              </div>
                            </div>

                            {/* Notes Section */}
                            <div className="space-y-3 pt-4 border-t border-zinc-800">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-white">Notes & Reflections</h3>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2 text-xs text-zinc-400 hover:text-white"
                                  onClick={() => viewNoteHistory(pact.id)}
                                >
                                  View History
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Add a note about your progress today..."
                                className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 min-h-[80px] text-sm"
                                value={pact.todayNote || ''}
                                onChange={(e) => handleNoteChange(pact.id, e.target.value)}
                              />
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Circle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">You have no active pacts</p>
                  <p className="text-zinc-500 text-sm mt-2">Create a new pact to get started</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedPacts?.length > 0 ? (
                <div className="grid gap-4">
                  {completedPacts.map((pact, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={pact.id}
                    >
                      <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl backdrop-blur-sm overflow-hidden">
                        <div className="p-6 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-xl text-white font-semibold">
                                {pact.action}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-zinc-400">
                                <CheckCircle className="w-4 h-4" />
                                <p className="text-sm">
                                  {pact.completed_at
                                    ? new Date(pact.completed_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })
                                    : "Completed date not available"}
                                </p>
                              </div>
                            </div>
                            <span className="bg-zinc-800/50 text-zinc-400 text-xs rounded-full px-3 py-1 font-medium border border-zinc-700/50">
                              Completed
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">No completed pacts yet</p>
                  <p className="text-zinc-500 text-sm mt-2">Complete your active pacts to see them here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingPact !== null} onOpenChange={() => setEditingPact(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Edit Pact</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Make changes to your pact details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="action" className="text-white">Action</Label>
              <Input
                id="action"
                value={editedAction}
                onChange={(e) => setEditedAction(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={editedDuration}
                onChange={(e) => setEditedDuration(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPact(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button onClick={handleUpdatePact} className="bg-green-600 text-white hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog !== false} onOpenChange={() => setShowDeleteDialog(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Delete Pact</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this pact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(showDeleteDialog)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note History Dialog */}
      <NoteHistory
        pactId={selectedPactId}
        isOpen={showNoteHistory}
        onClose={() => {
          setShowNoteHistory(false)
          setSelectedPactId(null)
        }}
      />

      {/* Pause Dialog */}
      <Dialog open={showPauseDialog !== false} onOpenChange={() => setShowPauseDialog(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {data?.find(p => p.id === showPauseDialog)?.is_paused ? 'Resume Pact' : 'Pause Pact'}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {data?.find(p => p.id === showPauseDialog)?.is_paused 
                ? 'Ready to continue with your pact?' 
                : 'Add a reason for pausing (optional)'}
            </DialogDescription>
          </DialogHeader>
          {!data?.find(p => p.id === showPauseDialog)?.is_paused && (
            <div className="py-4">
              <Textarea
                placeholder="Why are you pausing this pact?"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500"
              />
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPauseDialog(false)} 
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handlePauseToggle(data?.find(p => p.id === showPauseDialog))}
              className={data?.find(p => p.id === showPauseDialog)?.is_paused 
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
              }
            >
              {data?.find(p => p.id === showPauseDialog)?.is_paused ? 'Resume' : 'Pause'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CheckInButton({ pactId, choice, note, onCheckIn }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) throw new Error("Not logged in")
      const token = await user.getIdToken()

      await fetch("https://3453-102-39-173-168.ngrok-free.app/api/checkins/", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pact: pactId,
          did_perform_action: choice === "yes",
          note: note // Include the note in the check-in
        }),
      })

      setDone(true)
      toast.success(
        choice === "yes" ? "Great job completing your pact today!" : "Thanks for being honest. There's always tomorrow!", 
        {
          description: choice === "yes" 
            ? "Keep up the momentum!" 
            : "Remember: progress isn't about perfection, it's about consistency.",
        }
      )
      onCheckIn() // Trigger pact data re-fetch
    } catch (err) {
      toast.error("Failed to save your check-in", {
        description: "Please try again in a moment."
      })
      console.error("Check-in failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={loading || done}
      className={cn(
        "flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200",
        choice === "yes" 
          ? done 
            ? "bg-green-500 text-white border-none"
            : "border border-green-500/30 text-green-400 hover:bg-green-500/10" 
          : done
            ? "bg-red-500 text-white border-none"
            : "border border-red-500/30 text-red-400 hover:bg-red-500/10",
        loading && "opacity-50 cursor-not-allowed",
        done && "cursor-not-allowed"
      )}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
      ) : (
        choice === "yes" ? "Yes" : "No"
      )}
    </motion.button>
  )
}
