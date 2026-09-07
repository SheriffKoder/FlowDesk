/**
 * @file tests/unit/customer-drawer-state.test.ts
 *
 * Purpose: Unit coverage for customer details open/close/hydrate rules.
 * Used in: Vitest suite (`npm test`); run when drawer URL mirror changes.
 * Used for: Lock ADR-003 — local open, URL hydrate, derived selection only.
 *
 * Suites:
 * 1. createDrawerStateFromUrl — cold load / blank → closed
 * 2. openCustomerDrawer / closeCustomerDrawer — click paths
 * 3. drawerSelectedCustomerId — selection only while open
 */

import { describe, expect, it } from "vitest";

import {
  CLOSED_CUSTOMER_DRAWER,
  closeCustomerDrawer,
  createDrawerStateFromUrl,
  drawerSelectedCustomerId,
  openCustomerDrawer,
} from "@/features/customer-drawer";

/////////////////////////////////////////////////////////////
// 1. Hydrate from URL
/////////////////////////////////////////////////////////////

describe("createDrawerStateFromUrl", () => {
  it("opens when customerId is present", () => {
    expect(createDrawerStateFromUrl("cust_01")).toEqual({
      open: true,
      customerId: "cust_01",
    });
  });

  it("stays closed for null or blank", () => {
    expect(createDrawerStateFromUrl(null)).toEqual(CLOSED_CUSTOMER_DRAWER);
    expect(createDrawerStateFromUrl("")).toEqual(CLOSED_CUSTOMER_DRAWER);
    expect(createDrawerStateFromUrl("   ")).toEqual(CLOSED_CUSTOMER_DRAWER);
  });
});

/////////////////////////////////////////////////////////////
// 2. Open / close
/////////////////////////////////////////////////////////////

describe("openCustomerDrawer / closeCustomerDrawer", () => {
  it("opens and stores the trimmed id", () => {
    expect(openCustomerDrawer("  cust_02  ")).toEqual({
      open: true,
      customerId: "cust_02",
    });
  });

  it("treats blank open as closed", () => {
    expect(openCustomerDrawer("   ")).toEqual(CLOSED_CUSTOMER_DRAWER);
  });

  it("close clears open and id", () => {
    expect(closeCustomerDrawer()).toEqual(CLOSED_CUSTOMER_DRAWER);
  });
});

/////////////////////////////////////////////////////////////
// 3. Derived selection
/////////////////////////////////////////////////////////////

describe("drawerSelectedCustomerId", () => {
  it("returns id only while open", () => {
    expect(
      drawerSelectedCustomerId({ open: true, customerId: "cust_03" }),
    ).toBe("cust_03");
    expect(
      drawerSelectedCustomerId({ open: false, customerId: "cust_03" }),
    ).toBeNull();
    expect(drawerSelectedCustomerId(CLOSED_CUSTOMER_DRAWER)).toBeNull();
  });
});
