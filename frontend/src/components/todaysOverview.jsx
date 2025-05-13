"use client"

import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import {
  BadgeCheck,
  Pause,
  CheckCircle2,
  Move,
  Leaf,
  PlayCircle,
  BookOpen,
  Dumbbell,
  User,
  Brain,
  Code,
  Pencil,
  Music,
  Heart,
  Utensils,
  Coffee,
  Bed,
  Smartphone,
  Languages,
  Brush,
  Camera,
} from "lucide-react"

// Icon categories mapping
export const iconCategories = {
  exercise: {
    keywords: ["run", "jog", "workout", "exercise", "gym", "fitness", "sport", "train"],
    icon: Move,
  },
  mindfulness: {
    keywords: ["mindful", "zen", "relax", "calm", "peace", "meditate", "meditation", "breathe"],
    icon: Leaf,
  },
  learning: {
    keywords: ["study", "learn", "read", "book", "course", "class", "education"],
    icon: BookOpen,
  },
  creativity: {
    keywords: ["write", "draw", "paint", "art", "create", "design", "sketch"],
    icon: Brush,
  },
  health: {
    keywords: ["sleep", "diet", "eat", "nutrition", "healthy", "water", "hydrate"],
    icon: Heart,
  },
  technology: {
    keywords: ["code", "program", "develop", "app", "software", "web"],
    icon: Code,
  },
  productivity: {
    keywords: ["work", "focus", "plan", "organize", "schedule", "task"],
    icon: Brain,
  },
  lifestyle: {
    keywords: ["habit", "routine", "practice", "daily", "lifestyle"],
    icon: Coffee,
  },
  social: {
    keywords: ["connect", "call", "message", "friend", "family", "social"],
    icon: Smartphone,
  },
  arts: {
    keywords: ["music", "play", "instrument", "sing", "dance", "perform"],
    icon: Music,
  },
}

export default function TodaysOverview() {
  const [pacts, setPacts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError(new Error("Not authenticated"))
        setLoading(false)
        return
      }

      try {
        const token = await user.getIdToken()
        const res = await fetch("https://e665-105-214-49-222.ngrok-free.app/api/pacts", {
          headers: { Authorization: token },
        })

        if (!res.ok) throw new Error("Failed to fetch pacts")
        const json = await res.json()
        setPacts(json.filter((pact) => pact.is_active))
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <Skeleton className="w-full h-32" />
  if (error && !pacts) return <div className="text-red-500">Error loading overview.</div>
  if (!pacts || pacts.length === 0) return <div className="text-zinc-400">No active pacts for today.</div>

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-white">Today's Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
        {pacts.map((pact) => (
          <Card
            key={pact.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg hover:border-zinc-700 relative"
          >
            <div className="absolute top-3 right-3">
              <StatusBadge pact={pact} />
            </div>
            <CardHeader className="pb-1">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800/50 p-2 rounded-lg">
                  <PactIcon action={pact.action} />
                </div>
                <div>
                  <CardTitle className="text-white text-base font-medium capitalize">
                    {pact.action}
                  </CardTitle>
                  <p className="text-zinc-400 text-sm">
                    Day {Math.min((pact.current_day ?? 0) + 1, pact.duration_days)} of {pact.duration_days}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function PactIcon({ action }) {
  const lower = action.toLowerCase()
  
  // Find matching category
  const matchingCategory = Object.values(iconCategories).find(category =>
    category.keywords.some(keyword => lower.includes(keyword))
  )
  
  if (matchingCategory) {
    const Icon = matchingCategory.icon
    return <Icon size={20} className="text-green-400" />
  }

  // Fallback to default icon
  return <User size={20} className="text-green-400" />
}

function StatusBadge({ pact }) {
  // Show paused state first
  if (pact.is_paused) {
    return (
      <span className="bg-yellow-800 text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Pause size={14} /> Paused
      </span>
    )
  }

  if (pact.is_completed) {
    return (
      <span className="bg-green-800 text-green-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <CheckCircle2 size={14} /> Completed
      </span>
    )
  }

  return (
    <span className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
      <BadgeCheck size={14} /> Active
    </span>
  )
}
