# Customer Health Overview Page — Frontend
## Implementation Plan

This plan outlines my approach to building the Customer Health Overview Page for FlowDesk, following the project scope and user stories provided. I designed it with a feature-based, SRP-driven structure, ensuring maintainability, scalability, and clear separation of concerns between server and client components.

## A. High-Level Estimation

- Page setup, server component, and layout: 2–3 hours
- Filter bar and URL syncing: 1–2 hours
- Customer table with server-side pagination: 4–5 hours
- Right-side panel with client-side data fetching: 3–4 hours
- Loading, error, and empty states: 1–2 hours
- UX polish (scroll preservation, selection, keyboard nav, ARIA): 2–3 hours
- Total: ~13–19 hours (~2–3 working days) assuming designs are provided and APIs are ready.

## B. Architecture & Component Structure

### Component Breakdown

- Page.tsx (Server): Data orchestration, fetch customer list, provide searchParams to container
- FilterBar (Client): URL-driven filtering/search
- CustomerHealthView (Client): UI coordination (table ↔ panel)
- CustomerTable (Client): Display paginated, sortable customer data
- RightSidePanel (Client): Fetch & display selected customer details
- Table subcomponents (Client): TableRow, TableCell, TableHeader, Pagination

### Page Structure & Server-first Data Flow

```
/app/customer-health/page.tsx # Server component orchestrating page
/app/customer-health/loading.tsx # Skeletons for loading
/app/customer-health/error.tsx # Route-level error handling
/components/CustomerHealthView/
├─ CustomerHealthView.tsx # Client container: table + panel
├─ RightSidePanel.tsx # Customer details panel
├─ FilterBar/
│ ├─ FilterBar.tsx # Search + segment filter
│ ├─ SearchInput.tsx
│ └─ SegmentFilter.tsx
├─ hooks/useCustomerHealth.ts
└─ utils/api.ts
/features/table/
├─ TableComponent.tsx
├─ TableRow.tsx
├─ TableCell.tsx
├─ TableHeader.tsx
├─ TableContainer.tsx
├─ Pagination.tsx
├─ hooks/useTablePrefetch.ts
├─ utils/tableHelpers.ts
└─ configs/tableConfigs.ts
/types/ # TypeScript interfaces
/utils/ # Shared utilities
/styles/tailwind.config.js
```

### Server components vs. client components, and why.

The page uses a server-first rendering approach to optimize for fast initial load, SEO, and predictable data flow. page.tsx is a Server Component because it orchestrates URL-driven data fetching (filters, pagination, sorting) and ensures that business-critical data is rendered fully on first paint. This approach aligns with the business goal of delivering reliable, immediately visible insights to CSMs. Client Components are used selectively for interactivity: CustomerHealthView, table, filters, and the right-side panel. These components handle user interactions, transient UI state, and asynchronous fetches without compromising the server-rendered list. We avoid wrapping the entire page in a client component with TanStack Query, because it would shift core data fetching to the client, introducing unnecessary loading states and reducing predictability. TanStack Query is scoped to the panel to provide caching, retries, and background refreshes—improving UX while keeping server-first benefits intact.

## C. Data Fetching & State Management

### Fetching the paginated list of customers.

The paginated customer list is fetched in the Server Component (page.tsx) using URL searchParams as the source of truth for pagination, filters, and search. These parameters are parsed and validated on the server, then passed directly to the backend API. This ensures the initial render is fully populated, shareable via URL, and avoids client-side loading waterfalls. Pagination changes update the URL, which naturally triggers a new server render with the correct data ensuring CSMs always see reliable, up-to-date snapshots of customer health.

### Fetching customer health details on row click.

Customer health details are fetched on demand when a row is selected. The selected customer ID is stored in the URL (e.g. ?selectedId=...) using useRouter, making selection navigable and restorable. The right-side panel is a Client Component that reads this parameter and triggers a detail fetch (via TanStack Query or a client fetch) scoped only to the panel. This isolates failures and loading states so the table remains stable while details load independently ensuring quick, isolated access to customer details without disrupting workflow.

### Managing loading, error, and empty states.

Server-side loading is handled using either route-level loading.tsx for full-page skeletons or inline skeletons for more granular control, depending on UX needs. Server fetch failures render explicit error or empty states without hydrating unnecessary client logic. On the client side, the table and details panel manage their own loading, error, and empty states independently—ensuring slow or failed detail requests do not block or reset the main list. This separation provides clear feedback while maintaining UI continuity.

### Libraries or patterns used

#### Routing & URL State

- Next.js App Router (page.tsx, searchParams)
  We use searchParams in the server page.tsx as the single source of truth for pagination, search, filters, and selection. This allows the page to render correctly on first load, enables deep-linking and back/forward navigation, and ensures all data fetching remains deterministic and server-driven.
- useRouter & useSearchParams (Client Components)
  In client components, useRouter and useSearchParams are used to update and read URL state in response to user interactions (row selection, pagination, sorting). This avoids duplicating state locally and keeps UI behavior consistent with browser navigation semantics.

#### Data Fetching

- Built-in fetch in Server Components
  The paginated customer list is fetched using Next.js’s built-in fetch inside Server Components. This keeps the initial render fast, avoids client-side waterfalls, and allows caching and revalidation to be handled at the framework level without introducing additional libraries.
- TanStack Query (Client-only, scoped usage)
  TanStack Query is used only in client components where data is interaction-driven, such as fetching customer health details for the side panel or prefetching detail data. This enables request deduplication, retry handling, and loading states without converting the entire page into a client component.

#### State Management

- Local React State (useState)
  Local UI state (e.g. selected row highlight, panel open/close behavior) is managed with useState inside the client container. This keeps transient UI concerns simple and avoids premature abstraction.
- Reducer Pattern (Deferred / Optional)
  A future useReducer pattern is noted as an extension point if UX complexity increases (keyboard navigation, batch actions, undo states). It is intentionally not implemented to keep the solution proportional to the task scope.

## D. UX Details & Edge Cases

### Handling Slow Network Responses

For slow network responses, we rely on progressive rendering and visual feedback rather than blocking the UI. The server-rendered table shows either cached data or a route-level skeleton via loading.tsx during navigation. For interaction-driven requests (like loading the right-side panel), we use inline loading states scoped to the panel only, so the table remains usable. This prevents the entire page from feeling frozen and isolates latency to the part of the UI that actually depends on the slow request.

### Keeping Filters & Search in Sync with the URL

Filters, search, pagination, and sorting are treated as URL state, not local component state. User interactions update searchParams via useRouter, and the server page.tsx reads those params to fetch data. This ensures the UI is always reproducible from the URL, supports refresh and deep-linking, and keeps browser back/forward behavior predictable without manual state restoration ensuring users return to the same context.

### Preserving Scroll Position & Selection on Navigation

Scroll position and row selection are preserved by avoiding full remounts and using the URL as the source of truth. When navigating back, Next.js restores scroll automatically as long as the route does not change. Row selection is restored by reading the selected customer ID from searchParams and reapplying the active state in the table. This ensures the user returns to the same context without relying on in-memory state that would be lost on navigation.

### 3–5 UX edge cases would be considered:

- Debounced / Enter-submit search: Debounced / Enter-submit search to balance responsiveness and request load.
- Stale-while-revalidate panel data: Show cached customer details immediately with a subtle “Refreshing…” indicator until fresh data arrives.
- Isolated panel error handling: Panel fetch failures don’t block the table; users can retry or close and continue working.
- Keyboard-accessible table navigation: Arrow key row navigation and Enter to select, improving accessibility and power-user flow.
- Clear zero-state messaging: When filters or search return no results, show an explicit explanation with an actionable suggestion.

## E. Task Breakdown (Ticket-style)

1. Setup /app/customer-health/page.tsx (Server Component)
   - Accept and parse searchParams
   - Fetch paginated customer list
   - Define the page as the data orchestration boundary
2. Define URL contract (params schema & defaults)
   - page, pageSize, search, segment, sort_by, sort_order, selectedId
   - Decide reset rules (e.g., filters reset page to 1)
3. Implement FilterBar (client) with URL sync
   - Read/write search & segment params
   - Ensure changes are reflected server-side via navigation
4. Implement CustomerHealthView (client container, URL-driven)
   - Derive selectedId from useSearchParams
   - Own coordination between table ↔ panel
   - No local selection state beyond derived values
5. Implement reusable CustomerTable (server-driven data)
   - Render data passed from the server
   - Emit row click → update selectedId param
   - Support server-side pagination & sorting
6. Implement Table subcomponents
   - TableHeader (sortable columns)
   - TableRow (selection + hover)
   - TableCell, Pagination, container
7. Integrate table config object (/features/table/configs)
   - Column definitions
   - Sortability rules
   - Page size options
8. Implement RightSidePanel (client) with TanStack Query
   - Enabled only when selectedId exists
   - Read ID from URL, not internal state
   - Isolated loading / error / retry behavior
9. Add optional prefetching on row hover/focus
   - Prefetch customer details via TanStack
   - Treat as progressive enhancement
10. Implement route-level loading skeletons
    - loading.tsx for table + filters
    - Avoid client spinners where possible
11. Implement error states with retry
    - error.tsx for server data
    - Panel-level error UI for client fetches
12. Implement scroll preservation & selection highlighting
    - Restore scroll position
    - Highlight row via selectedId param
13. Verify semantic HTML & accessibility
    - <table>, <thead>, <tbody>
    - ARIA labels
    - Keyboard navigation & focus management
