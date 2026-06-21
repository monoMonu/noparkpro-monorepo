import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-outline-variant bg-surface px-3 text-sm text-on-surface shadow-sm transition-colors placeholder:text-on-surface-variant/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}