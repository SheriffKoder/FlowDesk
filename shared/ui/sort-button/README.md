# Shared UI — SortButton

Dumb dual-arrow sort toggle for table header cells. No router / URL knowledge.

Adapted from `app/development/url-kit/sorting` `SortButton` (presentation only).

## Behavior

- Shows up + down arrows; active direction uses `text-primary`.
- Caller owns cycle: typically **none → asc → desc → remove**.
- `direction={null}` = this column is not in the explicit URL sorts.
- Optional `priority` (0-based) shows a small badge for multi-level sorts.

## Usage

```tsx
<th aria-sort={ariaSort}>
  <div className="flex items-center justify-between gap-1">
    <span>MRR</span>
    <SortButton
      label="MRR"
      direction={direction}
      priority={level}
      onToggle={() => onSortToggle("mrr")}
    />
  </div>
</th>
```
