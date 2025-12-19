"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OTPInput } from "@/components/auth/OTPInput"
import { authApi, getErrorMessage } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/context/auth-context"
import { maskEmail } from "@/lib/utils/email"
import { toast } from "sonner"
import { Mail, User, Loader2 } from "lucide-react"

const verifyEmailOtpSchema = (isNewUser: boolean) =>
  z.object({
    code: z.string().length(6, "Code must be 6 digits"),
    name: isNewUser ? z.string().min(2, "Name must be at least 2 characters") : z.string().optional(),
  })

type VerifyEmailOtpFormValues = z.infer<ReturnType<typeof verifyEmailOtpSchema>>

export function VerifyEmailOtpScreen() {
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()

  const email = searchParams.get("email") || ""
  const isNewUser = searchParams.get("isNewUser") === "true"

  const maskedEmail = maskEmail(email)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailOtpFormValues>({
    resolver: zodResolver(verifyEmailOtpSchema(isNewUser)),
    defaultValues: {
      code: "",
      name: "",
    },
  })

  const code = watch("code")
  const name = watch("name")

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
      await authApi.requestEmailOtp({ email })
      setCountdown(60)
      toast.success("OTP sent")
    } catch (error) {
      const message = getErrorMessage(error, "Failed to resend OTP")
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }, [countdown, email])

  const onSubmit = async (values: VerifyEmailOtpFormValues) => {
    setIsLoading(true)
    try {
      const result = await authApi.verifyEmailOtp({
        email,
        code: values.code,
        name: values.name,
      })

      apiClient.setToken(result.accessToken)
      setUser(result.user)
      toast.success("Signed in successfully")
      router.push("/dashboard")
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
          <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
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

        {isNewUser && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="pl-10"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
        )}

        <Button
          type="submit"
          className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed"
          disabled={code.length !== 6 || isLoading || (isNewUser && !name)}
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

