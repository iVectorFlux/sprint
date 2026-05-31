import type { SkillArchetype, StageType } from '@/types'
import { ARCHETYPE_STAGE_FLOWS, STAGE_URL_SEGMENT } from '@/types'

/** First stage URL for a taxonomy sprint slug. */
export function getSprintStageUrl(
  sprintSlug: string,
  stage: StageType
): string {
  const segment = STAGE_URL_SEGMENT[stage] ?? stage.replace(/_/g, '-')
  return `/dashboard/sprint/${sprintSlug}/${segment}`
}

export function getFirstStageUrl(sprintSlug: string, archetype: SkillArchetype): string {
  const first = ARCHETYPE_STAGE_FLOWS[archetype][0]
  return getSprintStageUrl(sprintSlug, first)
}
