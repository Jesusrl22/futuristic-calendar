"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Calendar, Clock, Trophy, Menu, X, Sparkles, Target } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FutureTask
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-purple-300 hover:text-purple-100 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-purple-300 hover:text-purple-100 transition-colors">
                Pricing
              </a>
              <Link href="/blog" className="text-purple-300 hover:text-purple-100 transition-colors">
                Blog
              </Link>
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

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-purple-300">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a
                href="#features"
                className="block text-purple-300 hover:text-purple-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-purple-300 hover:text-purple-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <Link
                href="/blog"
                className="block text-purple-300 hover:text-purple-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-purple-300 hover:text-purple-100 hover:bg-purple-900/50">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="h-20"></div>

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
                Organize Your Life
              </span>
              <br />
              <span className="text-white">With AI Intelligence</span>
            </h1>
            <p className="text-xl text-purple-200 leading-relaxed">
              Transform your productivity with intelligent task management, AI-powered insights, and seamless calendar
              integration. Perfect for professionals who want to achieve more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
                >
                  Start Free Trial
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-purple-500/50 text-purple-300 hover:bg-purple-900/50 text-lg px-8 bg-transparent"
                >
                  Learn More
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-6 text-purple-300">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-slate-950"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-600 border-2 border-slate-950"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-950"></div>
                </div>
                <span className="text-sm">10,000+ users</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-slate-900/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="h-4 bg-purple-500/30 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-purple-500/20 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-purple-900/30 rounded-lg border border-purple-500/20"></div>
                  <div className="h-12 bg-purple-900/30 rounded-lg border border-purple-500/20"></div>
                  <div className="h-12 bg-purple-900/30 rounded-lg border border-purple-500/20"></div>
                </div>
              </div>
            </div>
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

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="text-xl text-purple-200">Choose the plan that fits your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-purple-400 mb-4">
                  $0<span className="text-lg text-purple-300">/month</span>
                </div>
                <p className="text-purple-200">Perfect to get started</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Basic calendar
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Up to 50 tasks
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Pomodoro timer
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> 10 AI credits/month
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-slate-900/50 border-purple-500 hover:border-purple-400 transition-all relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  $9.99<span className="text-lg">/month</span>
                </div>
                <p className="text-purple-200">For power users</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Everything in Free
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Unlimited tasks
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Advanced AI features
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> 100 AI credits/month
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Priority support
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Start Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-purple-400 mb-4">
                  $19.99<span className="text-lg text-purple-300">/month</span>
                </div>
                <p className="text-purple-200">For teams & professionals</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Everything in Premium
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Team collaboration
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Unlimited AI credits
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> Custom integrations
                </li>
                <li className="flex items-center text-purple-200">
                  <span className="mr-2">✓</span> 24/7 support
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Contact Sales</Button>
              </Link>
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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
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
                  <a href="#features" className="hover:text-purple-100">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-purple-100">
                    Pricing
                  </a>
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
              <h4 className="font-bold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-purple-100">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-100">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-100">
                    LinkedIn
                  </a>
                </li>
              </ul>
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
