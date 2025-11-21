import { AlertCircle, X } from "lucide-react";

interface ErrorSummaryProps {
  errors: string[];
  onClose: () => void;
}

export const ErrorSummary = ({ errors, onClose }: ErrorSummaryProps) => {
  if (errors.length === 0) return null;

  return (
    <div 
      className="mb-6 p-4 border-l-[10px] border-[hsl(var(--govuk-red))] bg-[hsl(var(--govuk-inset-red-bg))]" 
      role="alert" 
      tabIndex={-1}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-[hsl(var(--govuk-red))]" />
            There is a problem
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-[hsl(var(--govuk-red))]">
                {error}
              </p>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-foreground hover:text-foreground/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
