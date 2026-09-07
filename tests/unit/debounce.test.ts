/**
 * @file tests/unit/debounce.test.ts
 *
 * Purpose: Unit coverage for shared `debounce` cancel / flush behavior.
 * Used in: Vitest suite (`npm test`).
 * Used for: Lock quiet-period collapse and Enter-style flush used by SearchInput docs.
 *
 * Suites:
 * 1. Debounce — only last call after wait
 * 2. cancel — drops pending
 * 3. flush — immediate invoke after cancel
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { debounce } from "@/shared";

/////////////////////////////////////////////////////////////
// Timer setup
/////////////////////////////////////////////////////////////

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/////////////////////////////////////////////////////////////
// Debounce — quiet period
/////////////////////////////////////////////////////////////

describe("debounce", () => {
  it("invokes only the last call after waitMs", () => {
    // Burst typing should not spam commits — only the final value lands.
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("a");
    debounced("ab");
    debounced("abc");

    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("abc");
  });

  it("cancel drops a pending invocation", () => {
    // Unmount / superseded commit must not fire stale work.
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("gone");
    debounced.cancel();
    vi.advanceTimersByTime(300);

    expect(fn).not.toHaveBeenCalled();
  });

  it("flush invokes immediately and clears the timer", () => {
    // Enter key path — commit now, do not double-fire after wait.
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("pending");
    debounced.flush("now");
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("now");
  });
});
