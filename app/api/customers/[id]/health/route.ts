/**
 * @file app/api/customers/[id]/health/route.ts
 *
 * Purpose: Thin GET /api/customers/{id}/health adapter → getCustomerHealth.
 * Used in: Drawer health fetch (later), integration tests.
 * Used for: Happy path JSON + 404 not-found mapping.
 */

import { NextResponse } from "next/server";

import {
  getCustomerHealth,
  isCustomerError,
} from "@/entities/customer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/customers/[id]/health — drawer health detail.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const detail = getCustomerHealth(id);
    return NextResponse.json(detail);
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
          message: "Unexpected error loading customer health",
        },
      },
      { status: 500 },
    );
  }
}
