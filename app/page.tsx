"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Calendar, Brain, Zap, Shield, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">TaskFlow AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/50">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered Productivity
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Organize Your Life
          <br />
          <span className="text-gradient bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transform your productivity with an intelligent calendar that learns from your habits and helps you achieve
          more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-purple-500 text-white hover:bg-purple-500/10 bg-transparent"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">95%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">2M+</div>
            <div className="text-gray-400">Tasks Completed</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to stay organized and productive</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">AI Assistant</CardTitle>
                <CardDescription className="text-gray-400">
                  Get intelligent suggestions and automated task management powered by advanced AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Smart Calendar</CardTitle>
                <CardDescription className="text-gray-400">
                  Visual calendar that adapts to your schedule and prioritizes what matters most
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Pomodoro Timer</CardTitle>
                <CardDescription className="text-gray-400">
                  Built-in focus timer to help you maintain productivity and avoid burnout
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Secure & Private</CardTitle>
                <CardDescription className="text-gray-400">
                  Your data is encrypted and protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Achievements</CardTitle>
                <CardDescription className="text-gray-400">
                  Unlock badges and track your productivity journey with gamification
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed insights into your productivity patterns and habits
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Free</CardTitle>
                <CardDescription className="text-gray-400">Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Up to 50 tasks
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Basic calendar
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Pomodoro timer
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-purple-600/20 to-cyan-600/20 border-purple-500/50 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <CardDescription className="text-gray-300">For power users</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$9.99</span>
                  <span className="text-gray-300">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-200">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Unlimited tasks
                  </li>
                  <li className="flex items-center text-gray-200">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    AI Assistant
                  </li>
                  <li className="flex items-center text-gray-200">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-200">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-gray-400">For teams and organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Team collaboration
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-purple-400 mr-2" />
                    Dedicated support
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-purple-500 text-white hover:bg-purple-500/10 bg-transparent"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-gray-400 text-lg">Join thousands of satisfied users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "TaskFlow AI has completely transformed how I manage my day. The AI suggestions are spot-on!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-semibold">Sarah Martinez</div>
                    <div className="text-gray-400 text-sm">Product Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The Pomodoro timer and achievements system keep me motivated. Best productivity app I've used."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-semibold">James Davidson</div>
                    <div className="text-gray-400 text-sm">Software Engineer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Simple, elegant, and powerful. TaskFlow AI helps me stay on top of everything without the overwhelm."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    EC
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-semibold">Emma Chen</div>
                    <div className="text-gray-400 text-sm">Freelance Designer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already achieving more with TaskFlow AI
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">TaskFlow AI</span>
              </div>
              <p className="text-gray-400">AI-powered productivity for the modern world</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Updates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TaskFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
