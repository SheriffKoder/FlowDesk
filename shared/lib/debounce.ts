/**
 * @file shared/lib/debounce.ts
 *
 * Purpose: Pure debounce helper with cancel + flush.
 * Used in: Shared UI (or any caller that needs delayed commit without React).
 * Used for: Collapse rapid calls (e.g. search typing) into one late invocation.
 *
 * Function Index:
 * - debounce(fn, waitMs) → debounced fn + cancel + flush
 *
 * Steps:
 * 1. On call — clear prior timer, schedule `fn` after `waitMs`.
 * 2. cancel() — drop the pending timer without invoking.
 * 3. flush(...args) — cancel pending, invoke `fn` immediately with args.
 */

export type DebouncedFunction<TArgs extends unknown[]> = ((
  ...args: TArgs
) => void) & {
  /** Drop a pending invocation without calling `fn`. */
  cancel: () => void;
  /** Cancel pending work and invoke `fn` immediately. */
  flush: (...args: TArgs) => void;
};

/**
 * Delay `fn` until calls pause for `waitMs`.
 *
 * @param fn - Function to invoke after the quiet period
 * @param waitMs - Quiet period in milliseconds
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
): DebouncedFunction<TArgs> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: TArgs) => {
    //////////////////////////////////
    // 1. Reschedule — only the last call in a burst should fire.
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, waitMs);
    //////////////////////////////////
  }) as DebouncedFunction<TArgs>;

  debounced.cancel = () => {
    //////////////////////////////////
    // 2. Drop pending work (unmount / superseded commit).
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    //////////////////////////////////
  };

  debounced.flush = (...args: TArgs) => {
    //////////////////////////////////
    // 3. Immediate commit (e.g. Enter) — cancel then invoke.
    debounced.cancel();
    fn(...args);
    //////////////////////////////////
  };

  return debounced;
}
