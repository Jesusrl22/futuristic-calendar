"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react"
import type { Language } from "@/types"

interface AuthScreenProps {
  onAuthSuccess: (userData: { name: string; email: string }) => void
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function AuthScreen({ onAuthSuccess, language, onLanguageChange }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { toast } = useToast()

  const languages = [
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
  ]

  const translations = {
    es: {
      appName: "FutureTask",
      welcome: "¡Bienvenido de vuelta!",
      createAccount: "Crear Cuenta",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      name: "Nombre completo",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      signInHere: "Inicia sesión aquí",
      signUpHere: "Regístrate aquí",
      continue: "Continuar",
      selectLanguage: "Seleccionar idioma",
      nameRequired: "El nombre es requerido",
      emailRequired: "El correo es requerido",
      emailInvalid: "Correo electrónico inválido",
      passwordRequired: "La contraseña es requerida",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
      passwordsNoMatch: "Las contraseñas no coinciden",
      loginSuccess: "¡Inicio de sesión exitoso!",
      signupSuccess: "¡Cuenta creada exitosamente!",
      subtitle: "Accede a tu espacio de productividad",
      createSubtitle: "Únete a miles de usuarios productivos",
    },
    en: {
      appName: "FutureTask",
      welcome: "Welcome back!",
      createAccount: "Create Account",
      signIn: "Sign In",
      signUp: "Sign Up",
      name: "Full name",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      signInHere: "Sign in here",
      signUpHere: "Sign up here",
      continue: "Continue",
      selectLanguage: "Select language",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 6 characters",
      passwordsNoMatch: "Passwords don't match",
      loginSuccess: "Login successful!",
      signupSuccess: "Account created successfully!",
      subtitle: "Access your productivity space",
      createSubtitle: "Join thousands of productive users",
    },
    fr: {
      appName: "FutureTask",
      welcome: "Bon retour !",
      createAccount: "Créer un Compte",
      signIn: "Se Connecter",
      signUp: "S'inscrire",
      name: "Nom complet",
      email: "Adresse e-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Pas de compte ?",
      hasAccount: "Déjà un compte ?",
      signInHere: "Connectez-vous ici",
      signUpHere: "Inscrivez-vous ici",
      continue: "Continuer",
      selectLanguage: "Sélectionner la langue",
      nameRequired: "Le nom est requis",
      emailRequired: "L'e-mail est requis",
      emailInvalid: "Adresse e-mail invalide",
      passwordRequired: "Le mot de passe est requis",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
      passwordsNoMatch: "Les mots de passe ne correspondent pas",
      loginSuccess: "Connexion réussie !",
      signupSuccess: "Compte créé avec succès !",
      subtitle: "Accédez à votre espace de productivité",
      createSubtitle: "Rejoignez des milliers d'utilisateurs productifs",
    },
    de: {
      appName: "FutureTask",
      welcome: "Willkommen zurück!",
      createAccount: "Konto Erstellen",
      signIn: "Anmelden",
      signUp: "Registrieren",
      name: "Vollständiger Name",
      email: "E-Mail-Adresse",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      forgotPassword: "Passwort vergessen?",
      noAccount: "Kein Konto?",
      hasAccount: "Bereits ein Konto?",
      signInHere: "Hier anmelden",
      signUpHere: "Hier registrieren",
      continue: "Weiter",
      selectLanguage: "Sprache auswählen",
      nameRequired: "Name ist erforderlich",
      emailRequired: "E-Mail ist erforderlich",
      emailInvalid: "Ungültige E-Mail-Adresse",
      passwordRequired: "Passwort ist erforderlich",
      passwordTooShort: "Passwort muss mindestens 6 Zeichen haben",
      passwordsNoMatch: "Passwörter stimmen nicht überein",
      loginSuccess: "Anmeldung erfolgreich!",
      signupSuccess: "Konto erfolgreich erstellt!",
      subtitle: "Zugang zu Ihrem Produktivitätsbereich",
      createSubtitle: "Schließen Sie sich Tausenden produktiver Nutzer an",
    },
    it: {
      appName: "FutureTask",
      welcome: "Bentornato!",
      createAccount: "Crea Account",
      signIn: "Accedi",
      signUp: "Registrati",
      name: "Nome completo",
      email: "Indirizzo email",
      password: "Password",
      confirmPassword: "Conferma password",
      forgotPassword: "Password dimenticata?",
      noAccount: "Non hai un account?",
      hasAccount: "Hai già un account?",
      signInHere: "Accedi qui",
      signUpHere: "Registrati qui",
      continue: "Continua",
      selectLanguage: "Seleziona lingua",
      nameRequired: "Il nome è richiesto",
      emailRequired: "L'email è richiesta",
      emailInvalid: "Indirizzo email non valido",
      passwordRequired: "La password è richiesta",
      passwordTooShort: "La password deve avere almeno 6 caratteri",
      passwordsNoMatch: "Le password non corrispondono",
      loginSuccess: "Accesso riuscito!",
      signupSuccess: "Account creato con successo!",
      subtitle: "Accedi al tuo spazio di produttività",
      createSubtitle: "Unisciti a migliaia di utenti produttivi",
    },
  }

  const t = translations[language]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = t.nameRequired
    }

    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordTooShort
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordsNoMatch
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: isLogin ? t.loginSuccess : t.signupSuccess,
        description: isLogin ? t.subtitle : t.createSubtitle,
      })

      onAuthSuccess({
        name: formData.name || formData.email.split("@")[0],
        email: formData.email,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-md bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.appName}</h1>
          </div>

          <div className="flex justify-center mb-4">
            <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
              <SelectTrigger className="w-40 bg-black/20 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-white/10">
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2 bg-black/20 border-purple-500/30">
              <TabsTrigger
                value="login"
                className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                {t.signIn}
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                {t.signUp}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">{t.welcome}</h2>
                <p className="text-purple-200 text-sm">{t.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400"
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white hover:bg-white/10"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Cargando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{t.continue}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button variant="link" className="text-purple-300 hover:text-white text-sm">
                  {t.forgotPassword}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">{t.createAccount}</h2>
                <p className="text-purple-200 text-sm">{t.createSubtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    {t.name}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400"
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white hover:bg-white/10"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">
                    {t.confirmPassword}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{t.createAccount}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthScreen
