import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen"

export default function ForgotPasswordPage() {
  return (
    <AuthWrapper>
      <Suspense fallback={<div className="w-full space-y-8" />}>
        <ForgotPasswordScreen />
      </Suspense>
    </AuthWrapper>
  )
}
