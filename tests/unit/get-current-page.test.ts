/**
 * @file tests/unit/get-current-page.test.ts
 *
 * Purpose: Unit coverage for layout `getCurrentPage` pathname matching.
 * Used for: Lock exact match, prefix match, longest-url preference, unknown paths.
 *
 * Sections:
 * 1. Exact / prefix matches for Customer Health
 * 2. Root dashboard only at `/`
 * 3. Unknown paths → undefined
 */

import { describe, expect, it } from "vitest";

import { getCurrentPage } from "@/widgets/app-sidebar";

/////////////////////////////////////////////////////////////
// 1. Customer Health
/////////////////////////////////////////////////////////////

describe("getCurrentPage", () => {
  it("matches Customer Health exactly", () => {
    const page = getCurrentPage("/customers/health");
    expect(page?.id).toBe("health");
    expect(page?.label).toBe("Customer Health");
  });

  it("matches nested paths under Customer Health", () => {
    expect(getCurrentPage("/customers/health/extra")?.id).toBe("health");
  });

  it("ignores a trailing slash", () => {
    expect(getCurrentPage("/customers/health/")?.id).toBe("health");
  });

  /////////////////////////////////////////////////////////////
  // 2. Root
  /////////////////////////////////////////////////////////////

  it("matches dashboard only at root", () => {
    expect(getCurrentPage("/")?.id).toBe("dashboard");
    expect(getCurrentPage("/other")).toBeUndefined();
  });

  /////////////////////////////////////////////////////////////
  // 3. Unknown
  /////////////////////////////////////////////////////////////

  it("returns undefined for unknown paths", () => {
    expect(getCurrentPage("/nope")).toBeUndefined();
  });
});
