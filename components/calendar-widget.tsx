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
      <CardHeader className="pb-2">
        <CardTitle className={`${theme.textPrimary} text-base font-semibold`}>📅 {t("calendar")}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-lg border-0 w-full"
          classNames={{
            months: "flex flex-col w-full",
            month: "space-y-2 w-full",
            caption: "flex justify-center pt-1 relative items-center mb-2",
            caption_label: `text-sm font-semibold ${theme.textPrimary}`,
            nav: "space-x-1 flex items-center",
            nav_button: `h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 ${theme.textSecondary} hover:${theme.cardBg} rounded-md transition-all duration-200`,
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full mb-1",
            head_cell: `${theme.textMuted} rounded-md flex-1 font-medium text-xs text-center py-1 uppercase`,
            row: "flex w-full mt-0.5",
            cell: "relative p-0 text-center focus-within:relative focus-within:z-20 flex-1 h-7",
            day: `h-7 w-full p-0 font-normal ${theme.textSecondary} hover:${theme.cardBg} hover:${theme.textPrimary} rounded-md transition-all duration-200 flex items-center justify-center text-xs cursor-pointer`,
            day_selected: `bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 font-semibold shadow-lg`,
            day_today: `${theme.cardBg} ${theme.textAccent} font-semibold ring-1 ring-purple-400/50`,
            day_outside: `${theme.textMuted} opacity-40 hover:opacity-60`,
            day_disabled: `${theme.textMuted} opacity-20 cursor-not-allowed`,
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </CardContent>
    </Card>
  )
}
