"use client"

import { useRef, useState, useEffect, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (code: string) => void
  error?: string
  disabled?: boolean
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
}: OTPInputProps) {
  const [codes, setCodes] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const newCodes = value.split("").slice(0, length)
    const paddedCodes = [...newCodes, ...Array(length - newCodes.length).fill("")]
    setCodes(paddedCodes)
  }, [value, length])

  const updateCode = (newCodes: string[]) => {
    setCodes(newCodes)
    onChange(newCodes.join(""))
  }

  const handleChange = (index: number, text: string) => {
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, length)
      const newCodes = Array(length).fill("")
      
      for (let i = 0; i < digits.length; i++) {
        newCodes[i] = digits[i]
      }
      
      updateCode(newCodes)
      
      const focusIndex = Math.min(digits.length, length - 1)
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus()
      }, 0)
      return
    }

    if (text && !/^\d$/.test(text)) {
      return
    }

    const newCodes = [...codes]
    newCodes[index] = text
    updateCode(newCodes)

    if (text && index < length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
      }, 0)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      
      const newCodes = [...codes]

      if (codes[index]) {
        newCodes[index] = ""
        updateCode(newCodes)
      } else if (index > 0) {
        newCodes[index - 1] = ""
        updateCode(newCodes)
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus()
        }, 0)
      }
    }
  }

  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between gap-2">
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={codes[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={cn(
              "h-14 w-14 text-center text-2xl font-bold",
              error
                ? "border-red-500 bg-red-50"
                : codes[index]
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 bg-gray-50"
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
