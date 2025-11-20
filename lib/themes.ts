export type ThemeTier = "free" | "premium" | "pro"

export interface Theme {
  id: string
  name: string
  tier: ThemeTier
  primary: string
  secondary: string
  description: string
}

// Free themes - 5 basic themes including default
export const freeThemes: Theme[] = [
  {
    id: "default",
    name: "Default Dark",
    tier: "free",
    primary: "84 100% 65%", // Original neon green
    secondary: "0 0% 15%", // Original dark background
    description: "Original neon green theme",
  },
  {
    id: "light-mode",
    name: "Light Mode",
    tier: "free",
    primary: "0 0% 95%",
    secondary: "0 0% 85%",
    description: "Clean light theme",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    tier: "free",
    primary: "210 50% 45%",
    secondary: "210 40% 60%",
    description: "Calm blue tones",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    tier: "free",
    primary: "140 40% 40%",
    secondary: "140 30% 55%",
    description: "Natural green theme",
  },
  {
    id: "midnight",
    name: "Midnight",
    tier: "free",
    primary: "220 20% 15%",
    secondary: "220 15% 30%",
    description: "Deep dark blue",
  },
]

// Premium themes - 5 more sophisticated themes
export const premiumThemes: Theme[] = [
  {
    id: "neon-tech",
    name: "Neon Tech",
    tier: "premium",
    primary: "84 100% 65%",
    secondary: "0 0% 15%",
    description: "Neon green tech aesthetic",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    tier: "premium",
    primary: "25 95% 55%",
    secondary: "340 85% 55%",
    description: "Warm sunset gradient",
  },
  {
    id: "purple-haze",
    name: "Purple Haze",
    tier: "premium",
    primary: "270 70% 60%",
    secondary: "290 60% 45%",
    description: "Rich purple tones",
  },
  {
    id: "cyber-pink",
    name: "Cyber Pink",
    tier: "premium",
    primary: "330 80% 60%",
    secondary: "200 70% 50%",
    description: "Cyberpunk vibes",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    tier: "premium",
    primary: "160 60% 55%",
    secondary: "180 50% 45%",
    description: "Cool mint aesthetic",
  },
]

// Pro themes - 5 premium quality themes
export const proThemes: Theme[] = [
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    tier: "pro",
    primary: "180 80% 50%",
    secondary: "280 70% 55%",
    description: "Northern lights inspired",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    tier: "pro",
    primary: "45 90% 60%",
    secondary: "35 85% 50%",
    description: "Warm golden gradient",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    tier: "pro",
    primary: "200 80% 35%",
    secondary: "220 70% 25%",
    description: "Mysterious ocean depths",
  },
  {
    id: "lavender-dreams",
    name: "Lavender Dreams",
    tier: "pro",
    primary: "280 60% 65%",
    secondary: "260 50% 55%",
    description: "Soft lavender gradient",
  },
  {
    id: "fire-ember",
    name: "Fire & Ember",
    tier: "pro",
    primary: "15 90% 60%",
    secondary: "0 85% 50%",
    description: "Fiery red and orange",
  },
]

export const allThemes = [...freeThemes, ...premiumThemes, ...proThemes]

export function getThemesByTier(userPlan: string): Theme[] {
  const plan = userPlan.toLowerCase().trim()

  console.log("[v0] getThemesByTier called with plan:", plan)

  if (plan === "pro") {
    console.log("[v0] Returning all themes for Pro user")
    return allThemes // Pro users get all themes
  } else if (plan === "premium") {
    console.log("[v0] Returning free + premium themes")
    return [...freeThemes, ...premiumThemes] // Premium gets free + premium
  } else {
    console.log("[v0] Returning only free themes")
    return freeThemes // Free users only get free themes
  }
}

export function canUseCustomTheme(userPlan: string): boolean {
  return userPlan.toLowerCase().trim() === "pro"
}

export function applyTheme(themeId: string, customPrimary?: string, customSecondary?: string) {
  const root = document.documentElement

  console.log("[v0] Applying theme:", themeId, customPrimary, customSecondary)

  if (themeId === "custom" && customPrimary && customSecondary) {
    // Apply custom theme
    root.style.setProperty("--primary", customPrimary)
    root.style.setProperty("--accent", customPrimary)
    root.style.setProperty("--secondary", customSecondary)
    root.style.setProperty("--muted", customSecondary)

    // Save to localStorage for persistence
    localStorage.setItem("theme", "custom")
    localStorage.setItem("customPrimary", customPrimary)
    localStorage.setItem("customSecondary", customSecondary)
    return
  }

  // Find the theme
  const theme = allThemes.find((t) => t.id === themeId)
  if (!theme) {
    console.warn("[v0] Theme not found:", themeId)
    return
  }

  // Apply theme colors
  root.style.setProperty("--primary", theme.primary)
  root.style.setProperty("--accent", theme.primary)
  root.style.setProperty("--secondary", theme.secondary)
  root.style.setProperty("--muted", theme.secondary)

  // Save to localStorage for persistence
  localStorage.setItem("theme", themeId)
}
