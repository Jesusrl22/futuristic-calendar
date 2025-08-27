"use client"

import { useState, useCallback, useMemo } from "react"
import { useLocalStorage } from "./useLocalStorage"
import type { Task, Category, SearchFilters, Stats } from "@/types"

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    category: undefined,
    priority: undefined,
    completed: undefined,
    dateRange: undefined,
    tags: [],
  })

  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags || [],
        subtasks: taskData.subtasks || [],
      }

      setTasks((prev) => [...prev, newTask])
      return newTask
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
      )
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    },
    [setTasks],
  )

  const toggleTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            const completed = !task.completed
            return {
              ...task,
              completed,
              completedAt: completed ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString(),
            }
          }
          return task
        }),
      )
    },
    [setTasks],
  )

  const duplicateTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        const duplicatedTask = {
          ...task,
          title: `${task.title} (Copy)`,
          completed: false,
          completedAt: undefined,
        }
        return addTask(duplicatedTask)
      }
    },
    [tasks, addTask],
  )

  const moveTask = useCallback(
    (taskId: string, newDate: string) => {
      updateTask(taskId, { date: newDate })
    },
    [updateTask],
  )

  const addSubtask = useCallback(
    (taskId: string, subtaskTitle: string) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        const newSubtask = {
          id: Date.now().toString(),
          title: subtaskTitle,
          completed: false,
          createdAt: new Date().toISOString(),
        }
        const updatedSubtasks = [...(task.subtasks || []), newSubtask]
        updateTask(taskId, { subtasks: updatedSubtasks })
      }
    },
    [tasks, updateTask],
  )

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task && task.subtasks) {
        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
        )
        updateTask(taskId, { subtasks: updatedSubtasks })
      }
    },
    [tasks, updateTask],
  )

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (searchFilters.category) {
      filtered = filtered.filter((task) => task.category === searchFilters.category)
    }

    if (searchFilters.priority) {
      filtered = filtered.filter((task) => task.priority === searchFilters.priority)
    }

    if (searchFilters.completed !== undefined) {
      filtered = filtered.filter((task) => task.completed === searchFilters.completed)
    }

    if (searchFilters.dateRange) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.date)
        const startDate = new Date(searchFilters.dateRange!.start)
        const endDate = new Date(searchFilters.dateRange!.end)
        return taskDate >= startDate && taskDate <= endDate
      })
    }

    if (searchFilters.tags && searchFilters.tags.length > 0) {
      filtered = filtered.filter((task) => searchFilters.tags!.some((tag) => task.tags.includes(tag)))
    }

    return filtered
  }, [tasks, searchFilters])

  const getTasksForDate = useCallback(
    (date: string) => {
      return tasks.filter((task) => task.date === date)
    },
    [tasks],
  )

  const getWeekTasks = useCallback(() => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))

    return tasks.filter((task) => {
      const taskDate = new Date(task.date)
      return taskDate >= startOfWeek && taskDate <= endOfWeek
    })
  }, [tasks])

  const getOverdueTasks = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    return tasks.filter((task) => !task.completed && task.date < today)
  }, [tasks])

  const getUpcomingTasks = useCallback(
    (days = 7) => {
      const today = new Date()
      const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
      const todayStr = today.toISOString().split("T")[0]
      const futureDateStr = futureDate.toISOString().split("T")[0]

      return tasks.filter((task) => !task.completed && task.date >= todayStr && task.date <= futureDateStr)
    },
    [tasks],
  )

  const calculateStats = useCallback((): Stats => {
    const today = new Date().toISOString().split("T")[0]
    const thisWeekStart = new Date()
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
    const thisWeekStartStr = thisWeekStart.toISOString().split("T")[0]

    const completedTasks = tasks.filter((task) => task.completed)
    const todayTasks = tasks.filter((task) => task.date === today)
    const todayCompletedTasks = todayTasks.filter((task) => task.completed)
    const weekTasks = tasks.filter((task) => task.date >= thisWeekStartStr)
    const weekCompletedTasks = weekTasks.filter((task) => task.completed)

    let streak = 0
    const currentDate = new Date()
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const dayTasks = tasks.filter((task) => task.date === dateStr)
      const dayCompletedTasks = dayTasks.filter((task) => task.completed)

      if (dayTasks.length === 0 || dayCompletedTasks.length === 0) {
        break
      }

      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    const totalTimeSpent = completedTasks.reduce((total, task) => {
      return total + (task.actualTime || task.estimatedTime || 0)
    }, 0)

    const focusTime = completedTasks.reduce((total, task) => {
      return total + (task.actualTime || 0)
    }, 0)

    return {
      dailyStreak: streak,
      totalTasksCompleted: completedTasks.length,
      totalTimeSpent,
      todayTasks: todayCompletedTasks.length,
      weekTasks: weekCompletedTasks.length,
      pomodoroSessions: 0,
      focusTime,
      streak,
      averageTasksPerDay: completedTasks.length / Math.max(1, streak),
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
    }
  }, [tasks])

  const exportTasks = useCallback(() => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `tasks-export-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }, [tasks])

  const importTasks = useCallback(
    (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedTasks = JSON.parse(e.target?.result as string)
            if (Array.isArray(importedTasks)) {
              setTasks((prev) => [...prev, ...importedTasks])
              resolve()
            } else {
              reject(new Error("Invalid file format"))
            }
          } catch (error) {
            reject(error)
          }
        }
        reader.readAsText(file)
      })
    },
    [setTasks],
  )

  const clearAllTasks = useCallback(() => {
    setTasks([])
  }, [setTasks])

  const clearCompletedTasks = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }, [setTasks])

  const getAllTags = useCallback(() => {
    const allTags = tasks.flatMap((task) => task.tags)
    return [...new Set(allTags)].sort()
  }, [tasks])

  const getAllCategories = useCallback((): Category[] => {
    const allCategories = tasks.map((task) => task.category)
    return [...new Set(allCategories)] as Category[]
  }, [tasks])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    searchFilters,
    setSearchFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    duplicateTask,
    moveTask,
    addSubtask,
    toggleSubtask,
    getTasksForDate,
    getWeekTasks,
    getOverdueTasks,
    getUpcomingTasks,
    calculateStats,
    exportTasks,
    importTasks,
    clearAllTasks,
    clearCompletedTasks,
    getAllTags,
    getAllCategories,
  }
}
