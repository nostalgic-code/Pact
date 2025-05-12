import { useState } from "react"
import { getAuth, updateProfile, sendPasswordResetEmail, signOut } from "firebase/auth"
import useAuth from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Mail, User, Lock, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success") // or "error"

  const handleUpdate = async () => {
    try {
      await updateProfile(user, { displayName })
      setMessageType("success")
      setMessage("Display name updated successfully!")
    } catch (err) {
      setMessageType("error")
      setMessage("Failed to update profile.")
    }
  }

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(getAuth(), user.email)
      setMessageType("success")
      setMessage("Password reset email sent successfully.")
    } catch (err) {
      setMessageType("error")
      setMessage("Failed to send reset email.")
    }
  }

  const handleLogout = async () => {
    await signOut(getAuth())
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-6 bg-zinc-900/50">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-zinc-100">Account Settings</CardTitle>
              <CardDescription className="text-zinc-400">
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <Input 
                    value={user?.email} 
                    disabled 
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Display Name
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-300 focus:ring-green-500"
                    placeholder="Enter your display name"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button 
                  onClick={handleUpdate}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Update Profile
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handlePasswordReset}
                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Reset Password
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-stretch gap-4 border-t border-zinc-800 mt-6 pt-6">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${
                    messageType === "success" ? "text-green-400" : "text-red-400"
                  } text-center`}
                >
                  {message}
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
