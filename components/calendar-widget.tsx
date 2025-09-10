"use client"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  tasks: any[]
  theme: any
  t: (key: string) => string
}

export function CalendarWidget({ selectedDate, onDateSelect, tasks, theme, t }: CalendarWidgetProps) {
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateStr)
  }

  const hasTasksOnDate = (date: Date) => {
    return getTasksForDate(date).length > 0
  }

  const getCompletedTasksForDate = (date: Date) => {
    return getTasksForDate(date).filter((task) => task.completed).length
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
          <CalendarIcon className="w-5 h-5" />
          <span>{t("calendar")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border"
          modifiers={{
            hasTasks: (date) => hasTasksOnDate(date),
          }}
          modifiersStyles={{
            hasTasks: {
              backgroundColor: "rgba(147, 51, 234, 0.2)",
              color: "white",
              fontWeight: "bold",
            },
          }}
        />

        <div className="mt-4 space-y-2">
          <h4 className={`font-semibold ${theme.textPrimary}`}>
            {t("tasksForDate")} {selectedDate.toLocaleDateString("es-ES")}
          </h4>

          {getTasksForDate(selectedDate).length === 0 ? (
            <p className={`text-sm ${theme.textMuted}`}>{t("noTasksForDate")}</p>
          ) : (
            <div className="space-y-2">
              {getTasksForDate(selectedDate).map((task, index) => (
                <div key={index} className={`p-2 rounded border ${theme.border} bg-black/10`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${task.completed ? theme.textMuted : theme.textPrimary}`}>
                      {task.text}
                    </span>
                    <div className="flex items-center space-x-2">
                      {task.time && (
                        <Badge variant="outline" className="text-xs">
                          {task.time}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
