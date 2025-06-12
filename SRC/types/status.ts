export type GameStatus = "LIVE" | "FINISHED" | "UPCOMING"

export interface Team {
  id: string
  name: string
  score: number
}

export interface Game {
  id: string
  homeTeam: Team
  awayTeam: Team
  status: GameStatus
  period?: string
  scheduledTime?: string
}
