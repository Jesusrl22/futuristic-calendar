import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Política de Cookies - FutureTask",
  description: "Información sobre cómo utilizamos las cookies en FutureTask",
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-white hover:text-purple-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white">Política de Cookies</CardTitle>
            <p className="text-center text-gray-400">Última actualización: 1 de enero de 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">1. ¿Qué son las cookies?</h2>
                <p className="leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio
                  web. Nos ayudan a proporcionar una mejor experiencia al recordar tus preferencias y entender cómo
                  utilizas nuestro servicio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">2. Tipos de cookies que utilizamos</h2>

                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">2.1. Cookies Esenciales</h3>
                    <p className="leading-relaxed">
                      Estas cookies son necesarias para el funcionamiento básico del sitio web. Incluyen:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Autenticación de sesión</li>
                      <li>Preferencias de tema (modo oscuro/claro)</li>
                      <li>Configuración de idioma</li>
                      <li>Seguridad y prevención de fraude</li>
                    </ul>
                    <p className="mt-2 text-sm italic">
                      Estas cookies no pueden ser desactivadas ya que el sitio no funcionaría correctamente sin ellas.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.2. Cookies de Rendimiento</h3>
                    <p className="leading-relaxed">
                      Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Google Analytics - Estadísticas de uso anónimas</li>
                      <li>Tiempo de carga de páginas</li>
                      <li>Rutas de navegación</li>
                      <li>Errores técnicos</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-2">2.3. Cookies Funcionales</h3>
                    <p className="leading-relaxed">Mejoran la funcionalidad y personalización:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Recordar preferencias de usuario</li>
                      <li>Configuración de notificaciones</li>
                      <li>Preferencias de visualización</li>
                      <li>Estado de sesión del temporizador Pomodoro</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">2.4. Cookies de Marketing</h3>
                    <p className="leading-relaxed">Utilizadas para mostrar anuncios relevantes:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Seguimiento de conversiones</li>
                      <li>Anuncios personalizados</li>
                      <li>Retargeting</li>
                      <li>Análisis de campañas publicitarias</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">3. Cookies de terceros</h2>
                <p className="leading-relaxed mb-3">Utilizamos servicios de terceros que pueden establecer cookies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Google Analytics:</strong> Para analizar el uso del sitio web
                  </li>
                  <li>
                    <strong>Vercel Analytics:</strong> Para métricas de rendimiento
                  </li>
                  <li>
                    <strong>PayPal:</strong> Para procesar pagos de manera segura
                  </li>
                  <li>
                    <strong>Supabase:</strong> Para autenticación y almacenamiento de datos
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">4. Duración de las cookies</h2>
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
                  <ul className="space-y-2">
                    <li>
                      <strong>Cookies de sesión:</strong> Se eliminan cuando cierras el navegador
                    </li>
                    <li>
                      <strong>Cookies persistentes:</strong> Permanecen hasta 1 año o hasta que las elimines manualmente
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">5. Gestión de cookies</h2>
                <p className="leading-relaxed mb-3">Puedes controlar y gestionar las cookies de varias maneras:</p>

                <div className="space-y-3">
                  <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/20">
                    <h3 className="font-semibold text-cyan-300 mb-2">Banner de cookies</h3>
                    <p className="text-sm">
                      Al visitar nuestro sitio por primera vez, verás un banner donde puedes aceptar o rechazar las
                      cookies no esenciales.
                    </p>
                  </div>

                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-300 mb-2">Configuración del navegador</h3>
                    <p className="text-sm mb-2">Puedes configurar tu navegador para:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Bloquear todas las cookies</li>
                      <li>Aceptar solo cookies de sitios de confianza</li>
                      <li>Eliminar cookies al cerrar el navegador</li>
                      <li>Recibir una notificación antes de que se establezca una cookie</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-300 mb-2">Herramientas de privacidad</h3>
                    <p className="text-sm">
                      Puedes usar extensiones del navegador como Privacy Badger, uBlock Origin o Ghostery para gestionar
                      cookies y rastreadores.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">6. Consecuencias de deshabilitar cookies</h2>
                <p className="leading-relaxed mb-3">Si deshabilitas ciertas cookies, es posible que experimentes:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Dificultad para iniciar sesión</li>
                  <li>Pérdida de preferencias personalizadas</li>
                  <li>Funcionalidad limitada del sitio</li>
                  <li>Necesidad de volver a introducir información repetidamente</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">7. Actualizaciones de esta política</h2>
                <p className="leading-relaxed">
                  Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en nuestras prácticas
                  o por razones legales. Te notificaremos de cualquier cambio material publicando la nueva política en
                  esta página con una fecha de "Última actualización" actualizada.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">8. Más información</h2>
                <p className="leading-relaxed mb-3">
                  Para obtener más información sobre cómo protegemos tus datos personales, consulta nuestra{" "}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-white">9. Contacto</h2>
                <p className="leading-relaxed mb-3">Si tienes preguntas sobre esta Política de Cookies, contáctanos:</p>
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
                  <p className="mb-1">
                    <strong className="text-purple-300">Email:</strong>{" "}
                    <a href="mailto:privacy@future-task.com" className="text-cyan-400 hover:text-cyan-300">
                      privacy@future-task.com
                    </a>
                  </p>
                  <p className="mb-1">
                    <strong className="text-purple-300">Web:</strong>{" "}
                    <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">
                      Formulario de contacto
                    </Link>
                  </p>
                  <p>
                    <strong className="text-purple-300">Dirección:</strong> FutureTask Inc., Madrid, España
                  </p>
                </div>
              </section>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/30">
                <p className="text-center text-sm">
                  Al continuar usando FutureTask, aceptas nuestra Política de Cookies y el uso de cookies según se
                  describe en este documento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
