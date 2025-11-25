export type ThemeTier = "free" | "premium" | "pro"

export interface Theme {
  id: string
  name: string
  tier: ThemeTier
  primary: string // Main accent color
  secondary: string // Secondary accent
  background: string // Main background
  foreground: string // Main text color
  card: string // Card background
  cardForeground: string // Card text color
  description: string
}

// Free themes - 5 basic themes including default
export const freeThemes: Theme[] = [
  {
    id: "default",
    name: "Default Dark",
    tier: "free",
    primary: "84 100% 65%", // Neon green
    secondary: "84 60% 45%",
    background: "0 0% 5%", // Very dark
    foreground: "0 0% 98%", // Almost white text
    card: "0 0% 10%",
    cardForeground: "0 0% 98%",
    description: "Original neon green theme",
  },
  {
    id: "light-mode",
    name: "Light Mode",
    tier: "free",
    primary: "210 70% 50%", // Blue accent
    secondary: "210 50% 70%",
    background: "0 0% 100%", // White
    foreground: "0 0% 10%", // Dark text
    card: "0 0% 95%",
    cardForeground: "0 0% 10%",
    description: "Clean light theme",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    tier: "free",
    primary: "210 80% 55%", // Bright blue
    secondary: "200 60% 45%",
    background: "215 30% 15%", // Dark blue-gray
    foreground: "210 40% 98%", // Light blue-white
    card: "215 25% 20%",
    cardForeground: "210 40% 98%",
    description: "Calm blue tones",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    tier: "free",
    primary: "140 60% 50%", // Bright green
    secondary: "130 50% 40%",
    background: "140 20% 12%", // Dark green-gray
    foreground: "140 30% 95%", // Light greenish-white
    card: "140 20% 18%",
    cardForeground: "140 30% 95%",
    description: "Natural green theme",
  },
  {
    id: "pink-blossom",
    name: "Pink Blossom",
    tier: "free",
    primary: "330 75% 65%", // Soft pink
    secondary: "340 65% 55%", // Rose pink
    background: "330 15% 96%", // Very light pink-white
    foreground: "330 30% 15%", // Dark pink-gray text
    card: "330 20% 92%",
    cardForeground: "330 30% 15%",
    description: "Soft pink light theme",
  },
]

// Premium themes - 5 more sophisticated themes
export const premiumThemes: Theme[] = [
  {
    id: "neon-tech",
    name: "Neon Tech",
    tier: "premium",
    primary: "180 100% 50%", // Cyan neon
    secondary: "280 80% 60%", // Purple accent
    background: "0 0% 8%",
    foreground: "180 100% 95%",
    card: "0 0% 12%",
    cardForeground: "180 100% 95%",
    description: "Cyberpunk neon aesthetic",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    tier: "premium",
    primary: "25 95% 60%", // Bright orange
    secondary: "10 90% 55%", // Red-orange
    background: "25 30% 12%",
    foreground: "25 40% 98%",
    card: "25 25% 18%",
    cardForeground: "25 40% 98%",
    description: "Warm sunset gradient",
  },
  {
    id: "purple-haze",
    name: "Purple Haze",
    tier: "premium",
    primary: "270 80% 65%", // Bright purple
    secondary: "290 70% 55%",
    background: "270 30% 12%",
    foreground: "270 30% 98%",
    card: "270 25% 18%",
    cardForeground: "270 30% 98%",
    description: "Rich purple tones",
  },
  {
    id: "cyber-pink",
    name: "Cyber Pink",
    tier: "premium",
    primary: "330 85% 65%", // Hot pink
    secondary: "200 80% 60%", // Cyan
    background: "330 20% 10%",
    foreground: "330 30% 98%",
    card: "330 15% 15%",
    cardForeground: "330 30% 98%",
    description: "Cyberpunk vibes",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    tier: "premium",
    primary: "160 70% 55%", // Bright mint
    secondary: "180 60% 50%",
    background: "160 25% 12%",
    foreground: "160 30% 98%",
    card: "160 20% 18%",
    cardForeground: "160 30% 98%",
    description: "Cool mint aesthetic",
  },
]

// Pro themes - 5 premium quality themes
export const proThemes: Theme[] = [
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    tier: "pro",
    primary: "180 85% 55%", // Cyan-teal
    secondary: "280 75% 60%", // Purple
    background: "200 30% 10%",
    foreground: "180 40% 98%",
    card: "200 25% 15%",
    cardForeground: "180 40% 98%",
    description: "Northern lights inspired",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    tier: "pro",
    primary: "45 95% 65%", // Bright gold
    secondary: "35 90% 60%", // Orange-gold
    background: "40 25% 12%",
    foreground: "45 30% 98%",
    card: "40 20% 18%",
    cardForeground: "45 30% 98%",
    description: "Warm golden gradient",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    tier: "pro",
    primary: "200 85% 50%", // Deep blue
    secondary: "220 75% 45%",
    background: "210 40% 8%",
    foreground: "200 30% 98%",
    card: "210 35% 12%",
    cardForeground: "200 30% 98%",
    description: "Mysterious ocean depths",
  },
  {
    id: "lavender-dreams",
    name: "Lavender Dreams",
    tier: "pro",
    primary: "280 70% 70%", // Light lavender
    secondary: "260 60% 65%",
    background: "270 25% 12%",
    foreground: "280 20% 98%",
    card: "270 20% 18%",
    cardForeground: "280 20% 98%",
    description: "Soft lavender gradient",
  },
  {
    id: "fire-ember",
    name: "Fire & Ember",
    tier: "pro",
    primary: "15 95% 65%", // Bright red-orange
    secondary: "0 90% 60%", // Red
    background: "10 30% 10%",
    foreground: "15 30% 98%",
    card: "10 25% 15%",
    cardForeground: "15 30% 98%",
    description: "Fiery red and orange",
  },
]

export const allThemes = [...freeThemes, ...premiumThemes, ...proThemes]

export function getThemesByTier(userPlan: string): Theme[] {
  const plan = (userPlan || "free").toLowerCase().trim()

  console.log("[v0] getThemesByTier - Input plan:", userPlan, "| Normalized:", plan)

  if (plan === "pro") {
    console.log("[v0] Returning ALL themes (Free + Premium + Pro) = ", allThemes.length, "themes")
    return allThemes
  } else if (plan === "premium") {
    const themes = [...freeThemes, ...premiumThemes]
    console.log("[v0] Returning Free + Premium themes =", themes.length, "themes")
    return themes
  } else {
    console.log("[v0] Returning Free themes only =", freeThemes.length, "themes")
    return freeThemes
  }
}

export function canUseCustomTheme(userPlan: string): boolean {
  return userPlan.toLowerCase().trim() === "pro"
}

function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  // Convert to HSL format for CSS variables (H S% L%)
  const hDeg = Math.round(h * 360)
  const sPercent = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  return `${hDeg} ${sPercent}% ${lPercent}%`
}

export function applyTheme(themeId: string, customPrimary?: string, customSecondary?: string) {
  const root = document.documentElement

  console.log("[v0] Applying theme:", themeId, customPrimary, customSecondary)

  if (themeId === "custom" && customPrimary && customSecondary) {
    const primaryHSL = customPrimary.startsWith("#") ? hexToHSL(customPrimary) : customPrimary
    const secondaryHSL = customSecondary.startsWith("#") ? hexToHSL(customSecondary) : customSecondary

    console.log("[v0] Custom colors converted to HSL:", primaryHSL, secondaryHSL)

    root.style.setProperty("--primary", primaryHSL)
    root.style.setProperty("--accent", primaryHSL)
    root.style.setProperty("--secondary", secondaryHSL)
    root.style.setProperty("--muted", secondaryHSL)
    root.style.setProperty("--background", "0 0% 8%")
    root.style.setProperty("--foreground", "0 0% 98%")
    root.style.setProperty("--card", "0 0% 12%")
    root.style.setProperty("--card-foreground", "0 0% 98%")

    localStorage.setItem("theme", "custom")
    localStorage.setItem("customPrimary", customPrimary)
    localStorage.setItem("customSecondary", customSecondary)
    return
  }

  const theme = allThemes.find((t) => t.id === themeId)
  if (!theme) {
    console.warn("[v0] Theme not found:", themeId)
    return
  }

  root.style.setProperty("--primary", theme.primary)
  root.style.setProperty("--accent", theme.primary)
  root.style.setProperty("--secondary", theme.secondary)
  root.style.setProperty("--muted", theme.secondary)
  root.style.setProperty("--background", theme.background)
  root.style.setProperty("--foreground", theme.foreground)
  root.style.setProperty("--card", theme.card)
  root.style.setProperty("--card-foreground", theme.cardForeground)

  localStorage.setItem("theme", themeId)
}
