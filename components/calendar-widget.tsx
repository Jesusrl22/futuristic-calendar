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
    <Card className={`${theme.cardBg} ${theme.border} shadow-lg`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${theme.textPrimary} text-lg font-semibold flex items-center space-x-2`}>
          <span className="text-xl">📅</span>
          <span>{t("calendar")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-xl border-0 w-full"
          classNames={{
            months: "flex flex-col w-full space-y-4",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: `text-base font-bold ${theme.textPrimary}`,
            nav: "space-x-1 flex items-center",
            nav_button: `h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 ${theme.textSecondary} hover:${theme.cardBg} rounded-lg transition-all duration-200 flex items-center justify-center`,
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full mb-2",
            head_cell: `${theme.textMuted} rounded-lg flex-1 font-semibold text-sm text-center py-2 uppercase tracking-wide`,
            row: "flex w-full mt-1",
            cell: "relative p-0 text-center focus-within:relative focus-within:z-20 flex-1 h-10",
            day: `h-10 w-full p-0 font-medium ${theme.textSecondary} hover:${theme.cardBg} hover:${theme.textPrimary} rounded-lg transition-all duration-200 flex items-center justify-center text-sm cursor-pointer hover:scale-105 hover:shadow-md`,
            day_selected: `bg-gradient-to-br from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 font-bold shadow-lg ring-2 ring-purple-400/50 scale-105`,
            day_today: `${theme.cardBg} ${theme.textAccent} font-bold ring-2 ring-purple-400/30 shadow-md`,
            day_outside: `${theme.textMuted} opacity-30 hover:opacity-50`,
            day_disabled: `${theme.textMuted} opacity-20 cursor-not-allowed hover:scale-100`,
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />

        {/* Calendar Legend */}
        <div className="mt-4 pt-3 border-t border-purple-500/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full"></div>
              <span className={theme.textMuted}>Seleccionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${theme.cardBg} ring-2 ring-purple-400/30 rounded-full`}></div>
              <span className={theme.textMuted}>Hoy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
