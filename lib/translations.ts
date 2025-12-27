// For Italian section - add these translations
export type Language = "en" | "es" | "fr" | "de" | "it"

export const translations = {
  en: {},
  es: {},
  fr: {},
  de: {},
  it: {
    noDescription: "Nessuna descrizione",
    myAwesomeTeam: "Il mio fantastico team",
    whatIsThisTeamAbout: "Di cosa riguarda questo team?",
    timerTitle: "Timer Pomodoro",
    timerPresets: "Preimpostazioni del timer",
    presetShort: "Breve (15/3/10)",
    presetStandard: "Standard (25/5/15)",
    presetLong: "Lungo (45/10/30)",
    presetExtended: "Esteso (60/15/30)",
    customDuration: "Durata personalizzata",
    customPomodoroDuration: "Durata Pomodoro personalizzata",
    setCustomDuration: "Imposta una durata personalizzata per il tuo timer",
    workDuration: "Durata del lavoro",
    sessionsCompleted: "Sessioni completate",
    saveCustomDuration: "Salva durata personalizzata",
    longBreak: "Pausa lunga",
    shortBreak: "Pausa breve", // Renamed 'break' to avoid conflict with JavaScript keyword
    toUnlock: "per sbloccare",
  },
  // ... existing languages ...
}
