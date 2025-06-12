export interface Settings {
  refreshRate: number // in seconds
  theme: "dark" | "light" | "auto"
  showFinishedGames: boolean
  compactView: boolean
  sortBy: "status" | "time" | "team"
  autoRefresh: boolean
  notificationsEnabled: boolean
}

export const defaultSettings: Settings = {
  refreshRate: 60,
  theme: "dark",
  showFinishedGames: true,
  compactView: false,
  sortBy: "status",
  autoRefresh: true,
  notificationsEnabled: false,
}
