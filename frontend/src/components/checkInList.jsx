"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "/src/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X } from "lucide-react"
import { getAuth } from "firebase/auth" // 👈 Firebase Auth import

export default function CheckInList({ pactId }) {
  const [checkIns, setCheckIns] = useState([])

  useEffect(() => {
    async function fetchCheckIns() {
      try {
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (!currentUser) {
          console.error("User not logged in")
          return
        }

        const idToken = await currentUser.getIdToken()

        const res = await fetch(`https://e665-105-214-49-222.ngrok-free.app/api/pacts/${pactId}/checkins/`, {
          headers: {
            Authorization: idToken, // 👈 Include Firebase token
          },
        })

        if (!res.ok) throw new Error("Failed to fetch")

        const data = await res.json()
        setCheckIns(data)
      } catch (err) {
        console.error("Failed to fetch check-ins", err)
      }
    }

    if (pactId) fetchCheckIns()
  }, [pactId])

  return (
    <Card className="bg-zinc-900 border-zinc-800 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Check-In History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 pr-2">
          <ul className="space-y-4">
            {checkIns.map((checkin) => (
              <li
                key={checkin.id}
                className="flex items-start justify-between border-b border-zinc-800 pb-2"
              >
                <div>
                  <div className="text-sm text-zinc-400">{checkin.date}</div>
                  {checkin.daily_note && (
                    <div className="text-xs text-zinc-500 mt-1">
                      {checkin.daily_note}
                    </div>
                  )}
                </div>
                <Badge
                  variant={checkin.did_perform_action ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {checkin.did_perform_action ? (
                    <>
                      <Check className="w-4 h-4" /> Done
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" /> Skipped
                    </>
                  )}
                </Badge>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
