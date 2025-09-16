import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-500" />
          <p className="text-gray-600">Loading verification page...</p>
        </CardContent>
      </Card>
    </div>
  )
}
