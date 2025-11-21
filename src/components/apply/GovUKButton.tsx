import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GovUKButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const GovUKButton = forwardRef<HTMLButtonElement, GovUKButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-6 py-3 rounded-none font-semibold border-none cursor-pointer transition-colors text-base focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0",
          variant === "primary" && "bg-[hsl(var(--govuk-green))] text-white shadow-[0_2px_0_#004020] hover:bg-[hsl(var(--govuk-green-hover))]",
          variant === "secondary" && "bg-[hsl(var(--govuk-grey-background))] text-[hsl(var(--govuk-black))] shadow-[0_2px_0_#929191] hover:bg-[hsl(0_0%_89%)]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GovUKButton.displayName = "GovUKButton";
