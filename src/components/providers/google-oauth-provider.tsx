"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ENV } from "@/lib/config/env";
import type { ReactNode } from "react";

interface GoogleOAuthProviderWrapperProps {
  children: ReactNode;
}

export function GoogleOAuthProviderWrapper({
  children,
}: GoogleOAuthProviderWrapperProps) {
  const clientId = ENV.GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
