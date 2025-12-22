import { z } from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"
import {
  STRONG_PASSWORD_REGEX,
  OTP_CODE_REGEX,
  OTP_CODE_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from "@/lib/constants/auth.constants"

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
  rememberMe: z.boolean().default(false),
})

export const signUpSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
    .max(MAX_NAME_LENGTH, `Name must not exceed ${MAX_NAME_LENGTH} characters`),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .refine(
      (val) => STRONG_PASSWORD_REGEX.test(val),
      { message: "Use uppercase, lowercase, number, and symbol" }
    ),
  phone: z.string()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        if (!val || !val.startsWith("+")) {
          return false;
        }
        try {
          return isValidPhoneNumber(val);
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid phone number for the selected country" }
    )
    .refine(
      (val) => {
        if (!val) return false;
        const phoneLength = val.replace(/\+/, "").length;
        return phoneLength >= 7 && phoneLength <= 15;
      },
      { message: "Phone number must be 7-15 digits total" }
    ),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

export const verifyEmailSchema = z.object({
  code: z.string()
    .min(1, "Verification code is required")
    .length(OTP_CODE_LENGTH, `Code must be ${OTP_CODE_LENGTH} digits`)
    .regex(OTP_CODE_REGEX, `Verification code must be ${OTP_CODE_LENGTH} digits`),
})

export const emailLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

export const verifyEmailOtpSchema = (isNewUser: boolean) =>
  z.object({
    code: z.string()
      .min(1, "Verification code is required")
      .length(OTP_CODE_LENGTH, `Code must be ${OTP_CODE_LENGTH} digits`)
      .regex(OTP_CODE_REGEX, `Verification code must be ${OTP_CODE_LENGTH} digits`),
    name: isNewUser
      ? z.string()
          .min(1, "Name is required for new users")
          .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
          .max(MAX_NAME_LENGTH, `Name must not exceed ${MAX_NAME_LENGTH} characters`)
      : z.string()
          .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
          .max(MAX_NAME_LENGTH, `Name must not exceed ${MAX_NAME_LENGTH} characters`)
          .optional(),
  })

export type SignInFormValues = z.infer<typeof signInSchema>
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>
export type EmailLoginFormValues = z.infer<typeof emailLoginSchema>
export type VerifyEmailOtpFormValues = z.infer<ReturnType<typeof verifyEmailOtpSchema>>
