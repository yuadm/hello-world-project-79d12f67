import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface GovUKInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  widthClass?: "full" | "10" | "20";
  validationType?: "ni-number" | "dbs-certificate" | "postcode";
}

export const GovUKInput = forwardRef<HTMLInputElement, GovUKInputProps>(
  ({ label, hint, error, required, widthClass = "full", className, validationType, ...props }, ref) => {
    const widthClasses = {
      full: "w-full",
      10: "max-w-[10rem]",
      20: "max-w-[20rem]",
    };

    // Validation patterns based on type
    const validationProps: any = {};
    if (validationType === "ni-number") {
      validationProps.pattern = "[A-Z]{2}[0-9]{6}[A-D]";
      validationProps.maxLength = 9;
      validationProps.placeholder = "QQ123456C";
    } else if (validationType === "dbs-certificate") {
      validationProps.pattern = "\\d{12}";
      validationProps.maxLength = 12;
      validationProps.placeholder = "000000000000";
    } else if (validationType === "postcode") {
      validationProps.maxLength = 8;
    }

    return (
      <div className={cn("space-y-2", error && "border-l-[5px] border-[hsl(var(--govuk-red))] pl-4 py-2")}>
        <label className="block text-base font-bold text-foreground">
          {label}
          {required && <span className="text-[hsl(var(--govuk-red))] font-bold ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-[hsl(var(--govuk-text-secondary))]">{hint}</span>
        )}
        {error && (
          <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "border-2 border-[hsl(var(--govuk-black))] p-2 rounded-none text-base leading-normal box-border focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0 focus:shadow-[inset_0_0_0_2px_hsl(var(--govuk-black))]",
            error && "border-[hsl(var(--govuk-red))] border-[4px]",
            widthClasses[widthClass],
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id || label}-error` : undefined}
          {...validationProps}
          {...props}
        />
      </div>
    );
  }
);

GovUKInput.displayName = "GovUKInput";
