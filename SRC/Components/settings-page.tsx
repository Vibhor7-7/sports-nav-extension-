"use client"

import { ArrowLeft, RotateCcw } from "lucide-react"
import { useSettings } from "../context/settings-context"
import type { Settings } from "../types/settings" // Import Settings type

interface SettingsPageProps {
  onBack: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { settings, updateSettings, resetSettings } = useSettings()

  const refreshRateOptions = [
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" },
  ]

  const themeOptions = [
    { value: "dark" as const, label: "Dark" },
    { value: "light" as const, label: "Light" },
    { value: "auto" as const, label: "Auto" },
  ]

  const sortOptions = [
    { value: "status" as const, label: "Game Status" },
    { value: "time" as const, label: "Start Time" },
    { value: "team" as const, label: "Team Name" },
  ]

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-[400px] w-[350px] p-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <button
          onClick={resetSettings}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          aria-label="Reset to defaults"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      <div className="space-y-6 overflow-y-auto max-h-[320px]">
        {/* Refresh Settings */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-green-400">Refresh Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Refresh</label>
              <button
                onClick={() => updateSettings({ autoRefresh: !settings.autoRefresh })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoRefresh ? "bg-green-600" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoRefresh ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Refresh Rate</label>
              <select
                value={settings.refreshRate}
                onChange={(e) => updateSettings({ refreshRate: Number(e.target.value) })}
                disabled={!settings.autoRefresh}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
              >
                {refreshRateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Display Preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-green-400">Display Preferences</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as Settings["theme"] })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sort Games By</label>
              <select
                value={settings.sortBy}
                onChange={(e) => updateSettings({ sortBy: e.target.value as Settings["sortBy"] })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Finished Games</label>
              <button
                onClick={() => updateSettings({ showFinishedGames: !settings.showFinishedGames })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showFinishedGames ? "bg-green-600" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showFinishedGames ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Compact View</label>
              <button
                onClick={() => updateSettings({ compactView: !settings.compactView })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.compactView ? "bg-green-600" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.compactView ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-green-400">Notifications</h2>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Score Updates</label>
              <p className="text-xs text-slate-400 mt-1">Get notified when scores change</p>
            </div>
            <button
              onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notificationsEnabled ? "bg-green-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
