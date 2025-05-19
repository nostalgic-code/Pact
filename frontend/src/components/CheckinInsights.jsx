"use client"

import React, { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { subDays, format, parseISO, startOfWeek, eachWeekOfInterval } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts"
import HeatMap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue, animate } from "framer-motion"
import { cn } from "@/lib/utils"
import { Dialog } from "@/components/ui/dialog"
import { CalendarDays, Flame, Trophy, Target, Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const zoom = {
  enabled: true,
  zoomBoxClassName: "bg-green-500/10 border border-green-500/20",
  zoomBoxStyle: {
    background: "transparent",
    border: "1px dashed #22c55e",
  }
}

function AnimatedTooltip({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="relative z-50"
    >
      {children}
    </motion.div>
  )
}

function CustomTooltip({ date, count }) {
  if (!date) return null
  
  return (
    <AnimatedTooltip>
      <div className="bg-zinc-900/95 border border-zinc-800 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-zinc-300 text-sm font-medium">
          {format(new Date(date), 'MMMM d, yyyy')}
        </p>
        <p className="text-zinc-400 text-xs mt-1">
          {count ? 'Completed' : 'Not completed'}
        </p>
      </div>
    </AnimatedTooltip>
  )
}

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1,
      ease: "easeOut"
    });

    return animation.stop;
  }, [value]);

  return <motion.span>{roundedCount}</motion.span>;
}

function TimeRangeSelector({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 bg-zinc-900 border-zinc-800 text-zinc-300">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800">
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
        <SelectItem value="180">Last 6 months</SelectItem>
        <SelectItem value="365">Last year</SelectItem>
      </SelectContent>
    </Select>
  )
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-zinc-950 to-zinc-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-zinc-950 to-zinc-950"></div>
    </div>
  )
}

export default function InsightsDashboard() {
  const [checkins, setCheckins] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 })
  const [goalPercent, setGoalPercent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("90")
  const [zooming, setZooming] = useState(false)
  const [zoomBox, setZoomBox] = useState({ start: '', end: '' })
  const [activeTab, setActiveTab] = useState("all")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetchCheckIns()
  }, [timeRange]) // Refetch when timeRange changes

  async function fetchCheckIns() {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return
    const token = await user.getIdToken()

    // Calculate date range
    const endDate = new Date()
    const startDate = subDays(endDate, parseInt(timeRange))

    const res = await fetch(`https://54e5-102-39-173-168.ngrok-free.app/api/checkins/?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`, {
      headers: { Authorization: token },
    })
    const data = await res.json()

    // Safeguard: Ensure valid checkins data before setting state
    const validCheckins = data.filter(c => c.date && c.did_perform_action !== undefined)
    setCheckins(validCheckins)
    setLoading(false)
  }

  useEffect(() => {
    if (checkins.length === 0) return

    // Normalize dates
    const localDates = checkins.map((c) => ({
      ...c,
      date: parseISO(c.date),
    }))

    // Weekly stats (line graph)
    const start = subDays(new Date(), 90)
    const end = new Date()
    const weeks = eachWeekOfInterval({ start, end })
    const weekly = weeks.map((weekStart) => {
      const weekEnd = subDays(new Date(weekStart.getTime() + 7 * 86400000), 1)
      const count = localDates.filter(
        (d) => d.did_perform_action && d.date >= weekStart && d.date <= weekEnd
      ).length
      return {
        week: format(weekStart, "MMM d"),
        count,
      }
    })
    setWeeklyData(weekly)

    // Streaks
    let currStreak = 0,
      longestStreak = 0
    let lastDate = null
    const sorted = localDates.sort((a, b) => a.date - b.date)
    sorted.forEach((c) => {
      if (c.did_perform_action) {
        if (
          lastDate &&
          (c.date - lastDate) / (1000 * 60 * 60 * 24) === 1
        ) {
          currStreak++
        } else {
          currStreak = 1
        }
        longestStreak = Math.max(longestStreak, currStreak)
        lastDate = c.date
      } else {
        currStreak = 0
        lastDate = null
      }
    })
    setStreaks({ current: currStreak, longest: longestStreak })

    // Goal % (assume 5 check-ins/week goal)
    const recentWeek = weekly[weekly.length - 1]
    const percent = Math.round((recentWeek.count / 5) * 100)
    setGoalPercent(percent > 100 ? 100 : percent)
  }, [checkins])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleZoom = (start, end) => {
    if (!start || !end || isMobile) return
    setTimeRange(Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)).toString())
    setZooming(false)
    setZoomBox({ start: '', end: '' })
  }

  const handleMouseDown = (e) => {
    if (!zooming || !e?.activeLabel) return
    setZoomBox({ start: e.activeLabel, end: '' })
  }

  const handleMouseMove = (e) => {
    if (!zooming || !zoomBox.start || !e?.activeLabel) return
    setZoomBox(prev => ({ ...prev, end: e.activeLabel }))
  }

  const handleMouseUp = () => {
    if (!zooming || !zoomBox.start || !zoomBox.end) return
    handleZoom(zoomBox.start, zoomBox.end)
  }

  const filterData = (data) => {
    switch (activeTab) {
      case "successful":
        return data.filter(item => item.count >= 5) // 5+ check-ins per week
      case "improving":
        return data.filter(item => item.count >= 3 && item.count < 5)
      case "struggling":
        return data.filter(item => item.count < 3)
      default:
        return data
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center pt-20"
          >
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            <p className="text-zinc-400 mt-4">Loading your insights...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-zinc-950/50 p-4 md:p-8">
      <AnimatedBackground />
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white">Insights</h1>
            <p className="text-sm md:text-base text-zinc-400">Track your progress and visualize your growth</p>
          </motion.div>
          <div className="flex items-center gap-3">
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            {!isMobile && (
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "border-zinc-800 text-zinc-400 hover:text-white",
                  zooming && "bg-green-500/10 text-green-400 border-green-500/20"
                )}
                onClick={() => setZooming(!zooming)}
              >
                {zooming ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {/* Stats Overview */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-green-500/20 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <p className="text-zinc-400 text-sm">Current Streak</p>
                      <motion.div
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AnimatedNumber value={streaks.current} />
                      </motion.div>
                      <p className="text-zinc-500 text-xs">consecutive days</p>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-xl">
                      <Flame className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-blue-500/20 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <p className="text-zinc-400 text-sm">Longest Streak</p>
                      <motion.div
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AnimatedNumber value={streaks.longest} />
                      </motion.div>
                      <p className="text-zinc-500 text-xs">days achieved</p>
                    </div>
                    <div className="bg-blue-500/10 p-2 rounded-xl">
                      <Trophy className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-purple-500/20 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <p className="text-zinc-400 text-sm">Weekly Goal</p>
                      <motion.div
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AnimatedNumber value={goalPercent} />
                      </motion.div>
                      <p className="text-zinc-500 text-xs">completion rate</p>
                    </div>
                    <div className="bg-purple-500/10 p-2 rounded-xl">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-orange-500/20 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <p className="text-zinc-400 text-sm">Total Check-ins</p>
                      <motion.div
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AnimatedNumber value={checkins.filter(c => c.did_perform_action).length} />
                      </motion.div>
                      <p className="text-zinc-500 text-xs">completed days</p>
                    </div>
                    <div className="bg-orange-500/10 p-2 rounded-xl">
                      <CalendarDays className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all duration-200">
              <CardHeader className="border-b border-zinc-800/50">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-lg font-medium text-white">Weekly Progress</CardTitle>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-4 h-8 w-full md:w-auto bg-zinc-800/50 border border-zinc-700/50">
                      <TabsTrigger value="all" className="text-xs h-7">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="successful" className="text-xs h-7">
                        Successful
                      </TabsTrigger>
                      <TabsTrigger value="improving" className="text-xs h-7">
                        Improving
                      </TabsTrigger>
                      <TabsTrigger value="struggling" className="text-xs h-7">
                        Struggling
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                      data={filterData(weeklyData)} 
                      margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                    >
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="week" 
                        stroke="#525252" 
                        tick={{ fill: '#a3a3a3' }}
                        tickLine={{ stroke: '#525252' }}
                        axisLine={{ stroke: '#525252' }}
                      />
                      <YAxis 
                        stroke="#525252" 
                        tick={{ fill: '#a3a3a3' }}
                        tickLine={{ stroke: '#525252' }}
                        axisLine={{ stroke: '#525252' }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ stroke: '#525252', strokeWidth: 1 }}
                        content={<CustomChartTooltip />}
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #3f3f46',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                        labelStyle={{ color: '#e4e4e7', marginBottom: '4px' }}
                        itemStyle={{ color: '#4ade80' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ 
                          r: 6, 
                          fill: '#4ade80',
                          stroke: '#22c55e',
                          strokeWidth: 2,
                        }}
                        fill="url(#colorCount)"
                      />
                      {zooming && (
                        <ReferenceArea
                          x1={zoomBox.start}
                          x2={zoomBox.end}
                          strokeOpacity={0.2}
                          fill="#22c55e"
                          fillOpacity={0.1}
                          ifOver={true}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                  {zooming && (
                    <p className="text-xs text-zinc-500 mt-4 text-center">
                      Click and drag on the chart to zoom into a specific time period
                    </p>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
              <CardHeader className="border-b border-zinc-800/50">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-lg font-medium text-white">Activity Map</CardTitle>
                  <div className="grid grid-cols-3 md:flex items-center gap-2 md:gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#27272a]"></div>
                      <span className="text-zinc-400">None</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#22c55e33]"></div>
                      <span className="text-zinc-400">1 day</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#22c55e66]"></div>
                      <span className="text-zinc-400">2-3 days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#22c55e99]"></div>
                      <span className="text-zinc-400">4-7 days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#22c55e]"></div>
                      <span className="text-zinc-400">7+ days</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 overflow-x-auto">
                <style>{`
                  .react-calendar-heatmap text {
                    fill: #a3a3a3;
                    font-size: 0.75rem;
                  }
                  .react-calendar-heatmap .color-empty {
                    fill: #27272a;
                  }
                  .react-calendar-heatmap .color-scale-1 {
                    fill: #22c55e33;
                  }
                  .react-calendar-heatmap .color-scale-2 {
                    fill: #22c55e66;
                  }
                  .react-calendar-heatmap .color-scale-3 {
                    fill: #22c55e99;
                  }
                  .react-calendar-heatmap .color-scale-4 {
                    fill: #22c55e;
                  }
                  .react-calendar-heatmap-week > rect {
                    rx: 2;
                  }
                `}</style>
                <HeatMap
                  startDate={subDays(new Date(), 90)}
                  endDate={new Date()}
                  values={checkins.map((c) => ({
                    date: c.date,
                    count: c.did_perform_action ? getIntensity(c.date, checkins) : 0,
                  }))}
                  classForValue={(val) => {
                    if (!val || val.count === undefined) return "color-empty"
                    if (val.count === 0) return "color-empty"
                    return `color-scale-${val.count}`
                  }}
                  showWeekdayLabels
                  gutterSize={4}
                  tooltipDataAttrs={value => ({
                    'data-tip': JSON.stringify({
                      date: value?.date,
                      count: value?.count > 0
                    })
                  })}
                  renderTooltip={({ event }) => {
                    const data = event.target.getAttribute('data-tip')
                    if (!data) return null
                    const { date, count } = JSON.parse(data)
                    return <CustomTooltip date={date} count={count} />
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Legend */}
        <div className="md:hidden text-center">
          <p className="text-xs text-zinc-500">
            Scroll horizontally to view more of the activity map
          </p>
        </div>
      </div>
    </div>
  )
}

// Custom tooltip for the line chart
function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <AnimatedTooltip>
      <div className="bg-zinc-900/95 border border-zinc-800 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-zinc-300 text-sm font-medium">{label}</p>
        <p className="text-green-400 text-xs mt-1">
          {payload[0].value} check-ins completed
        </p>
      </div>
    </AnimatedTooltip>
  )
}

// Add this helper function at the bottom of the file
function getIntensity(date, checkins) {
  // Get the streak length for this date
  const sortedCheckins = checkins
    .filter(c => c.did_perform_action)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  
  let streak = 0
  for (let i = sortedCheckins.length - 1; i >= 0; i--) {
    if (sortedCheckins[i].date === date) {
      streak++
      let prevDate = new Date(date)
      for (let j = i - 1; j >= 0; j--) {
        const currentDate = new Date(sortedCheckins[j].date)
        const diffDays = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          streak++
          prevDate = currentDate
        } else {
          break
        }
      }
      break
    }
  }
  
  // Convert streak to intensity (1-4)
  if (streak <= 1) return 1
  if (streak <= 3) return 2
  if (streak <= 7) return 3
  return 4
}
