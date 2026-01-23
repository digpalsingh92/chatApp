"use client";

interface ProviderProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function Provider({ children, ...props }: ProviderProps) {
  // No longer needed - Chakra UI removed
  return <>{children}</>;
}
