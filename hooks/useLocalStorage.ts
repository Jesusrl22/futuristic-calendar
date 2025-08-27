"use client"

import { useState, useEffect, useCallback } from "react"

type SetValue<T> = T | ((val: T) => T)

interface UseLocalStorageOptions {
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
  expiry?: number
  onError?: (error: Error) => void
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {},
): [T, (value: SetValue<T>) => void, () => void] {
  const { serialize = JSON.stringify, deserialize = JSON.parse, expiry, onError = console.error } = options

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue
      }

      const item = window.localStorage.getItem(key)
      if (!item) {
        return initialValue
      }

      const parsed = deserialize(item)

      if (expiry && parsed.expiry && Date.now() > parsed.expiry) {
        window.localStorage.removeItem(key)
        return initialValue
      }

      return expiry ? parsed.value : parsed
    } catch (error) {
      onError(error as Error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== "undefined") {
          const dataToStore = expiry ? { value: valueToStore, expiry: Date.now() + expiry } : valueToStore
          window.localStorage.setItem(key, serialize(dataToStore))
        }
      } catch (error) {
        onError(error as Error)
      }
    },
    [key, serialize, storedValue, expiry, onError],
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      onError(error as Error)
    }
  }, [key, initialValue, onError])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = deserialize(e.newValue)
          const valueToSet = expiry ? parsed.value : parsed
          setStoredValue(valueToSet)
        } catch (error) {
          onError(error as Error)
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
      return () => window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, deserialize, expiry, onError])

  return [storedValue, setValue, removeValue]
}

export function useLocalStorageState<T extends Record<string, any>>(keys: (keyof T)[], initialValues: T) {
  const [state, setState] = useState<T>(initialValues)

  useEffect(() => {
    const loadedState = { ...initialValues }

    keys.forEach((key) => {
      try {
        const item = localStorage.getItem(key as string)
        if (item) {
          loadedState[key] = JSON.parse(item)
        }
      } catch (error) {
        console.error(`Error loading ${key as string} from localStorage:`, error)
      }
    })

    setState(loadedState)
  }, [])

  const updateState = useCallback((key: keyof T, value: any) => {
    setState((prev) => {
      const newState = { ...prev, [key]: value }

      try {
        localStorage.setItem(key as string, JSON.stringify(value))
      } catch (error) {
        console.error(`Error saving ${key as string} to localStorage:`, error)
      }

      return newState
    })
  }, [])

  const clearState = useCallback(() => {
    keys.forEach((key) => {
      try {
        localStorage.removeItem(key as string)
      } catch (error) {
        console.error(`Error removing ${key as string} from localStorage:`, error)
      }
    })
    setState(initialValues)
  }, [keys, initialValues])

  return { state, updateState, clearState }
}

export function useLocalStorageWithQuota<T>(key: string, initialValue: T, maxSize: number = 5 * 1024 * 1024) {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
  const [quotaExceeded, setQuotaExceeded] = useState(false)

  const setValueWithQuota = useCallback(
    (newValue: SetValue<T>) => {
      try {
        const serialized = JSON.stringify(newValue)

        if (serialized.length > maxSize) {
          setQuotaExceeded(true)
          throw new Error("Data exceeds maximum size limit")
        }

        let totalSize = 0
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            totalSize += localStorage.getItem(key)?.length || 0
          }
        }

        if (totalSize > maxSize) {
          setQuotaExceeded(true)
          const keys = Object.keys(localStorage).sort()
          for (const oldKey of keys) {
            if (oldKey.startsWith("temp_") || oldKey.startsWith("cache_")) {
              localStorage.removeItem(oldKey)
              break
            }
          }
        }

        setValue(newValue)
        setQuotaExceeded(false)
      } catch (error) {
        setQuotaExceeded(true)
        console.error("LocalStorage quota exceeded:", error)
      }
    },
    [setValue, maxSize],
  )

  return [value, setValueWithQuota, removeValue, quotaExceeded] as const
}
