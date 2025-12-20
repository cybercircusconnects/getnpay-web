"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authApi, type User } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"
import { getErrorMessage } from "@/lib/api/auth"
import { cookies } from "@/lib/utils/cookies"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signInWithGoogle: (idToken: string) => Promise<boolean>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = cookies.get("accessToken")
        if (token) {
          const storedUser = cookies.get("user")
          if (storedUser) {
            setUserState(JSON.parse(storedUser))
          } else {
            try {
              const currentUser = await authApi.getCurrentUser()
              setUserState(currentUser)
              cookies.set("user", JSON.stringify(currentUser), 7)
            } catch {
              cookies.remove("accessToken")
              cookies.remove("user")
            }
          }
        }
      } catch {
        cookies.remove("accessToken")
        cookies.remove("user")
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    const publicPaths = ["/signin", "/signup", "/forgot-password", "/verify-email", "/email-login", "/verify-email-otp", "/success"]
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))
    
    if (!isLoading && !user && !isPublicPath && pathname !== "/") {
      router.push("/signin")
    }
  }, [user, isLoading, pathname, router])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      cookies.set("user", JSON.stringify(newUser), 7)
    } else {
      cookies.remove("user")
    }
  }

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      const result = await authApi.signIn({ email, password, rememberMe })
      apiClient.setToken(result.accessToken)
      setUser(result.user)
      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const result = await authApi.signUp({ name, email, password })
      apiClient.setToken(result.accessToken)
      setUser(result.user)
      return true
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signInWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      const result = await authApi.signInWithGoogle({ idToken })
      apiClient.setToken(result.accessToken)
      setUser(result.user)
      return true
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const logout = () => {
    setUserState(null)
    apiClient.setToken(null)
    cookies.remove("accessToken")
    cookies.remove("user")
    router.push("/signin")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signUp, signInWithGoogle, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
