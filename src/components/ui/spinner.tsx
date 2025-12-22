import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-6 h-6",
      md: "w-7 h-7",
      lg: "w-10 h-10",
    };

    const bars = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", sizeClasses[size], className)}
        {...props}
        aria-label="Loading"
        role="status"
      >
        {bars.map((barNum) => {
          const rotation = (barNum - 1) * 30;
          const animationDelay = -((barNum - 1) * 0.1 + 0.1);

          return (
            <div
              key={barNum}
              className="absolute left-1/2 top-[30%] w-[8%] h-[24%] rounded-full bg-current opacity-0 shadow-sm"
              style={{
                transform: `rotate(${rotation}deg) translate(0, -130%)`,
                animation: "fade458 1s linear infinite",
                animationDelay: `${animationDelay}s`,
              }}
            />
          );
        })}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
