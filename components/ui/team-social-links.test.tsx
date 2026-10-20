import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { TeamCard } from "./team-card";
import { TeamSocialLinks } from "./team-social-links";
import type { TeamMember } from "../../constants/team";

const memberWithLinks: TeamMember = {
  name: "Tony Ko",
  pronouns: "he/him",
  role: "Board Member & Digital Lead",
  bio: "Bio description here.",
  avatar: "/images/team/tony-ko.webp",
  linkedin: "https://www.linkedin.com/in/tkodev",
  github: "https://github.com/tkodev",
};

const memberWithoutLinks: TeamMember = {
  name: "Jane Doe",
  pronouns: "she/her",
  role: "Volunteer",
  avatar: "/images/team/jane-doe.webp",
};

describe("icons", () => {
  it("exports LinkedInIcon and GitHubIcon with proper SVG attributes", () => {
    const linkedinHtml = renderToString(<LinkedInIcon className="size-4" />);
    expect(linkedinHtml).toContain("<svg");
    expect(linkedinHtml).toContain('aria-hidden="true"');
    expect(linkedinHtml).toContain('fill="currentColor"');

    const githubHtml = renderToString(<GitHubIcon className="size-4" />);
    expect(githubHtml).toContain("<svg");
    expect(githubHtml).toContain('aria-hidden="true"');
    expect(githubHtml).toContain('fill="currentColor"');
  });
});

describe("TeamSocialLinks", () => {
  it("renders null when member has no links", () => {
    const html = renderToString(<TeamSocialLinks member={memberWithoutLinks} />);
    expect(html).toBe("");
  });

  it("renders accessible LinkedIn and GitHub links when provided", () => {
    const html = renderToString(<TeamSocialLinks member={memberWithLinks} />);

    // Accessible names with member name
    expect(html).toContain('aria-label="Tony Ko on LinkedIn"');
    expect(html).toContain('aria-label="Tony Ko on GitHub"');
    expect(html).toContain('<span class="sr-only">Tony Ko on LinkedIn</span>');
    expect(html).toContain('<span class="sr-only">Tony Ko on GitHub</span>');

    // Security & target
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');

    // URLs
    expect(html).toContain('href="https://www.linkedin.com/in/tkodev"');
    expect(html).toContain('href="https://github.com/tkodev"');

    // Focus ring styling
    expect(html).toContain("focus-visible:ring-2");
    expect(html).toContain("focus-visible:ring-ring");
  });

  it("renders only LinkedIn when only linkedin is provided", () => {
    const html = renderToString(
      <TeamSocialLinks
        member={{
          name: "Alice",
          pronouns: "she/her",
          linkedin: "https://www.linkedin.com/in/alice",
        }}
      />,
    );
    expect(html).toContain('aria-label="Alice on LinkedIn"');
    expect(html).not.toContain("GitHub");
  });

  it("renders only GitHub when only github is provided", () => {
    const html = renderToString(
      <TeamSocialLinks
        member={{
          name: "Bob",
          pronouns: "he/him",
          github: "https://github.com/bob",
        }}
      />,
    );
    expect(html).toContain('aria-label="Bob on GitHub"');
    expect(html).not.toContain("LinkedIn");
  });
});

describe("TeamCard", () => {
  it.each(["board", "core", "compact"] as const)(
    "positions social icons in bottom-right without nested interactive elements for %s variant",
    (variant) => {
      const html = renderToString(<TeamCard variant={variant} member={memberWithLinks} />);

      // External profile links are rendered
      expect(html).toContain('href="https://www.linkedin.com/in/tkodev"');
      expect(html).toContain('href="https://github.com/tkodev"');

      // Correct bottom-right positioning class present
      const expectedPosition =
        variant === "board"
          ? "absolute right-6 bottom-6"
          : variant === "core"
            ? "absolute right-4 bottom-4"
            : "absolute right-3 bottom-2.5";
      expect(html).toContain(expectedPosition);

      // Verify no nested interactive elements: no <button> contains an <a> tag
      expect(html).not.toMatch(/<button[^>]*>[\s\S]*?<a[\s\S]*?<\/button>/);
      // No <a> contains a <button>
      expect(html).not.toMatch(/<a[^>]*>[\s\S]*?<button[\s\S]*?<\/a>/);
    },
  );

  it("does not render link icons when member has no links", () => {
    const html = renderToString(<TeamCard variant="compact" member={memberWithoutLinks} />);
    expect(html).not.toContain("LinkedIn");
    expect(html).not.toContain("GitHub");
    expect(html).not.toContain("<a");
  });
});
