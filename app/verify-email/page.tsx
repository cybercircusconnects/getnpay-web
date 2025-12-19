import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { VerifyEmailScreen } from "@/components/auth/VerifyEmailScreen"

export default function VerifyEmailPage() {
  return (
    <AuthWrapper>
      <Suspense fallback={<div className="w-full space-y-8" />}>
        <VerifyEmailScreen />
      </Suspense>
    </AuthWrapper>
  )
}
