"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { getAuth } from "firebase/auth"

export default function TodaysCheckInCard({ pactId, onCheckIn }) {
  const [submitting, setSubmitting] = useState(false)

  const handleCheckIn = async (didPerform) => {
    setSubmitting(true)

    const payload = {
      pact: pactId,
      did_perform_action: didPerform,
    }

    console.log("📦 Sending payload:", payload)

    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (!currentUser) {
        toast.error("You're not logged in!")
        setSubmitting(false)
        return
      }

      const idToken = await currentUser.getIdToken()

      const response = await fetch("https://2238-102-39-173-168.ngrok-free.app/api/checkins/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log("✅ Response:", result)

      if (!response.ok) throw new Error("Check-in failed")

      toast.success("Check-in saved")
      onCheckIn?.()
    } catch (err) {
      toast.error("Something went wrong")
      console.error("❌ Error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Today's Check-In</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 justify-center">
        <Button
          variant="default"
          className="w-1/2"
          disabled={submitting}
          onClick={() => handleCheckIn(true)}
        >
          Yes
        </Button>
        <Button
          variant="destructive"
          className="w-1/2"
          disabled={submitting}
          onClick={() => handleCheckIn(false)}
        >
          No
        </Button>
      </CardContent>
    </Card>
  )
}
