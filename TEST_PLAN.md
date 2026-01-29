# Test plan: prioritized candidate modules

This document follows **README.testing.md** exactly. It lists where Vitest is configured, how test files are discovered, and a prioritized queue of 20 candidate modules to test first (pure logic; avoid trivial re-exports and animation timing).

---

## 1. Vitest configuration and test discovery

### Configuration

- **Root `package.json`**: script `"test": "vitest"` (line 17). No `vitest.config.*` file exists.
- **`vite.config.ts`**: Re-exports `config/vite/index.ts`; that file has **no** `test` block. Vitest therefore runs with **defaults** (no explicit `include`/`exclude` in this repo).

### Test file discovery

Vitest’s default `include` pattern is:

- **Pattern**: `**/*.{test,spec}.?(c|m)[jt]s?(x)`
- **Meaning**: Any file named `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`, or the same with `.mts`/`.cts`/`.mjs`/`.cjs` variants, anywhere under the project root.
- **Scope**: Root + workspace packages (e.g. `lib/*`) are part of the same repo; colocated tests (e.g. `foo.test.ts` next to `foo.ts`) or `__tests__` directories will be picked up once present.

**Current state**: No `*.test.*` or `*.spec.*` files exist yet; discovery will apply as soon as the first such file is added.

---

## 2. Files inspected

Exact paths used to produce this plan:

| Path | Purpose |
|------|---------|
| `README.testing.md` | Conventions, goals, what to test / not test |
| `package.json` | Scripts, workspaces, deps |
| `vite.config.ts` | Entry point for Vite config |
| `config/vite/index.ts` | Actual Vite config (no test block) |
| `lib/utils/validation/index.ts` | Validation exports |
| `lib/utils/validation/assertion.ts` | Assertion helper |
| `lib/utils/validation/is/defined.ts` | Type guard |
| `lib/utils/validation/is/falsy.ts` | Type guard |
| `lib/utils/validation/is/null.ts` | Type guard |
| `lib/utils/validation/is/number/index.ts` | isNumber |
| `lib/utils/validation/is/number/finite.ts` | isNumberFinite |
| `lib/utils/validation/is/string.ts` | Type guard |
| `lib/utils/validation/is/timeout.ts` | Type guard |
| `lib/utils/validation/is/truthy.ts` | Type guard |
| `lib/utils/validation/is/value.ts` | Type guard |
| `lib/utils/object/mergeDeep.ts` | Deep merge |
| `lib/utils/object/arrToRecord.ts` | Array → record |
| `lib/utils/object/prefixKeys.ts` | Prefix keys/values |
| `lib/utils/object/sortKeys.ts` | Sort object keys |
| `lib/utils/object/scopeRecord.ts` | Scoped record (uses prefixKeys) |
| `lib/utils/format/url.ts` | URL formatting |
| `lib/utils/unit/resolveRemFromPx.ts` | px → rem |
| `lib/utils/unit/stripPx.ts` | Strip "px" to number |
| `lib/utils/unit/resolveIntRecord.ts` | px record → int record |
| `lib/utils/transformer/colorToStyles.ts` | Color → style record |
| `lib/utils/transformer/newlineToArr.ts` | String → trimmed lines |
| `lib/utils/function/once.ts` | Run-once wrapper |
| `lib/utils/error/resolveErrorMessage.ts` | Error → message |
| `lib/utils/error/detail/resolveDetailMessage.ts` | Detail logging (side-effect) |
| `lib/utils/key/generateRandomId.ts` | Random ID (uses `window.crypto`) |
| `lib/utils/key/resolve-composite-key.ts` | Composite key from args |
| `lib/utils/random/resolveRandomItem.ts` | Random item (uses `Math.random`) |
| `lib/utils/box/is.ts` | Box config type guards |
| `lib/config/constants/number/series.ts` | DIGITS / INDICIES |
| `lib/config/constants/number/index.ts` | Re-export only (excluded) |
| `lib/motion/config/constants/core.ts` | Motion constants |
| `lib/motion/config/constants/index.ts` | Re-export only (excluded) |
| `lib/color/base/formatRgb.ts` | formatRgbValue |
| `lib/color/base/formatRgba.ts` | formatRgba |
| `lib/color/base/resolveRgba.ts` | resolveRgba |
| `lib/color/gradient/resolveGradient.ts` | Gradient string |
| `lib/color/grayscale/resolveGrayscaleRange.ts` | Grayscale range |
| `lib/color/grayscale/resolveGrayscaleRgb.ts` | Grayscale RGB string |

---

## 3. Prioritized list: 20 candidate modules

Preference: **lib/utils**, **lib/color**, **lib/config/constants**, **lib/motion/config/constants**. Excluded: trivial re-exports, animation timing logic, and modules that are only side-effect (e.g. console.log) unless they also return useful values.

| # | Module path | Why it matters | Suggested test cases | Complexity |
|---|-------------|-----------------|----------------------|------------|
| 1 | `lib/utils/validation/assertion.ts` | Runtime assert used to enforce invariants; wrong behavior can hide bugs or throw when it shouldn’t. | **Happy**: assert truthy (no throw). **Edge**: assert with custom message. **Failure**: assert falsy throws Error with message. | S |
| 2 | `lib/utils/validation/is/defined.ts` | Core type guard; many other guards depend on “defined”. | **Happy**: defined value returns true. **Edge**: undefined returns false. **Failure**: null is defined (typeof), so document behavior. | S |
| 3 | `lib/utils/validation/is/string.ts` | Simple type guard used in validation and transforms. | **Happy**: string returns true. **Edge**: empty string, non-string (number, null, undefined) return false. | S |
| 4 | `lib/utils/validation/is/number/finite.ts` | Guards for numeric logic; NaN/Infinity bugs are subtle. | **Happy**: finite number returns true. **Edge**: NaN, Infinity, non-number return false. | S |
| 5 | `lib/utils/validation/is/value.ts` | “Non-null, non-undefined” guard used across the app. | **Happy**: value returns true. **Edge**: null, undefined return false. | S |
| 6 | `lib/utils/validation/is/falsy.ts` | Falsy guard; consistency with isTruthy matters. | **Happy**: falsy values (false, 0, '', null, undefined, NaN) return true. **Edge**: truthy values return false. | S |
| 7 | `lib/utils/validation/is/truthy.ts` | Delegates to isFalsy; one test confirms ¬isFalsy. | **Happy**: truthy returns true, falsy returns false. **Edge**: all falsy cases from isFalsy. | S |
| 8 | `lib/utils/validation/is/null.ts` | Explicit null guard for nullable types. | **Happy**: null returns true. **Edge**: undefined, 0, '' return false. | S |
| 9 | `lib/utils/unit/stripPx.ts` | Parses "Npx" or number; wrong parsing breaks layout/utils. | **Happy**: "16px" → 16, number → same number. **Edge**: "0px", empty/malformed string (NaN). **Failure**: non-px string. | S |
| 10 | `lib/utils/unit/resolveRemFromPx.ts` | Converts px to rem with base; wrong base or formula breaks layout. | **Happy**: e.g. 16, 16 → "1rem". **Edge**: base 10, 0 px. **Failure**: negative (if allowed). | S |
| 11 | `lib/utils/format/url.ts` | URL display formatting; regressions affect links/copy. | **Happy**: full URL → "www.domain..." without protocol. **Edge**: already no protocol, with/without trailing slash. **Failure**: empty string. | S |
| 12 | `lib/utils/transformer/newlineToArr.ts` | Splits and trims lines; used for config/content. | **Happy**: "a\nb\nc" → ["a","b","c"]. **Edge**: empty string → [], single line, blank lines filtered. **Failure**: non-string (if typed only). | S |
| 13 | `lib/utils/transformer/colorToStyles.ts` | Maps color to text/bg styles; wrong shape breaks UI. | **Happy**: color string → { text: { color }, bg: { backgroundColor } }. **Edge**: empty string. | S |
| 14 | `lib/utils/object/arrToRecord.ts` | Builds record from array by key; key type/duplicates matter. | **Happy**: array of objects with string key → record. **Edge**: empty array → {}, duplicate keys (last wins). **Failure**: non-string key value skipped. | S |
| 15 | `lib/utils/object/sortKeys.ts` | Deterministic key order; affects serialization/diffs. | **Happy**: object → same object with keys sorted. **Edge**: empty object, single key. | S |
| 16 | `lib/config/constants/number/series.ts` | DIGITS / INDICIES used as shared constants. | **Happy**: DIGITS and INDICIES have expected length and values. **Edge**: immutability (e.g. freeze). | S |
| 17 | `lib/motion/config/constants/core.ts` | Shared motion constants (duration, keys, presence configs). | **Happy**: Exported constants have expected shape (e.g. DURATION, VALUE_DELIMITER, PRESENCE_*). **Edge**: Strict contract for a subset used by motion core. | S |
| 18 | `lib/utils/object/mergeDeep.ts` | Deep merge; mismerge corrupts config/state. | **Happy**: nested objects merged, primitives overwritten. **Edge**: empty sources, arrays (not merged as objects). **Failure**: non-plain objects, null. | M |
| 19 | `lib/utils/object/prefixKeys.ts` | Prefixes keys and optionally values; regex and arrays. | **Happy**: record → prefixed keys; optional prefixValuesRx replaces value refs. **Edge**: empty record, array values joined. **Failure**: invalid regex. | M |
| 20 | `lib/utils/function/once.ts` | Run-once wrapper; wrong invocation count breaks listeners/subscriptions. | **Happy**: first call runs fn and returns value; second call returns same value without calling fn. **Edge**: fn that returns undefined; multiple args. **Failure**: fn that throws (once should throw once). | M |

**Reserve / follow-up** (same priority areas, slightly lower order or need mocks):

- `lib/utils/unit/resolveIntRecord.ts` — depends on stripPx; test after stripPx. **S**
- `lib/utils/object/scopeRecord.ts` — depends on prefixKeys; test after prefixKeys. **M**
- `lib/utils/validation/is/timeout.ts` — type guard for number (timeout handle). **S**
- `lib/utils/key/resolve-composite-key.ts` — composite key from args; edge: all undefined/null. **S**
- `lib/utils/error/resolveErrorMessage.ts` — returns nothing in current impl; test only if contract becomes “return string”. **S**
- `lib/color/base/formatRgb.ts` — formatRgbValue(rgb). **S**
- `lib/color/base/formatRgba.ts` — formatRgba(rgb, opacity). **S**
- `lib/color/grayscale/resolveGrayscaleRgb.ts` — single gray RGB string. **S**
- `lib/color/gradient/resolveGradient.ts` — gradient string from config; edge: non-array parts. **S**
- `lib/utils/box/is.ts` — type guards for box config; needs box constants. **S**
- `lib/utils/random/resolveRandomItem.ts` — **mock Math.random** for determinism. **S**
- `lib/utils/key/generateRandomId.ts` — **mock window.crypto** for determinism. **S**

---

## 4. Assumptions

1. **Vitest not in `package.json`**: `vitest` does not appear in `devDependencies` or `package-lock.json`. README says tests use Vitest and `npm test` runs it; you may need to add `vitest` (and optionally `@vitest/coverage-*`) before adding tests.
2. **Test discovery**: With no `vitest.config.*` and no `test` block in `config/vite/index.ts`, Vitest’s default include pattern is used. No explicit `root` or `include` was added; if you add a root-level Vitest config later, keep the same pattern (`**/*.{test,spec}.?(c|m)[jt]s?(x)`) for consistency with README.
3. **Workspaces**: `npm test` is run from repo root; Vitest will search the whole workspace. Colocated `*.test.ts` under `lib/*` or `src/` are valid.
4. **Determinism**: For `resolveRandomItem` and `generateRandomId`, tests must use **fake timers** and/or **mocks** (`vi.stubGlobal('Math.random', ...)`, `vi.stubGlobal('crypto.getRandomValues', ...)`) so outcomes are reproducible (per README.testing.md).
5. **Error module**: `resolveErrorMessage` and `resolveDetailMessage` currently rely on `console.log`/`console.error` and do not return a value in all branches; they are deprioritized until they have a clear “return message string” (or similar) contract worth asserting.
6. **Motion constants**: Only the **contract** (exported shape and critical values) is suggested for tests; no assertion on exact animation timing beyond what’s required by shared constants.

---

## 5. Next steps

1. Install Vitest if missing: `npm i -D vitest`.
2. Add one small test file (e.g. `lib/utils/validation/assertion.test.ts`) and run `npm test` to confirm discovery and run.
3. Work through the table in order (1 → 20), adding colocated `*.test.ts` (or `__tests__/*.test.ts`) per README.testing.md.
4. Use `vi.useFakeTimers()` and mocks for any time or randomness in the modules under test.
