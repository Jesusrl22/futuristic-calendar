// VERSIÓN 761 - Deploy forzado con cambios sustanciales
// Timestamp: 2025-01-03T12:00:00.000Z

export const DOMAIN_CONFIG = {
  name: "FutureTask",
  domain: process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://future-task.com",
  description: "El futuro de la productividad con IA - Versión 761",
  keywords: ["productividad", "tareas", "calendario", "IA", "organización"],
  author: "FutureTask Team",
  twitter: "@futuretask",
  social: {
    twitter: "@futuretask",
    github: "https://github.com/futuretask",
  },
  buildVersion: "761.0.0",
  buildDate: "2025-01-03T12:00:00.000Z",
  buildNumber: 761,
}

export const SEO_CONFIG = {
  title: "FutureTask - El Futuro de la Productividad",
  description:
    "Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial más avanzada",
  keywords: ["productividad", "tareas", "calendario", "IA", "organización", "gestión del tiempo"],
  author: "FutureTask Team",
  openGraph: {
    title: "FutureTask - El Futuro de la Productividad",
    description:
      "Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial más avanzada",
    type: "website" as const,
    locale: "es_ES",
    siteName: "FutureTask",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "FutureTask - El Futuro de la Productividad",
    description:
      "Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial más avanzada",
    creator: "@futuretask",
  },
}

export function getDomainConfig() {
  console.log("🔧 [v761] Domain config loaded:", DOMAIN_CONFIG.buildVersion)
  return DOMAIN_CONFIG
}

export function getSEOConfig() {
  return SEO_CONFIG
}
