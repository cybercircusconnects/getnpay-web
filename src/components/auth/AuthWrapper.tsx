"use client"

import { type ReactNode } from "react"
import { AuthHeader } from "./AuthHeader"

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="flex min-h-screen">
      <div 
        className="hidden lg:flex lg:w-1/2 xl:w-1/2 items-center justify-center"
        style={{
          backgroundImage: 'url(/assets/common/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <AuthHeader />
      </div>
      <div className="flex flex-1 flex-col lg:w-1/2 xl:w-1/2">
        <div 
          className="flex lg:hidden items-center justify-center py-8"
          style={{
            backgroundImage: 'url(/assets/common/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <AuthHeader />
        </div>
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}
