# `src/domain/` — business logic (framework-agnostic)

No React, no Next.js imports. UI and API layers call into here.

| Folder | Responsibility |
|--------|----------------|
| [`goal-matching/`](./goal-matching/) | Map learner text → catalog **skills** + **practice patterns** |
| [`practice/`](./practice/) | Stage → practice block groups; sprint stage URLs |

**Imports:** `@/domain/goal-matching`

**Glossary:** [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)
