"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Calendar, Clock, Trophy } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import Image from "next/image"

// Removed the extensive translations object and languages array as they are not used in the updates.
// The LanguageSelector component is now responsible for handling language selection.

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="FutureTask Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FutureTask
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link href="/login">
                <Button variant="ghost" className="text-purple-300 hover:text-purple-100 hover:bg-purple-900/50">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-500/30">
                ✨ AI-Powered Productivity
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Organize Your Future
              </span>
              <br />
              <span className="text-white">With AI Intelligence</span>
            </h1>
            <p className="text-xl text-purple-200 leading-relaxed">
              Transform your productivity with intelligent task management, AI-powered insights, and seamless calendar
              integration. Perfect for professionals who want to achieve more.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-900/50 text-lg px-8 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"></div>
            <Image
              src="/futuristic-dashboard.png"
              alt="FutureTask Dashboard"
              width={600}
              height={400}
              className="relative rounded-2xl shadow-2xl border border-purple-500/30"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-purple-200">Everything you need to stay productive and organized</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Assistant</h3>
              <p className="text-purple-200">Smart task suggestions and intelligent prioritization powered by AI</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Calendar</h3>
              <p className="text-purple-200">Integrated calendar with automatic scheduling and reminders</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Pomodoro Timer</h3>
              <p className="text-purple-200">Stay focused with built-in Pomodoro technique timer</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Achievements</h3>
              <p className="text-purple-200">Track your progress and unlock achievements as you complete tasks</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 border border-purple-500/30">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-purple-200">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                1M+
              </div>
              <div className="text-purple-200">Tasks Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                99%
              </div>
              <div className="text-purple-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-purple-200">Join thousands of professionals who trust FutureTask</p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12 py-6"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="FutureTask Logo" width={32} height={32} className="rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FutureTask
                </span>
              </div>
              <p className="text-purple-300 text-sm">AI-powered task management for the modern professional</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li>
                  <Link href="#features" className="hover:text-purple-100">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-purple-100">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-purple-100">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-purple-100">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-purple-100">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Language</h4>
              <LanguageSelector />
            </div>
          </div>
          <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-purple-300 text-sm">
            <p>&copy; 2025 FutureTask. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
