export default function AppLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
        <p className="text-white text-lg">Cargando tu espacio de trabajo...</p>
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}
