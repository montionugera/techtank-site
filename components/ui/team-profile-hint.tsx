import { cn } from "@/utils/theme";

interface TeamProfileHintProps {
  className?: string;
}

export function TeamProfileHint({ className }: TeamProfileHintProps) {
  return (
    <p className={cn("mt-3 text-xs font-semibold text-ring transition-colors group-hover:text-ring/80", className)}>
      View profile <span aria-hidden="true">→</span>
    </p>
  );
}
