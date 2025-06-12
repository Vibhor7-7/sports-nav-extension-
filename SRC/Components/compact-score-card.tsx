import type { Game, GameStatus } from "../types"
import { TeamLogo } from "./team-logo"

interface CompactScoreCardProps {
  game: Game
}

export function CompactScoreCard({ game }: CompactScoreCardProps) {
  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case "LIVE":
        return "bg-red-500"
      case "FINISHED":
        return "bg-slate-500"
      case "UPCOMING":
        return "bg-green-500"
      default:
        return "bg-slate-500"
    }
  }

  const getTimeOrPeriod = () => {
    if (game.status === "UPCOMING") {
      return game.scheduledTime
    }
    return game.period
  }

  return (
    <div className="bg-slate-800 rounded-lg p-2 border border-slate-700 hover:border-green-500 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor(game.status)}`}></span>
          <span className="text-xs text-slate-400">{game.status}</span>
        </div>
        <span className="text-xs text-slate-400">{getTimeOrPeriod()}</span>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TeamLogo teamId={game.homeTeam.id} name={game.homeTeam.name} size="sm" />
            <span className="text-sm font-medium truncate">{game.homeTeam.name}</span>
          </div>
          <span className="text-lg font-bold tabular-nums">{game.homeTeam.score}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TeamLogo teamId={game.awayTeam.id} name={game.awayTeam.name} size="sm" />
            <span className="text-sm font-medium truncate">{game.awayTeam.name}</span>
          </div>
          <span className="text-lg font-bold tabular-nums">{game.awayTeam.score}</span>
        </div>
      </div>
    </div>
  )
}
