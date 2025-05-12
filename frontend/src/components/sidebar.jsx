"use client"

import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Home, List, ClipboardCheck, Settings, StickyNote, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: List, label: "My Pacts", path: "/my-pacts" },
    { icon: StickyNote, label: "Notes", path: "/notes" },
    { icon: ClipboardCheck, label: "Check-In", path: "/checkins" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:relative md:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Pact</h2>

            {user && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {user.displayName || user.email}
                  </span>
                  <span className="text-xs text-zinc-400">Signed in</span>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-left"
                  onClick={() => {
                    navigate(item.path)
                    setIsOpen(false)
                  }}
                >
                  <item.icon className="w-5 h-5" /> {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
