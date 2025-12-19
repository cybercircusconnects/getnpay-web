"use client"

import {
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      duration={3000}
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !shadow-lg",
          title: "!text-white !text-sm !font-medium",
          description: "!text-white/90",
          closeButton: "!text-white hover:!bg-white/20",
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
