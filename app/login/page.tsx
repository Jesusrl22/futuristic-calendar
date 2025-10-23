"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Sparkles, ArrowLeft, Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/useLanguage"
import Link from "next/link"

const TRANSLATIONS = {
  es: {
    backToWeb: "Volver a la web",
    welcome: "Bienvenido de vuelta",
    createAccount: "Crea tu cuenta",
    loginDesc: "Ingresa tus credenciales para acceder",
    signupDesc: "Completa el formulario para comenzar",
    email: "Correo electrónico",
    password: "Contraseña",
    name: "Nombre completo",
    login: "Iniciar sesión",
    signup: "Registrarse",
    loggingIn: "Iniciando sesión...",
    signingUp: "Registrando...",
    demoMode: "Modo Demo",
    demoDesc: "Prueba sin registrarte",
    tryDemo: "Probar Demo",
    language: "Idioma",
  },
  en: {
    backToWeb: "Back to website",
    welcome: "Welcome back",
    createAccount: "Create your account",
    loginDesc: "Enter your credentials to access",
    signupDesc: "Complete the form to get started",
    email: "Email",
    password: "Password",
    name: "Full name",
    login: "Login",
    signup: "Sign up",
    loggingIn: "Logging in...",
    signingUp: "Signing up...",
    demoMode: "Demo Mode",
    demoDesc: "Try without registration",
    tryDemo: "Try Demo",
    language: "Language",
  },
  fr: {
    backToWeb: "Retour au site",
    welcome: "Bon retour",
    createAccount: "Créez votre compte",
    loginDesc: "Entrez vos identifiants pour accéder",
    signupDesc: "Remplissez le formulaire pour commencer",
    email: "Email",
    password: "Mot de passe",
    name: "Nom complet",
    login: "Se connecter",
    signup: "S'inscrire",
    loggingIn: "Connexion...",
    signingUp: "Inscription...",
    demoMode: "Mode Démo",
    demoDesc: "Essayez sans inscription",
    tryDemo: "Essayer la démo",
    language: "Langue",
  },
  de: {
    backToWeb: "Zurück zur Website",
    welcome: "Willkommen zurück",
    createAccount: "Erstellen Sie Ihr Konto",
    loginDesc: "Geben Sie Ihre Anmeldedaten ein",
    signupDesc: "Füllen Sie das Formular aus",
    email: "E-Mail",
    password: "Passwort",
    name: "Vollständiger Name",
    login: "Anmelden",
    signup: "Registrieren",
    loggingIn: "Anmeldung...",
    signingUp: "Registrierung...",
    demoMode: "Demo-Modus",
    demoDesc: "Ohne Registrierung testen",
    tryDemo: "Demo testen",
    language: "Sprache",
  },
  it: {
    backToWeb: "Torna al sito",
    welcome: "Bentornato",
    createAccount: "Crea il tuo account",
    loginDesc: "Inserisci le tue credenziali",
    signupDesc: "Completa il modulo per iniziare",
    email: "Email",
    password: "Password",
    name: "Nome completo",
    login: "Accedi",
    signup: "Registrati",
    loggingIn: "Accesso in corso...",
    signingUp: "Registrazione...",
    demoMode: "Modalità Demo",
    demoDesc: "Prova senza registrazione",
    tryDemo: "Prova Demo",
    language: "Lingua",
  },
  pt: {
    backToWeb: "Voltar ao site",
    welcome: "Bem-vindo de volta",
    createAccount: "Crie sua conta",
    loginDesc: "Digite suas credenciais para acessar",
    signupDesc: "Preencha o formulário para começar",
    email: "Email",
    password: "Senha",
    name: "Nome completo",
    login: "Entrar",
    signup: "Cadastrar",
    loggingIn: "Entrando...",
    signingUp: "Cadastrando...",
    demoMode: "Modo Demo",
    demoDesc: "Experimente sem cadastro",
    tryDemo: "Experimentar Demo",
    language: "Idioma",
  },
}

const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
]

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" })

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: "✅ Success",
          description: "Logged in successfully",
        })
        router.push("/app")
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: signupData.email,
          name: signupData.name,
          subscription_tier: "free",
        })

        if (insertError) throw insertError

        toast({
          title: "✅ Success",
          description: "Account created successfully",
        })
        router.push("/app")
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = () => {
    localStorage.setItem("demoMode", "true")
    toast({
      title: "🎉 Demo Mode",
      description: "Exploring in demo mode",
    })
    router.push("/app")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <Link href="/">
          <Button variant="ghost" className="glass-effect text-white hover:bg-white/10 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToWeb}
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">FutureTask</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-white" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px] glass-effect text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="glass-card border-white/20">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                {t.login}
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                {t.signup}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{t.welcome}</CardTitle>
                <CardDescription className="text-white/70">{t.loginDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">
                      {t.email}
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="glass-effect text-white placeholder:text-white/50 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">
                      {t.password}
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="glass-effect text-white placeholder:text-white/50 border-white/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full btn-gradient">
                    {isLoading ? t.loggingIn : t.login}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{t.createAccount}</CardTitle>
                <CardDescription className="text-white/70">{t.signupDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">
                      {t.name}
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                      className="glass-effect text-white placeholder:text-white/50 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">
                      {t.email}
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="glass-effect text-white placeholder:text-white/50 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">
                      {t.password}
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        className="glass-effect text-white placeholder:text-white/50 border-white/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full btn-gradient">
                    {isLoading ? t.signingUp : t.signup}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t.demoMode}
            </CardTitle>
            <CardDescription className="text-white/70">{t.demoDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDemo}
              variant="outline"
              className="w-full glass-effect text-white border-white/20 bg-transparent"
            >
              {t.tryDemo}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
