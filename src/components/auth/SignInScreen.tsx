"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { OutlinedInput } from "@/components/ui/outlined-input";
import { Label } from "@/components/ui/label";
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import {
  authApi,
  isEmailVerificationError,
  getErrorMessage,
} from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";
import { signInSchema, type SignInFormValues } from "@/lib/validations";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export function SignInScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      const result = await authApi.signIn({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      apiClient.setToken(result.accessToken);
      setUser(result.user);
      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      if (isEmailVerificationError(error)) {
        router.push(
          `/verify-email?email=${encodeURIComponent(
            error.data?.email || values.email
          )}&from=signin`
        );
        toast.info("Verify your email");
      } else {
        const message = getErrorMessage(error, "Sign in failed");
        toast.error(message);
      }
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
      router.push("/dashboard");
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
          Sign-In to continue
        </h1>
        <AuthSwitchLink
          question="Don't have an account?"
          linkText="Sign-Up here"
          onClick={() => router.push("/signup")}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <OutlinedInput
            value={watch("email")}
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
          <OutlinedInput
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            error={!!errors.password}
            touched={touchedFields.password}
            required={true}
            errorMessage={
              touchedFields.password && errors.password
                ? errors.password.message
                : undefined
            }
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
                <Check className="absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none" />
              )}
            </div>
            <Label
              htmlFor="rememberMe"
              className="cursor-pointer text-sm text-foreground"
            >
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
          className="w-full h-11 rounded cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed"
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
        <SocialLoginButton
          provider="google"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        />
      </div>
    </div>
  );
}
