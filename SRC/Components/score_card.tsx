import type { Game, GameStatus } from "../types"
import { TeamLogo } from "./team-logo"

interface ScoreCardProps {
  game: Game
}

export function ScoreCard({ game }: ScoreCardProps) {
  // Determine status color
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

  // Format time or score based on status
  const getTimeOrPeriod = () => {
    if (game.status === "UPCOMING") {
      return game.scheduledTime
    }
    return game.period
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-green-500 transition-all duration-200 transform hover:-translate-y-1">
      <div className="p-3 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor(game.status)}`}></span>
          <span className="text-xs font-medium text-slate-300">{game.status}</span>
        </div>
        <span className="text-xs text-slate-400">{getTimeOrPeriod()}</span>
      </div>

      <div className="p-3">
        {/* Home Team */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <TeamLogo teamId={game.homeTeam.id} name={game.homeTeam.name} />
            <span className="font-bold">{game.homeTeam.name}</span>
          </div>
          <span className="text-xl font-bold tabular-nums">{game.homeTeam.score}</span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TeamLogo teamId={game.awayTeam.id} name={game.awayTeam.name} />
            <span className="font-bold">{game.awayTeam.name}</span>
          </div>
          <span className="text-xl font-bold tabular-nums">{game.awayTeam.score}</span>
        </div>
      </div>
    </div>
  )
}
