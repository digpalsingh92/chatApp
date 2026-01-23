"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ children, content, showArrow, disabled, ...props }, ref) {
    const [isVisible, setIsVisible] = React.useState(false);

    if (disabled) return <>{children}</>;

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              "absolute z-50 min-w-[8rem] rounded-md border border-gray-200 bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md",
              "bottom-full left-1/2 -translate-x-1/2 mb-2"
            )}
          >
            {content}
            {showArrow && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
            )}
          </div>
        )}
      </div>
    );
  }
);
