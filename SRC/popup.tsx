"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCw, AlertCircle, Settings } from "lucide-react"
import { ScoreCard } from "./components/score-card"
import { CompactScoreCard } from "./components/compact-score-card"
import { LoadingSpinner } from "./components/loading-spinner"
import { ErrorBanner } from "./components/error-banner"
import { SettingsPage } from "./components/settings-page"
import { useSettings } from "./context/settings-context"
import { mockGames } from "./data/mock-games"
import type { Game } from "./types"

export default function Popup() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { settings } = useSettings()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to sort games based on settings
  const sortGames = (games: Game[]) => {
    const filtered = settings.showFinishedGames ? games : games.filter((game) => game.status !== "FINISHED")

    return filtered.sort((a, b) => {
      switch (settings.sortBy) {
        case "status":
          const statusOrder = { LIVE: 0, UPCOMING: 1, FINISHED: 2 }
          return statusOrder[a.status] - statusOrder[b.status]
        case "team":
          return a.homeTeam.name.localeCompare(b.homeTeam.name)
        case "time":
          // Simple time sorting - in real app you'd use actual timestamps
          return a.id.localeCompare(b.id)
        default:
          return 0
      }
    })
  }

  // Function to fetch games data
  const fetchGames = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const sortedGames = sortGames(mockGames)
      setGames(sortedGames)
    } catch (err) {
      setError("Failed to load scores. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Set up auto-refresh based on settings
  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    if (settings.autoRefresh) {
      refreshIntervalRef.current = setInterval(fetchGames, settings.refreshRate * 1000)
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [settings.autoRefresh, settings.refreshRate])

  // Re-sort games when sort settings change
  useEffect(() => {
    if (games.length > 0) {
      setGames(sortGames(games))
    }
  }, [settings.sortBy, settings.showFinishedGames])

  // Initial load
  useEffect(() => {
    fetchGames()
  }, [])

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />
  }

  const themeClasses =
    settings.theme === "light"
      ? "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900"
      : "bg-gradient-to-b from-slate-900 to-slate-800 text-white"

  return (
    <div className={`${themeClasses} min-h-[400px] w-[350px] p-4 flex flex-col`}>
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold tracking-tight">Live Scores</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchGames}
            disabled={isLoading}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
            aria-label="Refresh scores"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-full transition-colors ${
              settings.theme === "light" ? "bg-gray-300 hover:bg-gray-400" : "bg-slate-700 hover:bg-slate-600"
            }`}
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {error && <ErrorBanner message={error} />}

      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {isLoading ? (
          <LoadingSpinner />
        ) : games.length > 0 ? (
          games.map((game) =>
            settings.compactView ? (
              <CompactScoreCard key={game.id} game={game} />
            ) : (
              <ScoreCard key={game.id} game={game} />
            ),
          )
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full text-center p-4 ${
              settings.theme === "light" ? "text-gray-500" : "text-slate-400"
            }`}
          >
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>No live games available right now.</p>
            <p className="text-sm mt-1">Check back later for updates.</p>
          </div>
        )}
      </div>

      <footer
        className={`mt-auto pt-2 border-t text-center text-xs ${
          settings.theme === "light" ? "border-gray-300 text-gray-500" : "border-slate-700 text-slate-400"
        }`}
      >
        <p>
          {settings.autoRefresh
            ? `Auto-refresh every ${settings.refreshRate < 60 ? `${settings.refreshRate}s` : `${settings.refreshRate / 60}m`}`
            : "Auto-refresh disabled"}
        </p>
      </footer>
    </div>
  )
}
