"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  theme: any
  t: (key: string) => string
}

export function CalendarWidget({ selectedDate, onDateSelect, theme, t }: CalendarWidgetProps) {
  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={theme.textPrimary}>📅 {t("calendar")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border-0"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: `text-sm font-medium ${theme.textPrimary}`,
            nav: "space-x-1 flex items-center",
            nav_button: `h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 ${theme.textSecondary}`,
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: `${theme.textMuted} rounded-md w-9 font-normal text-[0.8rem]`,
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative",
            day: `h-9 w-9 p-0 font-normal ${theme.textPrimary} hover:bg-white/10 rounded-md`,
            day_selected:
              "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600",
            day_today: `bg-white/10 ${theme.textAccent}`,
            day_outside: `${theme.textMuted} opacity-50`,
            day_disabled: `${theme.textMuted} opacity-50`,
          }}
        />
      </CardContent>
    </Card>
  )
}
