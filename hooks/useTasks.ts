"use client"

import { useCallback } from "react"
import type { Task } from "@/types"
import { useLocalStorage } from "./useLocalStorage"

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("futuretask-tasks", [])

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTasks((prev) => [newTask, ...prev])
      return newTask
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
      )
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    },
    [setTasks],
  )

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task,
        ),
      )
    },
    [setTasks],
  )

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  }
}
