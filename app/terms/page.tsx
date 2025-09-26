import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using FutureTask ("the Service"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  FutureTask is a productivity application that provides task management, time tracking, note-taking,
                  and other productivity features. The service is provided "as is" and we reserve the right to modify or
                  discontinue the service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of the Service, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
                <p className="text-gray-700 leading-relaxed">You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Use the Service for commercial purposes without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by FutureTask and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. User Content</h2>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of any content you submit to the Service. By submitting content, you grant us a
                  worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in
                  connection with the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                  Service, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Subscription and Payments</h2>
                <p className="text-gray-700 leading-relaxed">
                  Some features of the Service may require a paid subscription. By purchasing a subscription, you agree
                  to pay all applicable fees. Subscriptions automatically renew unless cancelled before the renewal
                  date.
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>All fees are non-refundable unless required by law</li>
                  <li>We may change subscription fees with 30 days notice</li>
                  <li>You can cancel your subscription at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice,
                  for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Disclaimers</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Service is provided "as is" without warranties of any kind. We disclaim all warranties, express or
                  implied, including but not limited to warranties of merchantability, fitness for a particular purpose,
                  and non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall FutureTask be liable for any indirect, incidental, special, consequential, or
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                  intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">12. Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless FutureTask and its officers, directors, employees,
                  and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt
                  arising from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">13. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which FutureTask
                  operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">14. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes
                  by posting the new Terms of Service on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">15. Severability</h2>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will
                  remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">16. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p>
                    <strong>Email:</strong> legal@futuretask.com
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Legal Street, Terms City, TC 12345
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
