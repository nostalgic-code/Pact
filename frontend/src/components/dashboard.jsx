// app/dashboard/page.jsx or pages/dashboard.jsx (depending on your setup)

import Sidebar from "../components/sidebar"
import CreatePactCard from "../components/createPactCard"
import TodaysCheckInCard from "../components/checkIn"
import ProgressCard from "../components/progress"
import StatsCard from "../components/StatsCard"
import TodaysOverview from "../components/todaysOverview"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-zinc-950">
        {/* Responsive grid container */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column: Pact creation + check-in */}
          <div className="space-y-4 md:space-y-6">
            <CreatePactCard />
            <TodaysOverview />
          </div>

          {/* Right Column: Progress + stats */}
          <div className="space-y-4 md:space-y-6">
            <StatsCard />
            <ProgressCard />
          </div>
        </div>
      </main>
    </div>
  )
}
