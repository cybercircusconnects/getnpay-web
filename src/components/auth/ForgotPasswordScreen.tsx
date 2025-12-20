"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { OutlinedInput } from "@/components/ui/outlined-input"
import { authApi, isEmailVerificationError, getErrorMessage } from "@/lib/api/auth"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations"
import { toast } from "sonner"
import { Mail, User, Loader2 } from "lucide-react"

export function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword({ email: values.email })
      setIsSuccess(true)
      toast.success("OTP sent")
    } catch (error) {
      if (isEmailVerificationError(error)) {
        router.push(`/verify-email?email=${encodeURIComponent(error.data?.email || values.email)}&from=signup`)
        toast.info("Verify your email first")
      } else {
        const message = getErrorMessage(error, "Failed to send OTP")
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">Forgot password</h1>
          <p className="text-sm text-gray-500">
            Enter your email to reset your password
          </p>
        </div>
      </div>

      {isSuccess ? (
        <div className="mb-4 rounded-xl bg-primary/10 p-4">
          <p className="text-center text-sm text-primary">
            Password reset code has been sent to your email. Please check your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      )}

      <div className="flex justify-center gap-1">
        <span className="text-sm text-gray-500">Remember your password? </span>
        <button
          type="button"
          onClick={() => router.push("/signin")}
          className="cursor-pointer text-sm font-semibold text-green-600 hover:underline"
        >
          Sign-In here
        </button>
      </div>
    </div>
  )
}

