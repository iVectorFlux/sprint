'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSprintContext } from '@/hooks/useSprintContext'
import { useArchetypeFlow } from '@/hooks/useArchetypeFlow'
import { ARCHETYPE_ICONS, ARCHETYPE_LABELS } from '@/types'

export default function SprintFlowLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { sprintId, archetype, skillName, displayName } = useSprintContext()
  const flow = useArchetypeFlow(archetype)

  // Extract current path segment after /sprint/[id]/
  const parts = pathname.split('/')
  const sprintIdx = parts.indexOf('sprint')
  // Current segment is everything after the sprint ID (could be 'simulation/guided')
  const afterId = parts.slice(sprintIdx + 2).join('/')

  const archetypeIcon = ARCHETYPE_ICONS[archetype]
  const archetypeLabel = ARCHETYPE_LABELS[archetype]

  return (
    <div className="sprint-flow-shell">
      {/* Sprint Top Bar */}
      <header className="sprint-flow-header">
        <div className="sprint-flow-header-left">
          <Link
            href="/dashboard"
            className="sprint-flow-back"
            title="Back to Dashboard"
          >
            ←
          </Link>
          <div className="sprint-flow-brand">
            <span className="sprint-flow-brand-icon">{archetypeIcon}</span>
            <div className="sprint-flow-brand-text-group">
              <span className="sprint-flow-brand-text">{displayName}</span>
              <span className="sprint-flow-brand-archetype">{archetypeLabel} Sprint</span>
            </div>
          </div>
        </div>

        {/* Dynamic Stage Pills — changes per archetype */}
        <nav className="sprint-flow-stages" aria-label="Sprint stages">
          {flow.navItems.map((stage) => {
            const isActive = flow.isActive(stage.key, afterId)
            const isCompleted = flow.isCompleted(stage.key, afterId)

            return (
              <Link
                key={stage.key}
                href={`/dashboard/sprint/${sprintId}/${stage.key}`}
                className={[
                  'sprint-flow-stage-pill',
                  isActive ? 'sprint-flow-stage-pill-active' : '',
                  isCompleted ? 'sprint-flow-stage-pill-completed' : '',
                ].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="sprint-flow-stage-icon">
                  {isCompleted ? '✅' : stage.icon}
                </span>
                <span className="sprint-flow-stage-label">{stage.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Archetype badge — right side */}
        <div className="sprint-flow-archetype-badge" title={`Practice format: ${archetypeLabel}`}>
          <span>{archetypeIcon}</span>
          <span className="sprint-flow-archetype-label">{archetypeLabel}</span>
        </div>
      </header>

      {/* Stage Content */}
      <main className="sprint-flow-content">{children}</main>
    </div>
  )
}
