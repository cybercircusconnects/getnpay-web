"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { OutlinedInput } from "@/components/ui/outlined-input"
import { authApi, getErrorMessage } from "@/lib/api/auth"
import { emailLoginSchema, type EmailLoginFormValues } from "@/lib/validations"
import { toast } from "sonner"
import { Mail, Loader2 } from "lucide-react"

export function EmailLoginScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: EmailLoginFormValues) => {
    setIsLoading(true)
    try {
      const result = await authApi.requestEmailOtp({ email: values.email })
      toast.success("OTP sent to your email")
      router.push(
        `/verify-email-otp?email=${encodeURIComponent(values.email)}&isNewUser=${result.isNewUser}`
      )
    } catch (error) {
      const message = getErrorMessage(error, "Failed to send OTP")
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Sign in with Email</h1>
        <p className="text-sm text-gray-500">
          Enter your email address and we'll send you a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <OutlinedInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={!!errors.email}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            {...register("email")}
          />
          {errors.email && <p className="mb-2 mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Proceed"
          )}
        </Button>
      </form>

      <div className="flex justify-center gap-1">
        <span className="text-sm text-gray-500">Want to use password? </span>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="cursor-pointer text-sm font-semibold text-green-600 hover:underline"
        >
          Sign in here
        </button>
      </div>
    </div>
  )
}

