import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "success" | "warning";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-ink-900 text-white",
  outline: "border border-ink-200 text-ink-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800"
};

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", variants[variant], className)} {...props} />
);
