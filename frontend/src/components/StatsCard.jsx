import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Zap, Trophy, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatsCard() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    completionRate: 0,
    totalCheckins: 0,
    activePacts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      try {
        const token = await user.getIdToken()
        const res = await fetch("https://2238-102-39-173-168.ngrok-free.app/api/stats", {
          headers: { Authorization: token },
        })

        if (!res.ok) throw new Error("Failed to fetch stats")
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const items = [
    {
      title: "Current Streak",
      value: stats.currentStreak,
      description: "consecutive days",
      icon: Zap,
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: "overall success",
      icon: Target,
    },
    {
      title: "Total Check-ins",
      value: stats.totalCheckins,
      description: "completed days",
      icon: Trophy,
    },
    {
      title: "Active Pacts",
      value: stats.activePacts,
      description: "in progress",
      icon: TrendingUp,
    },
  ]

  if (loading) return <Skeleton className="w-full h-[140px]" />

  return (
    <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <item.icon className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm text-zinc-400">{item.title}</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <p className="text-xs text-zinc-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
