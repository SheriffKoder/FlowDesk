/**
 * @file entities/customer/errors/customer-errors.ts
 *
 * Purpose: Typed errors for customer list/health use-cases.
 * Used in: queries, API route adapters (status mapping).
 * Used for: validation vs not-found vs unexpected taxonomy.
 */

export type CustomerErrorCode =
  | "validation"
  | "not_found"
  | "upstream_failure";

/**
 * Base error for the customer entity boundary.
 */
export class CustomerError extends Error {
  readonly code: CustomerErrorCode;
  readonly status: number;

  constructor(code: CustomerErrorCode, message: string, status: number) {
    super(message);
    this.name = "CustomerError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Request / query params failed validation.
 */
export class CustomerValidationError extends CustomerError {
  constructor(message = "Invalid customer request") {
    super("validation", message, 400);
    this.name = "CustomerValidationError";
  }
}

/**
 * Customer (or health payload) does not exist.
 */
export class CustomerNotFoundError extends CustomerError {
  constructor(customerId: string) {
    super("not_found", `Customer not found: ${customerId}`, 404);
    this.name = "CustomerNotFoundError";
  }
}

/**
 * Unexpected failure reading upstream / fixtures.
 */
export class CustomerUpstreamError extends CustomerError {
  constructor(message = "Customer data unavailable") {
    super("upstream_failure", message, 500);
    this.name = "CustomerUpstreamError";
  }
}

/**
 * Narrow unknown thrown values to CustomerError when possible.
 */
export function isCustomerError(error: unknown): error is CustomerError {
  return error instanceof CustomerError;
}
