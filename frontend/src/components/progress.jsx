"use client"

import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { addDays, isSameDay, startOfWeek } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ProgressCard() {
  const [checkins, setCheckins] = useState([])

  useEffect(() => {
    async function fetchCheckIns() {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) {
          console.error("User not authenticated")
          return
        }

        const token = await user.getIdToken()
        const res = await fetch("https://3453-102-39-173-168.ngrok-free.app/api/checkins/", {
          headers: {
            Authorization: token,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch check-ins")
        const data = await res.json()
        setCheckins(data)
      } catch (err) {
        console.error("Failed to load check-ins:", err)
      }
    }

    fetchCheckIns()
  }, [])

  const today = new Date()

  // Adjust start date to the previous Sunday (beginning of the current week)
  const start = startOfWeek(today, { weekStartsOn: 0 }) // 0 means Sunday, change to 1 for Monday

  // 🌍 Force check-in dates into local timezone (Johannesburg = UTC+2)
  const toLocalDate = (dateStr) => {
    const utcDate = new Date(dateStr + "T00:00:00Z")
    const localDate = new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate()
    )
    return localDate
  }

  const days = Array.from({ length: 35 }, (_, i) => {
    const date = addDays(start, i)
    const entry = checkins.find((c) => isSameDay(toLocalDate(c.date), date))

    return {
      date,
      didPerform: entry?.did_perform_action,
    }
  })

  return (
    <Card className="rounded-md border shadow bg-zinc-900 border-zinc-800 w-full max-w-md mx-auto text-white">
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-2 text-xs text-center text-zinc-400">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="w-6 h-6 flex items-center justify-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <div
                key={i}
                title={day.date.toDateString()}
                className={`w-6 h-6 rounded-sm ${
                  day.didPerform === true
                    ? "bg-green-500"
                    : day.didPerform === false
                    ? "bg-red-500"
                    : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
