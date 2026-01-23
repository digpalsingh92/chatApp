"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<string, string> = {
  default: "bg-teal-600 text-white hover:bg-teal-700",
  outline:
    "border border-gray-300 bg-transparent hover:bg-teal-50 text-gray-900",
  ghost: "hover:bg-gray-100 text-gray-900",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-6 text-base",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
  }
>(function Button(
  { className, variant = "default", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...props}
    />
  );
});
