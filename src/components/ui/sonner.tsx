"use client"

import {
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme || "light"

  return (
    <Sonner
      theme={currentTheme as "light" | "dark"}
      className="toaster group"
      position="top-center"
      duration={3000}
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !shadow-lg group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border",
          title: "!text-foreground !text-sm !font-medium",
          description: "!text-muted-foreground",
          closeButton: "!text-foreground hover:!bg-accent !border-0",
          success: "group-[.toast]:bg-green-600 group-[.toast]:text-white group-[.toast]:border-green-600",
          error: "group-[.toast]:bg-red-600 group-[.toast]:text-white group-[.toast]:border-red-600",
          info: "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:border-blue-600",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
