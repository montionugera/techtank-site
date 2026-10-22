import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { TeamCard } from "./team-card";
import { extractUsername, TeamSocialLinks } from "./team-social-links";
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

describe("extractUsername", () => {
  it("extracts LinkedIn usernames from various URL formats", () => {
    expect(extractUsername("https://www.linkedin.com/in/tkodev", "linkedin")).toBe("tkodev");
    expect(extractUsername("https://linkedin.com/in/tkodev/", "linkedin")).toBe("tkodev");
    expect(extractUsername("https://www.linkedin.com/in/tony-ko?trk=profile", "linkedin")).toBe("tony-ko");
    expect(extractUsername("linkedin.com/in/tonyko", "linkedin")).toBe("tonyko");
  });

  it("extracts GitHub usernames from various URL formats", () => {
    expect(extractUsername("https://github.com/tkodev", "github")).toBe("tkodev");
    expect(extractUsername("https://www.github.com/tkodev/", "github")).toBe("tkodev");
    expect(extractUsername("https://github.com/tkodev?tab=repositories", "github")).toBe("tkodev");
    expect(extractUsername("github.com/tkodev", "github")).toBe("tkodev");
  });
});

describe("TeamSocialLinks", () => {
  it("renders null when member has no links", () => {
    const html = renderToString(<TeamSocialLinks member={memberWithoutLinks} />);
    expect(html).toBe("");
  });

  it("renders accessible LinkedIn and GitHub ghost button links with labels and aria-hidden icons", () => {
    const html = renderToString(<TeamSocialLinks member={memberWithLinks} />);

    // Visible labels next to icons + sr-only member context
    expect(html).toContain("linkedin: tkodev");
    expect(html).toContain("github: tkodev");
    expect(html).toContain('<span class="sr-only">Tony Ko on </span>');

    // Icons are decorative for screen readers
    expect(html).toContain('aria-hidden="true"');

    // Security & target
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');

    // URLs
    expect(html).toContain('href="https://www.linkedin.com/in/tkodev"');
    expect(html).toContain('href="https://github.com/tkodev"');

    // Ghost button styling classes
    expect(html).toContain("text-muted-foreground");
    expect(html).toContain("hover:text-foreground");
    expect(html).toContain("focus-visible:ring-2");
    expect(html).toContain("focus-visible:ring-ring");
  });

  it("renders icon-only links with sr-only accessible names when iconOnly is true", () => {
    const html = renderToString(<TeamSocialLinks member={memberWithLinks} iconOnly />);

    expect(html).toContain('<span class="sr-only">Tony Ko on LinkedIn: tkodev</span>');
    expect(html).toContain('<span class="sr-only">Tony Ko on GitHub: tkodev</span>');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("aria-label=");
  });

  it("supports center alignment for dialogs", () => {
    const html = renderToString(<TeamSocialLinks member={memberWithLinks} align="center" />);
    expect(html).toContain("items-center");
    expect(html).toContain("justify-center");
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
    expect(html).toContain('<span class="sr-only">Alice on </span>');
    expect(html).toContain("linkedin: alice");
    expect(html).not.toContain("github");
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
    expect(html).toContain('<span class="sr-only">Bob on </span>');
    expect(html).toContain("github: bob");
    expect(html).not.toContain("linkedin");
  });
});

describe("TeamCard", () => {
  it.each(["board", "core"] as const)(
    "renders social links between description and View profile hint for %s variant",
    (variant) => {
      const html = renderToString(<TeamCard variant={variant} member={memberWithLinks} />);

      // External profile links are rendered
      expect(html).toContain('href="https://www.linkedin.com/in/tkodev"');
      expect(html).toContain('href="https://github.com/tkodev"');
      expect(html).toContain("linkedin: tkodev");
      expect(html).toContain("github: tkodev");

      // Verify ordering: description -> links -> View profile
      const bioIndex = html.indexOf("Bio description here.");
      const linkIndex = html.indexOf("linkedin: tkodev");
      const hintIndex = html.indexOf("View profile");

      expect(bioIndex).toBeGreaterThan(-1);
      expect(linkIndex).toBeGreaterThan(bioIndex);
      expect(hintIndex).toBeGreaterThan(linkIndex);

      // Verify no nested interactive elements: no <button> contains an <a> tag
      expect(html).not.toMatch(/<button[^>]*>[\s\S]*?<a[\s\S]*?<\/button>/);
      // No <a> contains a <button>
      expect(html).not.toMatch(/<a[^>]*>[\s\S]*?<button[\s\S]*?<\/a>/);
    },
  );

  it("renders icon-only social links with sr-only labels for compact variant without nested interactive elements", () => {
    const html = renderToString(<TeamCard variant="compact" member={memberWithLinks} />);

    expect(html).toContain('href="https://www.linkedin.com/in/tkodev"');
    expect(html).toContain('<span class="sr-only">Tony Ko on LinkedIn: tkodev</span>');
    expect(html).toContain('<span class="sr-only">Tony Ko on GitHub: tkodev</span>');
    expect(html).not.toContain('aria-label="Tony Ko on LinkedIn');
    expect(html).not.toMatch(/<button[^>]*>[\s\S]*?<a[\s\S]*?<\/button>/);
    expect(html).not.toMatch(/<a[^>]*>[\s\S]*?<button[\s\S]*?<\/a>/);
  });

  it("does not render link icons when member has no links", () => {
    const html = renderToString(<TeamCard variant="compact" member={memberWithoutLinks} />);
    expect(html).not.toContain("linkedin");
    expect(html).not.toContain("github");
    expect(html).not.toContain("<a");
  });
});
