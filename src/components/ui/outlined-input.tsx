"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OutlinedInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const OutlinedInput = React.forwardRef<HTMLInputElement, OutlinedInputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      if (inputRef.current) {
        setHasValue(inputRef.current.value.length > 0)
      }
    }, [props.value, props.defaultValue])

    const shouldFloatLabel = isFocused || hasValue

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      const inputValue = e.target.value || ""
      setHasValue(inputValue.trim().length > 0)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type={type}
          className={cn(
            "h-12 w-full rounded-lg border-2 bg-background px-4 py-3 text-base outline-none transition-all duration-200",
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-12" : "pl-4",
            rightIcon ? "pr-12" : "pr-4",
            error
              ? "border-red-500 focus:border-red-500"
              : isFocused
              ? "border-green-600"
              : "border-outline hover:border-green-600/70",
            !shouldFloatLabel && "placeholder:opacity-0",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={shouldFloatLabel ? props.placeholder : ""}
          {...props}
        />
        
        {label && (
          <label
            className={cn(
              "absolute pointer-events-none transition-all duration-200 select-none origin-left",
              shouldFloatLabel
                ? "top-0 -translate-y-1/2 text-xs px-2 bg-background z-10"
                : "top-1/2 -translate-y-1/2 text-base",
              shouldFloatLabel
                ? leftIcon
                  ? "left-10"
                  : "left-3"
                : leftIcon
                ? "left-12"
                : "left-4",
              error
                ? "text-red-500"
                : isFocused
                ? "text-green-600"
                : shouldFloatLabel
                ? "text-green-600"
                : "text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)

OutlinedInput.displayName = "OutlinedInput"

export { OutlinedInput }
