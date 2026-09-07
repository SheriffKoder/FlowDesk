/**
 * @file GET /api/customers — list placeholder (implement in Data & API tickets).
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "GET /api/customers scaffold placeholder — search, segment, pagination, and sort land in later tickets.",
      data: [],
      page: 1,
      page_size: 20,
      total: 0,
    },
    { status: 501 },
  );
}
