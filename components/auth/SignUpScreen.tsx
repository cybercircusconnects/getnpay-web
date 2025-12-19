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
import { authApi, getErrorMessage } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { initializeGoogleAuth } from "@/lib/utils/google-auth"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true)
    try {
      const result = await authApi.signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      apiClient.setToken(result.accessToken)
      setUser(result.user)
      toast.success("Account created. Verify your email")
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}&from=signup`)
    } catch (error) {
      const message = getErrorMessage(error, "Sign up failed")
      toast.error(message)
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

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Sign-Up to continue</h1>
        <AuthSwitchLink
          question="Already have an account?"
          linkText="Sign-In here"
            onClick={() => router.push("/login")}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className="pl-10"
              {...register("name")}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

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

        <Button
          type="submit"
          className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        By registering, I agree to all{" "}
        <a href="#" className="font-semibold text-green-600 hover:underline">
          terms and conditions
        </a>
      </p>

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
      </div>
    </div>
  )
}

