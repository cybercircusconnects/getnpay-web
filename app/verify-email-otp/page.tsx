import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { VerifyEmailOtpScreen } from "@/components/auth/VerifyEmailOtpScreen"

export default function VerifyEmailOtpPage() {
  return (
    <AuthWrapper>
      <Suspense fallback={<div className="w-full space-y-8" />}>
        <VerifyEmailOtpScreen />
      </Suspense>
    </AuthWrapper>
  )
}
