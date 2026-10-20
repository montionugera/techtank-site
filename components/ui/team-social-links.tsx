import type { ComponentPropsWithoutRef } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import type { TeamMember } from "@/constants/team";
import { cn } from "@/utils/theme";

export interface TeamSocialLinksProps extends ComponentPropsWithoutRef<"div"> {
  member: TeamMember;
  size?: "sm" | "md";
}

export function TeamSocialLinks({ member, size = "sm", className, ...props }: TeamSocialLinksProps) {
  const { name, linkedin, github } = member;

  if (!linkedin && !github) {
    return null;
  }

  const isMd = size === "md";
  const linkClasses = cn(
    "relative z-10 inline-flex items-center justify-center rounded-full text-muted-foreground transition-[color,background-color] duration-150 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
    isMd ? "size-9 border border-border bg-card hover:bg-accent" : "size-7",
  );
  const iconClasses = isMd ? "size-4.5" : "size-4";

  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          onClick={(e) => e.stopPropagation()}
          className={linkClasses}
        >
          <LinkedInIcon className={iconClasses} aria-hidden="true" />
          <span className="sr-only">{`${name} on LinkedIn`}</span>
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on GitHub`}
          onClick={(e) => e.stopPropagation()}
          className={linkClasses}
        >
          <GitHubIcon className={iconClasses} aria-hidden="true" />
          <span className="sr-only">{`${name} on GitHub`}</span>
        </a>
      )}
    </div>
  );
}
