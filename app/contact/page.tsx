import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export const metadata = {
  title: "Contact Us - Future Task",
  description: "Get in touch with the Future Task team",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">FT</span>
            </div>
            <span className="font-semibold text-lg">Future Task</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">Have questions or feedback? We'd love to hear from you.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Email Support</h2>
            <p className="text-muted-foreground mb-4">
              For general inquiries, support requests, or feedback, please email us at:
            </p>
            <a
              href="mailto:support@future-task.com"
              className="inline-flex items-center gap-2 text-xl font-semibold text-primary hover:underline"
            >
              <Mail className="w-5 h-5" />
              support@future-task.com
            </a>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              We typically respond within 24-48 hours during business days.
            </p>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Technical Support</h3>
            <p className="text-sm text-muted-foreground">
              Experiencing technical issues? Include details about your browser, device, and steps to reproduce the
              problem.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Billing Questions</h3>
            <p className="text-sm text-muted-foreground">
              For subscription, payment, or billing inquiries, please include your account email address.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Feature Requests</h3>
            <p className="text-sm text-muted-foreground">
              Have an idea for a new feature? We love hearing from our users about how we can improve.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Privacy & Data</h3>
            <p className="text-sm text-muted-foreground">
              Questions about data handling? Review our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              or contact us.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">© 2025 Future Task. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
