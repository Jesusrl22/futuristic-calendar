import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, use our
                  services, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and email address</li>
                  <li>Account preferences and settings</li>
                  <li>Tasks, notes, and other content you create</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to improve user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except as described in this policy. We may share information:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>In connection with a business transfer</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                  is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and fulfill the
                  purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Portability of your data</li>
                  <li>Objection to processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to collect information about your browsing
                  activities. You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under 13. We do not knowingly collect personal information
                  from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. International Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure
                  appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any material changes by
                  posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this privacy policy or our practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p>
                    <strong>Email:</strong> privacy@futuretask.com
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Privacy Street, Data City, DC 12345
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
