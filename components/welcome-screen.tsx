"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, Clock, Target, Zap, ArrowRight } from "lucide-react"

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userName, setUserName] = useState("")
  const [userGoals, setUserGoals] = useState<string[]>([])

  const steps = [
    {
      title: "Welcome to FutureTask",
      description: "Your intelligent task management companion",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Get ready to supercharge your productivity!</h2>
            <p className="text-white/70">
              FutureTask combines advanced task management with Pomodoro technique and intelligent insights.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-white/80">Smart Calendar</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-white/80">Pomodoro Timer</p>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-white/80">Goal Tracking</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tell us about yourself",
      description: "Let's personalize your experience",
      content: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-white">
              What should we call you?
            </Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 mt-2"
            />
          </div>
          <div>
            <Label className="text-white">What are your main goals? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                "Increase productivity",
                "Better time management",
                "Work-life balance",
                "Focus improvement",
                "Goal achievement",
                "Habit building",
              ].map((goal) => (
                <Button
                  key={goal}
                  variant={userGoals.includes(goal) ? "default" : "outline"}
                  onClick={() => {
                    if (userGoals.includes(goal)) {
                      setUserGoals(userGoals.filter((g) => g !== goal))
                    } else {
                      setUserGoals([...userGoals, goal])
                    }
                  }}
                  className={`text-left justify-start ${
                    userGoals.includes(goal)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {goal}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "You're all set!",
      description: "Ready to start your productivity journey",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Welcome aboard, {userName || "there"}! 🎉</h2>
            <p className="text-white/70">
              Your personalized FutureTask experience is ready. Let's start achieving your goals!
            </p>
          </div>
          {userGoals.length > 0 && (
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Your selected goals:</h3>
              <div className="flex flex-wrap gap-2">
                {userGoals.map((goal) => (
                  <span
                    key={goal}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = currentStep === 0 || (currentStep === 1 && userName.trim().length > 0) || currentStep === 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <CardTitle className="text-white">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-white/70">{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].content}

          <Separator className="bg-white/20" />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
