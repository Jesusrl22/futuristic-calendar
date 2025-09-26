export default function SavedArticlesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Skeleton */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-pulse" />
              <div className="w-32 h-6 bg-white/20 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-8 bg-white/20 rounded animate-pulse" />
              <div className="w-24 h-8 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-yellow-400/50 rounded animate-pulse mr-4" />
              <div className="w-80 h-16 bg-white/20 rounded-lg animate-pulse" />
            </div>
            <div className="w-full max-w-3xl h-6 bg-white/10 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-2/3 h-6 bg-white/10 rounded mx-auto animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-6">
                <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-3 animate-pulse" />
                <div className="w-12 h-8 bg-white/20 rounded mx-auto mb-1 animate-pulse" />
                <div className="w-20 h-4 bg-white/10 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters Skeleton */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <div className="w-full h-12 bg-white/10 rounded-xl animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-10 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-32 h-10 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Saved Articles Skeleton */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-orange-500/20 relative">
                  <div className="w-full h-full bg-white/10 animate-pulse" />
                  <div className="absolute top-4 left-4">
                    <div className="w-20 h-6 bg-white/20 rounded animate-pulse" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-5 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-full h-6 bg-white/20 rounded mb-3 animate-pulse" />
                  <div className="w-full h-4 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="w-3/4 h-4 bg-white/10 rounded mb-4 animate-pulse" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-yellow-500/50 rounded-full animate-pulse" />
                      <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
                      <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="w-16 h-4 bg-yellow-400/50 rounded animate-pulse" />
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-12 h-5 bg-white/10 rounded animate-pulse" />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-white/20 rounded animate-pulse" />
                    <div className="w-10 h-10 bg-red-500/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-pulse" />
                <div className="w-32 h-6 bg-white/20 rounded animate-pulse" />
              </div>
              <div className="space-y-2 mb-6">
                <div className="w-full h-4 bg-white/10 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="w-48 h-4 bg-white/10 rounded animate-pulse" />
                <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="w-20 h-6 bg-white/20 rounded mb-4 animate-pulse" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="w-24 h-4 bg-white/10 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="w-64 h-4 bg-white/10 rounded animate-pulse" />
            <div className="w-48 h-4 bg-white/10 rounded mt-4 md:mt-0 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  )
}
