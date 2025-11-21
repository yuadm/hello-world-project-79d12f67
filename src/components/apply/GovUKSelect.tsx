import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GovUKSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const GovUKSelect = forwardRef<HTMLSelectElement, GovUKSelectProps>(
  ({ label, hint, error, required, options, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-base font-bold text-foreground">
          {label}
          {required && <span className="text-[hsl(var(--govuk-red))] font-bold ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-[hsl(var(--govuk-text-secondary))]">{hint}</span>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full border-2 border-[hsl(var(--govuk-black))] p-2 rounded-none text-base leading-normal box-border focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0 focus:shadow-[inset_0_0_0_2px_hsl(var(--govuk-black))]",
            error && "border-[hsl(var(--govuk-red))]",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm font-medium text-[hsl(var(--govuk-red))]">{error}</p>
        )}
      </div>
    );
  }
);

GovUKSelect.displayName = "GovUKSelect";
