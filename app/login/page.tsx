import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { SignInScreen } from "@/components/auth/SignInScreen"

export default function LoginPage() {
  return (
    <AuthWrapper>
      <SignInScreen />
    </AuthWrapper>
  )
}
