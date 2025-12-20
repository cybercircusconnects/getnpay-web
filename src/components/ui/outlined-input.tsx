"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OutlinedInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: boolean;
  touched?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

const OutlinedInput = React.forwardRef<HTMLInputElement, OutlinedInputProps>(
  (
    {
      className,
      type,
      label,
      error,
      touched = false,
      errorMessage,
      leftIcon,
      rightIcon,
      required = false,
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const [localTouched, setLocalTouched] = React.useState(false);
    const [internalError, setInternalError] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const shouldFloatLabel = isFocused || hasValue;
    const isFieldTouched = touched || localTouched;
    const hasError = error || internalError;
    const shouldShowError = isFieldTouched && hasError;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setLocalTouched(true);

      const inputValue = e.target.value || "";
      const trimmedValue = inputValue.trim();
      setHasValue(trimmedValue.length > 0);

      if (required && trimmedValue.length === 0) {
        setInternalError(true);
      } else {
        setInternalError(false);
      }

      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHasValue(value.length > 0);

      if (required && value.trim().length > 0) {
        setInternalError(false);
      }

      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-muted-foreground flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={inputRef}
            type={type}
            className={cn(
              "h-11 w-full rounded border bg-background px-4 py-3 text-base outline-none transition-all duration-200",
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
              "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon ? "pl-12" : "pl-4",
              rightIcon ? "pr-12" : "pr-4",
              shouldShowError
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : isFocused
                ? "border-green-600 focus:ring-2 focus:ring-green-600/20"
                : "border-gray-300 hover:border-gray-400",
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
                "absolute pointer-events-none transition-all duration-200 select-none origin-left flex items-center",
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
                shouldShowError
                  ? "text-red-500"
                  : isFocused
                  ? "text-green-600"
                  : shouldFloatLabel
                  ? "text-green-600"
                  : "text-gray-500"
              )}
            >
              {label}
            </label>
          )}

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {shouldShowError && (errorMessage || (internalError && required)) && (
          <p className="mt-1 text-xs text-red-500">
            {errorMessage ||
              (internalError && required
                ? `${label || "This field"} is required`
                : "")}
          </p>
        )}
      </div>
    );
  }
);

OutlinedInput.displayName = "OutlinedInput";

export { OutlinedInput };
