"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink"
import { SocialLoginButton } from "@/components/auth/SocialLoginButton"
import { authApi, isEmailVerificationError, getErrorMessage } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"
import { Mail, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react"
import { initializeGoogleAuth } from "@/lib/utils/google-auth"

const signInSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (values: SignInFormValues) => {
    setIsLoading(true)
    try {
      const result = await authApi.signIn({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      })

      apiClient.setToken(result.accessToken)
      setUser(result.user)
      toast.success("Signed in successfully")
      router.push("/dashboard")
    } catch (error) {
      if (isEmailVerificationError(error)) {
        router.push(`/verify-email?email=${encodeURIComponent(error.data?.email || values.email)}&from=signin`)
        toast.info("Verify your email")
      } else {
        const message = getErrorMessage(error, "Sign in failed")
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true)
    initializeGoogleAuth(
      async (idToken) => {
        try {
          const result = await authApi.signInWithGoogle({ idToken })
          apiClient.setToken(result.accessToken)
          setUser(result.user)
          toast.success("Signed in successfully")
          router.push("/dashboard")
        } catch (error) {
          toast.error(getErrorMessage(error, "Google sign in failed"))
        } finally {
          setIsGoogleLoading(false)
        }
      },
      (error) => {
        toast.error(error)
        setIsGoogleLoading(false)
      }
    )
  }

  const handleEmailLogin = () => {
    router.push("/email-login")
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Sign-In to continue</h1>
        <AuthSwitchLink
          question="Don't have an account?"
          linkText="Sign-Up here"
            onClick={() => router.push("/signup")}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-10 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setValue("rememberMe", e.target.checked)}
                className={`h-5 w-5 cursor-pointer rounded border-2 appearance-none ${
                  rememberMe
                    ? "border-green-600 bg-green-600"
                    : "border-gray-300 bg-background"
                } focus:ring-green-600`}
              />
              {rememberMe && (
                <Check className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none" />
              )}
            </div>
            <Label htmlFor="rememberMe" className="cursor-pointer text-sm text-gray-700">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="cursor-pointer text-xs font-semibold text-green-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <div className="space-y-4">
        <SocialLoginButton
          provider="google"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        />
        <SocialLoginButton
          provider="email"
          onClick={handleEmailLogin}
          disabled={isLoading || isGoogleLoading}
        />
      </div>
    </div>
  )
}

