# Goal matching

Maps free-text goals (“budget meeting with execs”) to:

- **Skills** in `src/data/skills-taxonomy.ts`
- **Practice patterns** (`cognitive-patterns.ts`, per-skill `skill-dna.ts`)

## API

```ts
import { matchLearningGoal } from '@/domain/goal-matching'

const result = matchLearningGoal(userText)
// result.skills → suggested sprints
// result.patternLabels → “Capabilities we detected”
// result.path → 'catalog' | 'novel'
```

## Files

| File | Role |
|------|------|
| `resolver.ts` | Scoring + ranking |
| `skill-dna.ts` | Practice patterns per skill |
| `cognitive-patterns.ts` | Pattern enum + labels |
| `intent-keywords.ts` | Phrase → pattern boosts |

Legacy alias: `resolveCapabilities` (= `matchLearningGoal`).
