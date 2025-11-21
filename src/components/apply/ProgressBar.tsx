interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
}

export const ProgressBar = ({ currentSection, totalSections }: ProgressBarProps) => {
  const progress = ((currentSection) / totalSections) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-foreground">
          Section {currentSection} of {totalSections}
        </span>
        <span className="text-sm font-semibold text-foreground">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-none">
        <div
          className="h-full bg-[hsl(var(--govuk-blue))] transition-all duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
