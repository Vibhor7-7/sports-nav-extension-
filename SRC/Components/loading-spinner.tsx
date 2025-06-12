export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px]">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 border-opacity-20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-400">Loading scores...</p>
    </div>
  )
}
