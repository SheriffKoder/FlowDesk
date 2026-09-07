# Unit tests

Pure rules only.

| File | Covers |
|---|---|
| `list-url-params.test.ts` | parse/serialize, health-then-name default, page reset, clamp, invalid fallbacks |
| `customer-schemas.test.ts` | list + health Zod / transforms |
| `debounce.test.ts` | shared `debounce` quiet period, cancel, flush |

Add cases alongside drawer hook and health cache as those land.
