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
  if (!ENV.GOOGLE_CLIENT_ID || ENV.GOOGLE_CLIENT_ID.trim() === "") {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
