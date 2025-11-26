import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "button";
}

export const Shimmer = ({ className, variant = "card" }: ShimmerProps) => {
  const variantClasses = {
    card: "h-32 rounded-2xl",
    text: "h-4 rounded-lg",
    circle: "rounded-full aspect-square",
    button: "h-10 rounded-xl",
  };

  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-muted via-muted/60 to-muted",
        "bg-[length:200%_100%]",
        variantClasses[variant],
        className
      )}
    />
  );
};

export const ShimmerCard = () => (
  <div className="rounded-2xl border-0 bg-card shadow-apple-sm p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Shimmer variant="text" className="w-32" />
      <Shimmer variant="circle" className="w-12 h-12" />
    </div>
    <Shimmer variant="text" className="w-20 h-10" />
    <Shimmer variant="text" className="w-40" />
  </div>
);

export const ShimmerTable = () => (
  <div className="rounded-2xl border-0 bg-card shadow-apple-sm overflow-hidden">
    <div className="p-6 border-b border-border/50">
      <Shimmer variant="text" className="w-48 h-6" />
    </div>
    <div className="divide-y divide-border/50">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Shimmer variant="text" className="flex-1" />
          <Shimmer variant="text" className="w-32" />
          <Shimmer variant="button" className="w-24" />
        </div>
      ))}
    </div>
  </div>
);
