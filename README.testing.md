# Testing

This document describes testing goals, conventions, and how to run tests in this repo. The app is a Vite + React + TypeScript monorepo with npm workspaces; tests use [Vitest](https://vitest.dev/).

---

## Goals and philosophy

- **Confidence over coverage**: Tests should give confidence that behavior is correct, not chase a percentage. Prefer a small set of meaningful tests over many trivial ones.
- **Stable feedback**: Tests are part of the normal workflow. They should run quickly and fail only when behavior actually changes.
- **Incremental adoption**: Testing is added gradually. New code can adopt these conventions; existing code is not rewritten for tests.

---

## What “meaningful tests” mean here

A test is meaningful when it reduces risk or documents behavior that would be easy to break:

- **Happy path**: Core behavior with valid, typical inputs. Answers “does the main use case work?”
- **Edge cases**: Empty inputs, boundary values, optional/undefined, single-item lists, max lengths, etc. Answers “does it behave correctly at the edges?”
- **Failure modes**: Invalid input, missing data, errors from dependencies. Answers “does it fail safely and predictably?”

Focus on pure logic, data transformations, validation, and branching. Prefer testing functions and small modules rather than large UI trees.

---

## What not to test

- **Visual effects and animation timing**: Framer Motion, CSS transitions, and layout effects are hard to assert meaningfully in unit tests and are better verified manually or with visual/E2E tools.
- **Animation implementation details**: Exact keyframes, durations, or easing unless they are part of a strict contract (e.g. shared constants).
- **Trivial re-exports**: Files that only re-export from another module add no behavior; skip testing them.
- **Third-party libraries**: Don’t test React, Vite, or other deps; test how *this* code uses them only when that usage is non-trivial.

---

## Determinism rules

Tests must be deterministic so they can be run anywhere and produce the same result:

- **No real time**: Use fake timers (`vi.useFakeTimers()`) for `setTimeout`, `setInterval`, or time-based logic. Avoid `Date.now()` or real delays unless explicitly testing time in a controlled way.
- **No real network**: Mock HTTP (e.g. `vi.mock('axios')`, fetch mocks, or MSW). No live API calls.
- **Mock randomness**: If code uses `Math.random()` or similar, either inject a seeded source or mock it so outcomes are reproducible.

---

## Incremental strategy

- **Small batches**: Add tests in small, focused batches (e.g. one module or one behavior at a time).
- **No big refactors for tests**: Do not refactor large parts of the app solely to make testing easier. Introduce testability gradually (e.g. extract pure functions, inject dependencies) only where it’s low-risk and high-value.
- **Start with high-value code**: Prioritize shared utils, validation, form logic, and data transforms in `lib/*` and `src/` where behavior is clear and bugs are costly.

---

## How to run tests

- **Whole repo** (from repo root):
  ```bash
  npm test
  ```
  This runs Vitest for the entire workspace (root + workspaces under `lib/*`), using the root `package.json` script.

- **Targeted run** (single workspace or path):
  ```bash
  npm test -- --dir lib/utils/validation
  npm test -- lib/utils/validation
  npm test -- lib/uno --run
  ```
  To run only `lib/uno` tests (rules, shortcuts, theme): `npm test -- lib/uno --run`.
  Or run Vitest in a specific workspace directory; exact CLI may depend on your Vitest config (e.g. `vitest run --dir lib/utils/validation`). Adjust to match your `vitest.config.*` or `vite.config` test settings.

  If you use a workspace-specific script, run from that workspace:
  ```bash
  cd lib/utils/validation && npm test
  ```
  Note: many `lib/*` packages currently have a placeholder `"test": "echo \"Error: no test specified\" && exit 1"`. Real tests are intended to be run from the root with `npm test` and Vitest discovering files by pattern (e.g. `*.test.ts`).

---

## Conventions for test file placement and naming

- **Location**: Prefer **colocated** test files next to the code they cover:
  - `foo.ts` → `foo.test.ts` (same directory)
  - Or a `__tests__` directory beside the module (e.g. `utils/__tests__/format.test.ts` for `utils/format.ts`).
- **Naming**:
  - `*.test.ts` or `*.test.tsx` for TypeScript/React.
  - `*.spec.ts` or `*.spec.tsx` is acceptable if the project standardizes on it; this doc uses `.test.*` for consistency.
- **Scope**: Tests under `lib/*` belong next to the module they test (or in a local `__tests__`). App-level or integration-style tests can live under `src/` (e.g. `src/**/*.test.tsx`) if you introduce them later.

These conventions keep tests easy to find and avoid one giant `tests/` folder that doesn’t mirror the source layout.

---

## Environment: node vs jsdom

- **Default**: Vitest runs tests in the **node** environment. Use it for pure logic, data transforms, and anything that does not need `document` or `window`.
- **jsdom only when required**: For DOM-adjacent code (elements, `document`, `window`, or React hooks that run effects with timers/DOM), use jsdom only for those test files so the rest stay fast and node-only.

**Per-file configuration**: At the top of a test file that needs the browser-like environment, add:

```ts
/** @vitest-environment jsdom */
```

(or `// @vitest-environment jsdom` before any imports). No global config change is needed; only those files run in jsdom.

**Example — which tests use jsdom and why**:

| Test file | Environment | Why |
|-----------|-------------|-----|
| `lib/measure/utils/resolveSquare.test.ts` | node | Pure function; no DOM. |
| `lib/measure/utils/resolveElementDimensions.test.ts` | node | Accepts plain objects or null; no real elements. |
| `lib/measure/utils/resolveAspectRatio.test.ts` | jsdom | Reads `element.clientWidth` / `naturalWidth`; needs DOM elements. |
| `lib/hooks/window/useDelay.test.tsx` | jsdom | React hook; needs render, `useEffect`, and `setTimeout` (fake timers used for determinism). |

**Run this batch** (DOM-adjacent measure + useDelay):

```bash
npm test -- lib/measure/utils/resolveSquare.test.ts lib/measure/utils/resolveElementDimensions.test.ts lib/measure/utils/resolveAspectRatio.test.ts lib/hooks/window/useDelay.test.tsx --run
```

Or run by path:

```bash
npm test -- lib/measure/utils --run
npm test -- lib/hooks/window --run
```
