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
      <CardHeader className="pb-3">
        <CardTitle className={`${theme.textPrimary} text-lg`}>📅 {t("calendar")}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border-0 w-full"
          classNames={{
            months: "flex flex-col w-full",
            month: "space-y-3 w-full",
            caption: "flex justify-center pt-1 relative items-center mb-3",
            caption_label: `text-base font-semibold ${theme.textPrimary}`,
            nav: "space-x-1 flex items-center",
            nav_button: `h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 ${theme.textSecondary} hover:bg-white/10 rounded-md transition-colors`,
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex w-full mb-1",
            head_cell: `${theme.textMuted} rounded-md flex-1 font-medium text-xs text-center py-1`,
            row: "flex w-full mt-1",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
            day: `h-8 w-full p-0 font-normal ${theme.textPrimary} hover:bg-white/10 rounded-md transition-colors flex items-center justify-center text-sm`,
            day_selected:
              "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 font-semibold",
            day_today: `bg-white/10 ${theme.textAccent} font-semibold`,
            day_outside: `${theme.textMuted} opacity-50`,
            day_disabled: `${theme.textMuted} opacity-30`,
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </CardContent>
    </Card>
  )
}
