/**
 * @file Props for the shared in-layout details panel shell.
 */

import type { ReactNode } from "react";

export type DetailsPanelProps = {
  /** When false, render nothing (caller may also unmount). */
  open: boolean;
  /** Visible + accessible title (`aria-labelledby`). */
  title: string;
  /** Close control + Escape. */
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /**
   * Optional labelled-by override; defaults to the internal title id.
   * Prefer leaving unset so the panel owns its heading.
   */
  "aria-describedby"?: string;
};
