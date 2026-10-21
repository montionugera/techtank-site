import type { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import type { TeamMember } from "@/constants/team";
import { cn } from "@/utils/theme";

export interface TeamSocialLinksProps extends ComponentPropsWithoutRef<"div"> {
  member: TeamMember;
  align?: "left" | "center";
  iconOnly?: boolean;
}

/**
 * Extracts a handle or username from a profile URL.
 * Supports full URLs (https://www.linkedin.com/in/username), with/without trailing slashes,
 * query parameters, and URLs without protocols.
 */
export function extractUsername(url: string, service: "linkedin" | "github"): string {
  try {
    const href = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    const parsed = new URL(href);
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (service === "linkedin") {
      const inIdx = parts.indexOf("in");
      if (inIdx !== -1 && parts[inIdx + 1]) {
        return parts[inIdx + 1];
      }
      return parts[parts.length - 1] ?? "";
    }

    if (service === "github") {
      return parts[0] ?? "";
    }
  } catch {
    const trimmed = url.replace(/\/+$/, "");
    return trimmed.split("/").pop() ?? "";
  }
  return "";
}

export function TeamSocialLinks({
  member,
  align = "left",
  iconOnly = false,
  className,
  ...props
}: TeamSocialLinksProps) {
  const { name, linkedin, github } = member;

  if (!linkedin && !github) {
    return null;
  }

  const linkedinUser = linkedin ? extractUsername(linkedin, "linkedin") : "";
  const githubUser = github ? extractUsername(github, "github") : "";
  const isCenter = align === "center";

  const buttonClass = iconOnly
    ? "size-8 p-0 text-muted-foreground hover:text-foreground"
    : cn(
        "h-auto gap-2 py-1 text-sm font-normal text-muted-foreground hover:text-foreground",
        isCenter ? "justify-center px-2.5" : "-ml-2.5 justify-start px-2.5",
      );

  return (
    <div
      className={cn(
        "relative z-10 flex",
        iconOnly ? "items-center gap-1" : cn("flex-col gap-1", isCenter ? "items-center" : "items-start"),
        className,
      )}
      {...props}
    >
      {linkedin && (
        <Button variant="ghost" size="sm" asChild className={buttonClass}>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <LinkedInIcon className="size-4 shrink-0" aria-hidden="true" />
            {iconOnly ? (
              <span className="sr-only">{`${name} on LinkedIn: ${linkedinUser}`}</span>
            ) : (
              <>
                <span className="sr-only">{`${name} on `}</span>
                <span>{`linkedin: ${linkedinUser}`}</span>
              </>
            )}
          </a>
        </Button>
      )}
      {github && (
        <Button variant="ghost" size="sm" asChild className={buttonClass}>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <GitHubIcon className="size-4 shrink-0" aria-hidden="true" />
            {iconOnly ? (
              <span className="sr-only">{`${name} on GitHub: ${githubUser}`}</span>
            ) : (
              <>
                <span className="sr-only">{`${name} on `}</span>
                <span>{`github: ${githubUser}`}</span>
              </>
            )}
          </a>
        </Button>
      )}
    </div>
  );
}
