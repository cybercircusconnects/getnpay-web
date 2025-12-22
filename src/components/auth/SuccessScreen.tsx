"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function SuccessScreen() {
  const router = useRouter()

  return (
    <div className="w-full space-y-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary mx-auto">
        <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Awesome! your email has been successfully verified.
        </h1>
        <p className="text-sm text-gray-500">
          Let's wrap things up by configuring your accessibility, Preferences to enhance your
          experience with GetnPay.
        </p>
      </div>

      <Button
        onClick={() => router.push("/dashboard")}
        className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Let's continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
