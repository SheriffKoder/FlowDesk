/**
 * @file entities/customer/client/customer-health-fetch-error.ts
 *
 * Purpose: Client-side error taxonomy for drawer health fetch.
 * Used in: `fetch-customer-health`, drawer UI retry copy.
 * Used for: Distinguish offline / not-found / network / server without route error.tsx.
 *
 * Function Index:
 * - CustomerHealthFetchError — typed failure with `kind`
 * - isCustomerHealthFetchError(unknown) → narrow
 */

/**
 * Why a client health fetch failed (drawer-local; never throws into the route).
 */
export type CustomerHealthFetchErrorKind =
  | "offline"
  | "not_found"
  | "network"
  | "server"
  | "invalid_response"
  | "aborted";

/**
 * Failure loading health over HTTP from the browser.
 */
export class CustomerHealthFetchError extends Error {
  readonly kind: CustomerHealthFetchErrorKind;
  readonly status: number | null;

  constructor(
    kind: CustomerHealthFetchErrorKind,
    message: string,
    status: number | null = null,
  ) {
    super(message);
    this.name = "CustomerHealthFetchError";
    this.kind = kind;
    this.status = status;
  }
}

/**
 * Narrow unknown thrown values to CustomerHealthFetchError when possible.
 */
export function isCustomerHealthFetchError(
  error: unknown,
): error is CustomerHealthFetchError {
  return error instanceof CustomerHealthFetchError;
}
