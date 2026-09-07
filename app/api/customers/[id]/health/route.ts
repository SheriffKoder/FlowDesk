/**
 * @file GET /api/customers/[id]/health — health placeholder (implement in Data & API tickets).
 */

import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return NextResponse.json(
    {
      message:
        "GET /api/customers/{id}/health scaffold placeholder — payload lands in later tickets.",
      customerId: id,
    },
    { status: 501 },
  );
}
