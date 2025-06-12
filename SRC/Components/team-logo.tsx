interface TeamLogoProps {
  teamId: string
  name: string
  size?: "sm" | "md"
}

export function TeamLogo({ teamId, name, size = "md" }: TeamLogoProps) {
  const initial = name.charAt(0)

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
  }

  const getTeamColor = (id: string) => {
    const colors = [
      "bg-blue-600",
      "bg-red-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
      "bg-orange-600",
    ]

    const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold ${getTeamColor(teamId)}`}
    >
      {initial}
    </div>
  )
}
