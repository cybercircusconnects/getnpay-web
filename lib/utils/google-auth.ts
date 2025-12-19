import { ENV } from "../config/env"

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token: string }) => void
          }) => {
            requestAccessToken: () => void
          }
        }
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          prompt: () => void
        }
      }
    }
  }
}

export const initializeGoogleAuth = (onSuccess: (idToken: string) => void, onError: (error: string) => void) => {
  if (typeof window === "undefined" || !window.google) {
    onError("Google Sign-In is not available")
    return
  }

  if (!ENV.GOOGLE_CLIENT_ID) {
    onError("Google Client ID is not configured")
    return
  }

  try {
    window.google.accounts.id.initialize({
      client_id: ENV.GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential)
        } else {
          onError("Failed to get Google ID token")
        }
      },
    })

    window.google.accounts.id.prompt()
  } catch (error) {
    onError(error instanceof Error ? error.message : "Failed to initialize Google Sign-In")
  }
}

