"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/auth/OTPInput"
import { authApi, getErrorMessage } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/context/auth-context"
import { verifyEmailSchema, type VerifyEmailFormValues } from "@/lib/validations"
import { maskEmail } from "@/lib/utils/email"
import { toast } from "sonner"
import { Mail, Loader2 } from "lucide-react"

export function VerifyEmailScreen() {
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()

  const email = searchParams.get("email") || ""
  const from = searchParams.get("from") || "signup"

  const maskedEmail = maskEmail(email)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  })

  const code = watch("code")

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = useCallback(async () => {
    if (countdown > 0) return
    setIsResending(true)
    try {
      await authApi.resendCode({ email })
      setCountdown(60)
      toast.success("OTP sent")
    } catch (error) {
      const message = getErrorMessage(error, "Failed to resend OTP")
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }, [countdown, email])

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setIsLoading(true)
    try {
      const result = await authApi.verifyEmail({ code: values.code })

      if (from === "signin" && "user" in result && "accessToken" in result) {
        apiClient.setToken(result.accessToken)
        setUser(result.user)
        toast.success("Email verified")
        router.push("/dashboard")
      } else {
        toast.success("Email verified. Sign in now")
        router.push("/signin")
      }
    } catch (error) {
      const message = getErrorMessage(error, "Invalid OTP")
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <Mail className="h-12 w-12 text-gray-400" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">Verify account</h1>
          <p className="text-sm text-gray-500">
            Please input the 6-digit code that we have sent to your email.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-sm text-foreground">{maskedEmail}</span>
          <button
            type="button"
            onClick={() => router.back()}
            className="ml-2 cursor-pointer text-sm font-semibold text-green-600 hover:underline"
          >
            Not you?
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <OTPInput
          value={code}
          onChange={(value) => setValue("code", value)}
          error={errors.code?.message}
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed"
          disabled={code.length !== 6 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-1">
        <span className="text-sm text-gray-500">Didn't receive code? </span>
        {countdown > 0 ? (
          <span className="text-sm font-semibold text-green-600">
            Resend in {countdown} seconds
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="cursor-pointer text-sm font-semibold text-green-600 hover:underline disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </div>
  )
}

