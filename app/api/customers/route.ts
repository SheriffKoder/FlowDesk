/**
 * @file app/api/customers/route.ts
 *
 * Purpose: Thin GET /api/customers adapter → listCustomers query.
 * Used in: Customer Health page fetch (later), integration tests.
 * Used for: Map URL searchParams to entity input; map errors to HTTP status.
 *
 * Steps:
 * 1. Parse URL with view URL-contract helpers (shared dialect with the page).
 * 2. Resolve sort (default health-then-name when absent).
 * 3. Call listCustomers; return paginated JSON or error status.
 */

import { NextResponse } from "next/server";

import {
  isCustomerError,
  listCustomers,
  type CustomerListSort,
} from "@/entities/customer";
import {
  parseListParams,
  resolveListSort,
} from "@/views/customer-health";

/**
 * Map view ResolvedListSort → entity CustomerListSort.
 */
function toEntitySort(
  resolved: ReturnType<typeof resolveListSort>,
): CustomerListSort {
  if (resolved.kind === "default") {
    return { kind: "default" };
  }
  return {
    kind: "explicit",
    field: resolved.field,
    order: resolved.order,
  };
}

/**
 * GET /api/customers — paginated, filterable customer list.
 */
export async function GET(request: Request) {
  try {
    //////////////////////////////////
    // 1. Parse + resolve list URL contract from the request query.
    const url = new URL(request.url);
    const params = parseListParams(url.searchParams);
    const sort = toEntitySort(resolveListSort(params));
    //////////////////////////////////

    //////////////////////////////////
    // 2. Run entity use-case.
    const result = listCustomers({
      search: params.search,
      segment: params.segment,
      page: params.page,
      pageSize: params.pageSize,
      sort,
    });
    //////////////////////////////////

    //////////////////////////////////
    // 3. Shape JSON for the wire (snake_case page_size matches URL contract).
    return NextResponse.json({
      data: result.data,
      page: result.page,
      page_size: result.pageSize,
      total: result.total,
    });
    //////////////////////////////////
  } catch (error) {
    if (isCustomerError(error)) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    console.error(error);
    return NextResponse.json(
      {
        error: {
          code: "upstream_failure",
          message: "Unexpected error listing customers",
        },
      },
      { status: 500 },
    );
  }
}
