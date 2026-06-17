import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-on-primary shadow-sm hover:bg-primary/90",
  secondary: "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low",
  ghost: "bg-transparent text-on-surface hover:bg-surface-container-low",
  danger: "border border-error bg-error text-on-error hover:bg-error/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}