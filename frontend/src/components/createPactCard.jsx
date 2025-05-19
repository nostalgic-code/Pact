"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Clock } from "lucide-react"
import { getAuth } from "firebase/auth"
import { PactIcon } from "./todaysOverview"

export default function CreatePactCard() {
  const [action, setAction] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!action || !duration) {
      toast.error("Missing required fields", {
        description: "Please enter both an action and duration."
      })
      setLoading(false)
      return
    }

    try {
      const auth = getAuth()
      const currentUser = auth.currentUser
      if (!currentUser) {
        toast.error("You must be logged in to create a pact")
        setLoading(false)
        return
      }

      const idToken = await currentUser.getIdToken()
      const response = await fetch("https://56ff-102-39-173-168.ngrok-free.app/api/pacts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({
          action,
          duration_days: parseInt(duration),
          notes,
          start_date: new Date().toISOString().split('T')[0], // Add today's date in YYYY-MM-DD format
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to create pact.")
      }

      toast.success("Pact created successfully!", {
        description: `You're committing to ${duration} days of "${action}"`,
        action: {
          label: "View Pacts",
          onClick: () => window.location.href = "/my-pacts"
        }
      })

      setAction("")
      setDuration("")
      setNotes("")
    } catch (err) {
      toast.error("Failed to create pact", { 
        description: err.message || "Please try again in a moment"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white text-lg">Create Your Pact</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-zinc-800 rounded-md">
              <PactIcon action={action || "default"} />
            </div>
            <Input
              placeholder="Action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="pl-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="number"
              placeholder="Duration (days)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
          <Textarea
            placeholder="Note (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
          />
          <Button
            type="submit"
            className="bg-white text-black font-medium w-full rounded-xl"
            disabled={loading}
          >
            {loading ? "Starting Pact..." : "Start Pact"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
