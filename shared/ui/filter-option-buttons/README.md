# Shared UI — FilterOptionButtons

Dumb toggle button row from option config. No router / URL knowledge.

## Behavior

- **Multi** (default): click toggles membership; `onChange` receives ordered values.
- **Single**: click selects one; click again clears.
- Empty `value` = nothing selected (callers treat as “all” for list filters).

## Usage

```tsx
<FilterOptionButtons
  label="Segment"
  options={CUSTOMER_SEGMENT_OPTIONS}
  value={params.segment}
  selectionMode="multi"
  onChange={(segment) => patchParams({ segment })}
/>
```
