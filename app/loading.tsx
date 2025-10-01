export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Cargando FutureTask</h2>
          <p className="text-purple-300">Preparando tu espacio de trabajo...</p>
        </div>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}
