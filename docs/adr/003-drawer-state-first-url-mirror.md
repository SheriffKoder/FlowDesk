# ADR-003: Drawer state opens, URL mirrors

## Status

Accepted

## Context

We need **fast open** and a **sharable** deep link. Driving open solely from URL navigation delays the shell.

## Decision

- Local state opens/closes the drawer immediately.
- URL `customerId` is mirrored for share, restore, and back/forward.
- On cold load with `customerId`, hydrate local state and open.
- Row selected state is derived from `customerId` only (no duplicate selected-row store).
- Rapid customer switches: cancel in-flight health fetch or key panel content by id so the body never flashes the wrong customer.

## Consequences

- Click path does not wait on the router to paint the panel.
- A drawer hook owns open/close, URL sync, and hydrate-from-URL.
- Careful bidirectional sync is required to avoid update loops.
- Health fetch must be race-safe across quick row clicks.
