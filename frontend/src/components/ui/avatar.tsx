"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const sizeMap: Record<string, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
  "2xl": "h-24 w-24",
};

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "2xl";
  className?: string;
}

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden",
        sizeMap[size || "md"],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs text-gray-600">
          {alt?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </div>
  );
}
