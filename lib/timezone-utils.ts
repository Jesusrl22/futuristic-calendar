export function getLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getTimezoneOffset() {
  const now = new Date()
  return -now.getTimezoneOffset() * 60 * 1000
}

export function toLocalISOString(date: Date): string {
  const offset = getTimezoneOffset()
  const localDate = new Date(date.getTime() + offset)
  return localDate.toISOString().split("Z")[0]
}

export function fromLocalISOString(isoString: string): Date {
  const offset = getTimezoneOffset()
  const date = new Date(isoString)
  return new Date(date.getTime() - offset)
}

export function formatTimeForInput(date: Date): string {
  const offset = getTimezoneOffset()
  const localDate = new Date(date.getTime() + offset)
  const hours = String(localDate.getHours()).padStart(2, "0")
  const minutes = String(localDate.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

export function formatDateTimeForInput(date: Date): string {
  const offset = getTimezoneOffset()
  const localDate = new Date(date.getTime() + offset)
  const year = localDate.getFullYear()
  const month = String(localDate.getMonth() + 1).padStart(2, "0")
  const day = String(localDate.getDate()).padStart(2, "0")
  const hours = String(localDate.getHours()).padStart(2, "0")
  const minutes = String(localDate.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function createLocalDate(year: number, month: number, day: number, hours: number, minutes: number): Date {
  const offset = getTimezoneOffset()
  const date = new Date(year, month, day, hours, minutes, 0)
  return new Date(date.getTime() - offset)
}
