"use client"

import { type ReactNode } from "react"
import { AuthHeader } from "./AuthHeader"

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-2/5 xl:w-2/5 items-center justify-center bg-primary">
        <AuthHeader />
      </div>
      <div className="flex flex-1 flex-col lg:w-3/5 xl:w-3/5">
        <div className="flex lg:hidden items-center justify-center bg-primary py-8">
          <AuthHeader />
        </div>
        <div className="flex flex-1 items-center justify-center bg-white px-4 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}

