import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { SignUpScreen } from "@/components/auth/SignUpScreen"

export default function SignUpPage() {
  return (
    <AuthWrapper>
      <SignUpScreen />
    </AuthWrapper>
  )
}
