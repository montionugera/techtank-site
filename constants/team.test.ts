import { describe, expect, it } from "vitest";
import { teamGroups } from "./team";

describe("teamGroups", () => {
  it("contains valid groups and members", () => {
    expect(teamGroups.length).toBeGreaterThan(0);
    for (const group of teamGroups) {
      expect(group.title).toBeTruthy();
      expect(group.members.length).toBeGreaterThan(0);
      for (const member of group.members) {
        expect(member.name).toBeTruthy();
        expect(member.pronouns).toBeTruthy();

        if (member.linkedin !== undefined) {
          expect(member.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\/.+/);
        }
        if (member.github !== undefined) {
          expect(member.github).toMatch(/^https:\/\/(www\.)?github\.com\/.+/);
        }
      }
    }
  });

  it("includes LinkedIn and GitHub URLs for members who provided them", () => {
    const allMembers = teamGroups.flatMap((g) => g.members);
    const tonyKo = allMembers.find((m) => m.name === "Tony Ko");
    expect(tonyKo).toBeDefined();
    expect(tonyKo?.linkedin).toBe("https://www.linkedin.com/in/tkodev");
    expect(tonyKo?.github).toBe("https://github.com/tkodev");
  });
});
