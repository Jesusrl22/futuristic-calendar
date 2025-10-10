import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Cookie, Shield, Eye, FileText } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-white hover:text-purple-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Cookie className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Cookies</h1>
          <p className="text-slate-300 text-lg">Última actualización: 10 de enero de 2025</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                ¿Qué son las cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio
                web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y para
                proporcionar información a los propietarios del sitio.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Cookies que utilizamos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">1. Cookies Esenciales</h3>
                <p>
                  Estas cookies son necesarias para que el sitio web funcione correctamente. No se pueden desactivar en
                  nuestros sistemas.
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Cookies de sesión de autenticación</li>
                  <li>Cookies de preferencias de idioma</li>
                  <li>Cookies de seguridad</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">2. Cookies de Rendimiento</h3>
                <p>
                  Estas cookies nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar el
                  rendimiento de nuestro sitio.
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Google Analytics (_ga, _gid, _gat)</li>
                  <li>Cookies de análisis de Vercel</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">3. Cookies Funcionales</h3>
                <p>
                  Estas cookies permiten que el sitio web proporcione una funcionalidad y personalización mejoradas.
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Preferencias de tema (claro/oscuro)</li>
                  <li>Configuraciones de usuario</li>
                  <li>Estado del banner de cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">4. Cookies de Terceros</h3>
                <p>Utilizamos servicios de terceros que pueden establecer cookies:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Supabase (autenticación y base de datos)</li>
                  <li>Google Analytics (análisis web)</li>
                  <li>PayPal (procesamiento de pagos)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Control de cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya están en
                tu dispositivo y puedes configurar la mayoría de los navegadores para evitar que se coloquen.
              </p>

              <div>
                <h3 className="font-semibold text-white mb-2">Cómo gestionar cookies en tu navegador:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
                  </li>
                  <li>
                    <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web
                  </li>
                  <li>
                    <strong>Edge:</strong> Configuración → Cookies y permisos del sitio → Cookies y datos del sitio
                  </li>
                </ul>
              </div>

              <p className="text-yellow-400 text-sm">
                ⚠️ Ten en cuenta que si desactivas las cookies, es posible que algunas funciones del sitio web no
                funcionen correctamente.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Duración de las cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Cookies de sesión</h3>
                <p>Se eliminan automáticamente cuando cierras el navegador.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Cookies persistentes</h3>
                <p>
                  Permanecen en tu dispositivo durante un período específico (generalmente entre 1 mes y 2 años) o hasta
                  que las elimines manualmente.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Actualizaciones de esta política</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies que
                utilizamos o por otras razones operativas, legales o reglamentarias. Te recomendamos que revises esta
                página regularmente para estar informado sobre nuestro uso de cookies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Contacto</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>Si tienes preguntas sobre nuestra Política de Cookies, puedes contactarnos:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Por email:{" "}
                  <a href="mailto:privacy@future-task.com" className="text-purple-400 hover:text-purple-300">
                    privacy@future-task.com
                  </a>
                </li>
                <li>
                  A través de nuestra página de{" "}
                  <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                    contacto
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 pt-8">
            <Link href="/privacy">
              <Button
                variant="outline"
                className="border-purple-500/50 text-white hover:bg-purple-500/10 bg-transparent"
              >
                Política de Privacidad
              </Button>
            </Link>
            <Link href="/terms">
              <Button
                variant="outline"
                className="border-purple-500/50 text-white hover:bg-purple-500/10 bg-transparent"
              >
                Términos de Servicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
