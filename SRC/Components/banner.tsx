import { AlertCircle } from "lucide-react"

interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-4 flex items-center space-x-2">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <p className="text-sm text-white">{message}</p>
    </div>
  )
}
