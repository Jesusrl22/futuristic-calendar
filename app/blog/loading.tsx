"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Skeleton */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-8 w-40 bg-white/20" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-80 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="max-w-md mx-auto">
            <Skeleton className="h-10 w-full bg-white/20" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 bg-white/20" />
            ))}
          </div>
        </div>

        {/* Featured Posts Skeleton */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Skeleton className="h-6 w-6 mr-2 bg-white/20" />
            <Skeleton className="h-8 w-48 bg-white/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-20 bg-white/20" />
                    <Skeleton className="h-5 w-16 bg-white/20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-full mb-1 bg-white/20" />
                  <Skeleton className="h-4 w-3/4 bg-white/20" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-12 bg-white/20" />
                      <Skeleton className="h-4 w-12 bg-white/20" />
                      <Skeleton className="h-4 w-8 bg-white/20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 bg-white/20" />
                    <Skeleton className="h-8 w-20 bg-white/20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Posts Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48 bg-white/20" />
            <Skeleton className="h-4 w-32 bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-20 bg-white/20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-full mb-1 bg-white/20" />
                  <Skeleton className="h-4 w-3/4 bg-white/20" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-5 w-12 bg-white/20" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-12 bg-white/20" />
                      <Skeleton className="h-4 w-12 bg-white/20" />
                      <Skeleton className="h-4 w-8 bg-white/20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 bg-white/20" />
                    <Skeleton className="h-8 w-20 bg-white/20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter CTA Skeleton */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Skeleton className="h-12 w-12 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-8 w-48 mx-auto mb-2 bg-white/20" />
            <Skeleton className="h-4 w-96 mx-auto mb-6 bg-white/20" />
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Skeleton className="h-10 flex-1 bg-white/20" />
              <Skeleton className="h-10 w-32 bg-white/20" />
            </div>
            <Skeleton className="h-4 w-64 mx-auto mt-4 bg-white/20" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
