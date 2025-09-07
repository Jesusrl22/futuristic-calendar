"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  theme: any
  t: (key: string) => string
}

export function CalendarWidget({ selectedDate, onDateSelect, theme, t }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    calendarDays.push(date)
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${theme.textPrimary}`}>📅 {t("calendar")}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className={`${theme.textSecondary} hover:${theme.textPrimary}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className={`${theme.textSecondary} hover:${theme.textPrimary}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className={`text-center ${theme.textPrimary} font-semibold`}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Quick today button */}
          <div className="text-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date()
                onDateSelect(today)
                setCurrentMonth(today)
              }}
              className={`${theme.textSecondary} hover:${theme.textPrimary} text-xs`}
            >
              Ir a hoy: {new Date().toLocaleDateString()}
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className={`text-center text-xs font-semibold ${theme.textSecondary} p-1`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8" />
              }

              const isDateToday = isToday(date)
              const isDateSelected = isSelected(date)

              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => onDateSelect(date)}
                  className={`h-8 w-8 p-0 text-xs font-normal ${
                    isDateSelected
                      ? `${theme.buttonPrimary} text-white`
                      : isDateToday
                        ? `bg-purple-500/20 ${theme.textAccent} border border-purple-400/50`
                        : `${theme.textSecondary} hover:${theme.textPrimary} hover:bg-white/10`
                  }`}
                >
                  {date.getDate()}
                </Button>
              )
            })}
          </div>

          {/* Selected date info */}
          <div className="text-center mt-4 pt-2 border-t border-white/10">
            <p className={`text-sm ${theme.textSecondary}`}>Fecha seleccionada:</p>
            <p className={`text-sm font-semibold ${theme.textPrimary}`}>
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
