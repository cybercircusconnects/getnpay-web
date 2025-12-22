"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ENV } from "@/lib/config/env";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface GoogleOAuthProviderWrapperProps {
  children: ReactNode;
}

export function GoogleOAuthProviderWrapper({
  children,
}: GoogleOAuthProviderWrapperProps) {
  const [clientId, setClientId] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const id = ENV.GOOGLE_CLIENT_ID || "";
    setClientId(id);
    if (id && id.trim() !== "") {
      setIsReady(true);
    }
  }, []);

  if (!isReady || !clientId || clientId.trim() === "") {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
