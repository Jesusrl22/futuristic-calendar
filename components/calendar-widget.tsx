"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  theme: any
  t: (key: string) => string
}

export function CalendarWidget({ selectedDate, onDateSelect, theme, t }: CalendarWidgetProps) {
  return (
    <Card className={`${theme.cardBg} backdrop-blur-xl ${theme.border}`}>
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2 text-base md:text-lg`}>
          <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
          <span>{t("calendar")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="scale-75 sm:scale-85 md:scale-90 lg:scale-100 origin-top">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            className="rounded-md border-0 w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
