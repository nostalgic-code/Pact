"use client"

import { useState } from "react"
import { getAuth } from "firebase/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function NotesCard() {
  const [note, setNote] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        toast.error("You must be logged in")
        return
      }

      const token = await user.getIdToken()

      const res = await fetch("https://2238-102-39-173-168.ngrok-free.app/api/checkins/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ note }),
      })

      if (!res.ok) throw new Error("Failed to save note")

      toast.success("Note saved successfully")
      setNote("")
    } catch (error) {
      toast.error("There was a problem saving your note")
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reflection on today’s progress…"
            className="text-sm text-white"
          />
          <Button type="submit" className= {"bg-white text-black"}>
            Save Note
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
