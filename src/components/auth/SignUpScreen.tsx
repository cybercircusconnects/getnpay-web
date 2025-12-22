"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { OutlinedInput } from "@/components/ui/outlined-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { authApi, getErrorMessage } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations";
import { ENV } from "@/lib/config/env";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const GoogleLogin = dynamic(
  () => import("@react-oauth/google").then((mod) => mod.GoogleLogin),
  { ssr: false }
);

export function SignUpScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      if (!values.phone) {
        setError("phone", {
          type: "manual",
          message: "Phone number is required",
        });
        setIsLoading(false);
        return;
      }

      if (!isValidPhoneNumber(values.phone)) {
        setError("phone", {
          type: "manual",
          message: "Please enter a valid phone number for the selected country",
        });
        setIsLoading(false);
        return;
      }

      const phoneLength = values.phone.replace(/\+/, "").length;
      if (phoneLength < 7 || phoneLength > 15) {
        setError("phone", {
          type: "manual",
          message: "Phone number must be 7-15 digits total",
        });
        setIsLoading(false);
        return;
      }

      const result = await authApi.signUp({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      apiClient.setToken(result.accessToken);
      toast.success("Account created. Verify your email");

      router.push(
        `/verify-email-otp?email=${encodeURIComponent(
          values.email
        )}&isNewUser=true&from=signup`
      );
    } catch (error) {
      const message = getErrorMessage(error, "Sign up failed");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    setIsGoogleLoading(true);
    try {
      if (!credentialResponse.credential) {
        throw new Error("Failed to get Google ID token");
      }

      const result = await authApi.signInWithGoogle({
        idToken: credentialResponse.credential,
      });
      apiClient.setToken(result.accessToken);
      setUser(result.user);
      toast.success("Signed in successfully");

      if (!result.user.role) {
        router.push("/select-role");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Google sign in failed"));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSignInError = () => {
    toast.error("Google sign in failed");
    setIsGoogleLoading(false);
  };

  const googleLoginRef = useRef<HTMLDivElement>(null);

  const handleGoogleSignIn = () => {
    if (!isMounted) return;
    const hiddenButton =
      googleLoginRef.current?.querySelector<HTMLElement>('div[role="button"]');
    if (hiddenButton) {
      hiddenButton.click();
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Sign-Up to continue
        </h1>
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
            errorMessage={
              touchedFields.name && errors.name
                ? errors.name.message
                : undefined
            }
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
            errorMessage={
              touchedFields.email && errors.email
                ? errors.email.message
                : undefined
            }
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            {...register("email")}
          />
        </div>

        <div>
          <PhoneInput
            value={watch("phone") || ""}
            onChange={(value) => {
              setValue("phone", value || "", { shouldValidate: true });
              clearErrors("phone");
            }}
            onBlur={() => {
              if (!watch("phone")) {
                setError("phone", {
                  type: "manual",
                  message: "Phone number is required",
                });
              }
            }}
            onFocus={() => {
              clearErrors("phone");
            }}
            label="Phone Number"
            placeholder="Enter your phone number"
            error={!!errors.phone}
            touched={touchedFields.phone}
            required={true}
            errorMessage={
              touchedFields.phone && errors.phone
                ? errors.phone.message
                : undefined
            }
          />
        </div>

        <div>
          <OutlinedInput
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            error={!!errors.password}
            touched={
              touchedFields.password ||
              !!(passwordValue && passwordValue.length > 0)
            }
            required={true}
            errorMessage={errors.password ? errors.password.message : undefined}
            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed"
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
        {isMounted &&
          ENV.GOOGLE_CLIENT_ID &&
          ENV.GOOGLE_CLIENT_ID.trim() !== "" && (
            <div ref={googleLoginRef} className="hidden">
              <GoogleLogin
                onSuccess={handleGoogleSignInSuccess}
                onError={handleGoogleSignInError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
          )}
        <SocialLoginButton
          provider="google"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading || !isMounted}
        />
      </div>
    </div>
  );
}
