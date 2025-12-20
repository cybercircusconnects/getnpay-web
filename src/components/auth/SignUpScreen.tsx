"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { OutlinedInput } from "@/components/ui/outlined-input"
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink"
import { SocialLoginButton } from "@/components/auth/SocialLoginButton"
import { authApi, getErrorMessage } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import { signUpSchema, type SignUpFormValues } from "@/lib/validations"
import { toast } from "sonner"
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { initializeGoogleAuth } from "@/lib/utils/google-auth"

export function SignUpScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
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
            onClick={() => router.push("/signin")}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <OutlinedInput
            id="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
            error={!!errors.name}
            touched={touchedFields.name}
            required={true}
            errorMessage={touchedFields.name && errors.name ? errors.name.message : undefined}
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
            {...register("name")}
          />
        </div>

        <div>
          <OutlinedInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={!!errors.email}
            touched={touchedFields.email}
            required={true}
            errorMessage={touchedFields.email && errors.email ? errors.email.message : undefined}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            {...register("email")}
          />
        </div>

        <div>
          <OutlinedInput
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            error={!!errors.password}
            touched={touchedFields.password}
            required={true}
            errorMessage={touchedFields.password && errors.password ? errors.password.message : undefined}
            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed"
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

