# The Product Context

You are a frontend developer at FlowDesk, a SaaS product that gives customer success teams a 360° view of their customers.

**Stack:** React + Next.js (App Router), TypeScript, Tailwind (or similar), and a design system with prebuilt components.

**APIs:** REST/GraphQL APIs provide customer, usage, and billing data.

# The Feature Brief: "Customer Health Overview Page"

**Business Goal:** Customer success managers (CSMs) need a simple way to quickly understand which customers are healthy and which are at risk, so they can prioritize their time.

## User Stories:

1. As a CSM, when I open the "Customer Health" page, I want to see a sortable table of customers with key data (name, MRR, last active, health score, owner).
2. As a CSM, I want to click on a customer row to open a right-side panel (or route) showing more details: recent events, usage trends, and notes.
3. As a CSM, I want to filter customers by health segment (Healthy / Watch / At Risk) and search by name/domain.

## Technical Requirements:

1. This page should be built as a Next.js route, using server components where appropriate.
2. Data is exposed via:

```
GET /api/customers?search=&segment=&page=&page_size=
GET /api/customers/{id}/health
```

3. The table must support server-side pagination for large datasets.
4. Loading and error states should be graceful and consistent with the design system.

# Your Task: Plan the Frontend Implementation

Your goal is to design how you would build this page and its components. Please provide a written document (Markdown preferred) that covers:

## A. High-Level Estimation

Provide a rough estimate (range is fine) for delivering this feature on the frontend, assuming designs are available.

## B. Architecture & Component Structure

Describe the page structure in Next.js (route, layout, main components).

Propose a component breakdown (e.g., `CustomerHealthPage`, `CustomerTable`, `CustomerRow`, `CustomerDetailsPanel`, `HealthBadge`).

Explain where you would use server components vs. client components, and why.

## C. Data Fetching & State Management

Describe how you would handle:

- Fetching the paginated list of customers.
- Fetching customer health details on row click.
- Managing loading, error, and empty states.

Which libraries or patterns (e.g., React Query, built-in fetch with server components, SWR, custom hooks) would you use and why?

## D. UX Details & Edge Cases

How would you handle:

- Slow network responses?
- Keeping filters/search in sync with the URL?
- Preserving scroll position or selection when navigating back to the page?

List 3–5 UX edge cases you would consider.

## E. Task Breakdown

Break the implementation down into a concrete list of tasks suitable for a small ticket backlog (e.g., "Implement table shell with mock data," "Wire up server-side pagination," "Implement customer details panel").