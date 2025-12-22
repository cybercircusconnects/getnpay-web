"use client";

import * as React from "react";
import PhoneInputLib from "react-phone-number-input";
import { cn } from "@/lib/utils";
import type { PhoneInputProps } from "@/types/components";
import "react-phone-number-input/style.css";

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      onFocus,
      label,
      error,
      touched = false,
      errorMessage,
      required = false,
      placeholder,
      className,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const [localTouched, setLocalTouched] = React.useState(false);
    const [internalError, setInternalError] = React.useState(false);

    React.useEffect(() => {
      setHasValue(value ? value.length > 0 : false);
    }, [value]);

    const shouldFloatLabel = isFocused || hasValue;
    const isFieldTouched = touched || localTouched;
    const hasError = error || internalError;
    const shouldShowError = isFieldTouched && hasError;

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      setLocalTouched(true);

      const inputValue = value || "";
      const trimmedValue = inputValue.trim();
      setHasValue(trimmedValue.length > 0);

      if (required && trimmedValue.length === 0) {
        setInternalError(true);
      } else {
        setInternalError(false);
      }

      onBlur?.();
    };

    const handleChange = (val: string | undefined) => {
      const stringValue = val || "";
      setHasValue(stringValue.length > 0);

      if (required && stringValue.trim().length > 0) {
        setInternalError(false);
      }

      onChange(val);
    };

    return (
      <>
        <div className="relative w-full">
          <div className="relative">
            <div
              className={cn(
                "h-11 w-full rounded border bg-background transition-all duration-200",
                "flex items-center",
                shouldShowError
                  ? "border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
                  : isFocused
                  ? "border-green-600 focus-within:ring-2 focus-within:ring-green-600/20"
                  : "border-gray-300 hover:border-gray-400",
                className
              )}
            >
              <PhoneInputLib
                international
                defaultCountry="US"
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder=""
                className="phone-input-wrapper"
                numberInputProps={{
                  className: "phone-input-number",
                  placeholder: shouldFloatLabel
                    ? placeholder || "Phone Number"
                    : "",
                }}
                countrySelectProps={{
                  className: "phone-input-country",
                }}
              />
            </div>

            {label && (
              <label
                className={cn(
                  "absolute pointer-events-none transition-all duration-200 select-none origin-left flex items-center",
                  shouldFloatLabel
                    ? "top-0 -translate-y-1/2 text-xs px-2 bg-background z-10 left-3"
                    : "top-1/2 -translate-y-1/2 text-base left-28",
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

        <style jsx global>{`
          .phone-input-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0;
          }
          .phone-input-wrapper .PhoneInputInput {
            border: none;
            outline: none;
            background: transparent;
            height: 100%;
            width: 100%;
            padding: 0.75rem 0.75rem 0.75rem 0.75rem;
            font-size: 1rem;
            color: inherit;
            flex: 1;
            min-width: 0;
          }
          .phone-input-wrapper .PhoneInputInput::placeholder {
            color: rgb(156, 163, 175);
          }
          .phone-input-wrapper .PhoneInputCountry {
            border-right: 1px solid rgb(209, 213, 219);
            padding-right: 0.5rem;
            padding-left: 0.5rem;
            margin-right: 0;
            height: 100%;
            display: flex;
            align-items: center;
            min-width: 80px;
            flex-shrink: 0;
          }
          .phone-input-wrapper .PhoneInputCountrySelect {
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 0.5rem 0.25rem;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            width: 100%;
          }
          .phone-input-wrapper .PhoneInputCountrySelectArrow {
            opacity: 0.5;
            margin-left: 0.25rem;
            flex-shrink: 0;
          }
          .phone-input-wrapper .PhoneInputCountryIcon {
            width: 1.5rem;
            height: 1.5rem;
            flex-shrink: 0;
            margin-right: 0.5rem;
          }
          .phone-input-wrapper .PhoneInputCountryIcon--border {
            box-shadow: none;
          }
        `}</style>
      </>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
