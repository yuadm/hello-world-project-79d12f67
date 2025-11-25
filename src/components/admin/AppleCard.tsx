import { cn } from "@/lib/utils";

interface AppleCardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export const AppleCard = ({ children, hover = true, className }: AppleCardProps) => (
  <div 
    className={cn(
      "rounded-2xl bg-card border-0 shadow-apple-sm",
      hover && "transition-all duration-300 hover:shadow-apple-lg hover:-translate-y-1",
      className
    )}
  >
    {children}
  </div>
);
