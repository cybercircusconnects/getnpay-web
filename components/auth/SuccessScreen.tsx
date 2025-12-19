"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function SuccessScreen() {
  const router = useRouter()

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-black">
            Awesome! your email has been successfully verified.
          </h1>
          <p className="text-sm text-gray-500">
            Let's wrap things up by configuring your accessibility, Preferences to enhance your
            experience with GetnPay.
          </p>
        </div>
      </div>

      <Button
        onClick={() => router.push("/dashboard")}
        className="w-full cursor-pointer bg-primary text-white hover:bg-primary/90"
      >
        Let's continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

