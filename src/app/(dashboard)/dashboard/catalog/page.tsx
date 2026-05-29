'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SKILLS_TAXONOMY, SKILL_CATEGORIES, SKILL_ARCHETYPES } from '@/data/skills-taxonomy'
import { ARCHETYPE_LABELS, ARCHETYPE_ICONS, ARCHETYPE_DESCRIPTIONS } from '@/types'
import { useProgressStore } from '@/stores/useProgressStore'
import { toSlug } from '@/hooks/useSprintContext'
import type { SkillArchetype } from '@/types'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeArchetype, setActiveArchetype] = useState<SkillArchetype | null>(null)
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)
  const { skills: progressData, getSkillCompletion } = useProgressStore()

  const filteredSkills = SKILLS_TAXONOMY.filter((skill) => {
    const matchesSearch =
      !search ||
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.sub_skills.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = !activeCategory || skill.category === activeCategory
    const matchesArchetype = !activeArchetype || skill.archetype === activeArchetype
    return matchesSearch && matchesCategory && matchesArchetype
  })

  // Phase 2 archetypes show a "coming soon" state
  const PHASE_2_ARCHETYPES: SkillArchetype[] = ['creation', 'performance', 'systems']

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <section style={{ marginBottom: 'var(--stack-md)' }}>
        <h2 className="headline-md" style={{ marginBottom: 4 }}>
          Skills catalog
        </h2>
        <p className="body-sm">
          {SKILLS_TAXONOMY.length} capabilities across {SKILL_ARCHETYPES.length} practice archetypes.
          Each archetype uses a different session engine.
        </p>
      </section>

      {/* Archetype filter cards */}
      <div className="archetype-filter-row" style={{ marginBottom: 24 }}>
        {(SKILL_ARCHETYPES as SkillArchetype[]).map((archetype) => {
          const isPhase2 = PHASE_2_ARCHETYPES.includes(archetype)
          const isActive = activeArchetype === archetype
          const count = SKILLS_TAXONOMY.filter(s => s.archetype === archetype).length
          return (
            <button
              key={archetype}
              className={`archetype-filter-card ${isActive ? 'archetype-filter-card-active' : ''} ${isPhase2 ? 'archetype-filter-card-phase2' : ''}`}
              onClick={() => setActiveArchetype(isActive ? null : archetype)}
              id={`catalog-archetype-${archetype}`}
              disabled={isPhase2}
              title={isPhase2 ? 'Coming in Phase 2' : ARCHETYPE_DESCRIPTIONS[archetype]}
            >
              <div className="archetype-filter-icon">{ARCHETYPE_ICONS[archetype]}</div>
              <div className="archetype-filter-label">{ARCHETYPE_LABELS[archetype]}</div>
              <div className="archetype-filter-count">
                {isPhase2 ? 'Soon' : `${count} skill${count !== 1 ? 's' : ''}`}
              </div>
            </button>
          )
        })}
      </div>

      {/* Search + category filters */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 'var(--stack-sm)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type="search"
          className="input"
          placeholder="Search skills or sub-skills…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="catalog-search"
          style={{ maxWidth: 300, flex: 1 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`chip ${!activeCategory ? 'chip-primary' : ''}`}
            onClick={() => setActiveCategory(null)}
            id="catalog-filter-all"
          >
            All categories
          </button>
          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? 'chip-primary' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              id={`catalog-filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
              style={{ cursor: 'pointer' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active archetype description */}
      {activeArchetype && (
        <div className="archetype-active-banner" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>{ARCHETYPE_ICONS[activeArchetype]}</span>
          <div>
            <span style={{ fontWeight: 600 }}>{ARCHETYPE_LABELS[activeArchetype]} Archetype</span>
            <span className="body-sm" style={{ marginLeft: 10, color: 'var(--text-secondary)' }}>
              {ARCHETYPE_DESCRIPTIONS[activeArchetype]}
            </span>
          </div>
        </div>
      )}

      {/* Skills list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredSkills.map(skill => {
          const isExpanded = expandedSkill === skill.name
          const skillSlug = toSlug(skill.name)
          const completion = getSkillCompletion(skillSlug, skill.sub_skills.length)
          const skillProgress = progressData[skillSlug]
          const isPhase2 = PHASE_2_ARCHETYPES.includes(skill.archetype)

          return (
            <div key={skill.name} className="card" style={{ padding: 0, opacity: isPhase2 ? 0.65 : 1 }}>
              {/* Skill header — click to expand */}
              <button
                onClick={() => !isPhase2 && setExpandedSkill(isExpanded ? null : skill.name)}
                style={{
                  width: '100%',
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'transparent',
                  border: 'none',
                  cursor: isPhase2 ? 'default' : 'pointer',
                  textAlign: 'left',
                }}
                id={`catalog-expand-${toSlug(skill.name)}`}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{skill.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-heading)' }}>
                      {skill.name}
                    </span>
                    <span className="chip" style={{ fontSize: 10 }}>{skill.category}</span>
                    {/* Archetype badge */}
                    <span
                      className="archetype-badge"
                      title={ARCHETYPE_DESCRIPTIONS[skill.archetype]}
                    >
                      {ARCHETYPE_ICONS[skill.archetype]} {ARCHETYPE_LABELS[skill.archetype]}
                    </span>
                    {isPhase2 && (
                      <span className="chip" style={{ fontSize: 10, backgroundColor: 'var(--surface-container-high)', color: 'var(--text-muted)' }}>
                        Phase 2
                      </span>
                    )}
                  </div>
                  <div className="body-sm" style={{ marginBottom: 6 }}>
                    {skill.description.substring(0, 120)}…
                  </div>
                  {/* Progress bar */}
                  {!isPhase2 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-track" style={{ flex: 1, maxWidth: 200 }}>
                        <div
                          className="progress-fill progress-fill-success"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <span className="body-sm" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                        {completion}% · {skill.sub_skills.length} sub-skills
                      </span>
                    </div>
                  )}
                </div>
                {!isPhase2 && (
                  <span
                    style={{
                      fontSize: 16,
                      color: 'var(--text-muted)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    ▾
                  </span>
                )}
              </button>

              {/* Expanded: sub-skills with start buttons */}
              {isExpanded && !isPhase2 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '4px 0' }}>
                  {skill.sub_skills.map((sub, i) => {
                    const subSlug = toSlug(sub.name)
                    const subProgress = skillProgress?.subSkills?.[subSlug]
                    const status = subProgress?.status || 'not_started'
                    const sprintUrl = `/dashboard/sprint/${skillSlug}--${subSlug}`

                    return (
                      <div
                        key={sub.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 22px 12px 60px',
                          gap: 14,
                          borderBottom:
                            i < skill.sub_skills.length - 1
                              ? '1px solid var(--border-subtle)'
                              : 'none',
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          style={{
                            width: 24, height: 24,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, borderRadius: '50%', flexShrink: 0,
                            backgroundColor:
                              status === 'completed'
                                ? 'var(--success)'
                                : status === 'in_progress'
                                  ? 'var(--primary-container)'
                                  : 'var(--surface-container-high)',
                            color: status === 'not_started' ? 'var(--text-muted)' : 'white',
                          }}
                        >
                          {status === 'completed' ? '✓' : status === 'in_progress' ? '▶' : String(i + 1)}
                        </div>

                        {/* Sub-skill info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-heading)', marginBottom: 2 }}>
                            {sub.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sub.description}
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div className="body-sm" style={{ fontSize: 11, flexShrink: 0 }}>
                          {'●'.repeat(sub.difficulty_level)}{'○'.repeat(5 - sub.difficulty_level)}
                        </div>

                        {/* Action button */}
                        <Link
                          href={sprintUrl}
                          className="btn btn-primary btn-sm"
                          style={{ flexShrink: 0, minWidth: 80, textAlign: 'center' }}
                          id={`catalog-start-${subSlug}`}
                        >
                          {status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start'}
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="empty-state" style={{ padding: 'var(--stack-lg)' }}>
          <div className="empty-state-icon" style={{ fontSize: 40 }}>🔍</div>
          <div className="empty-state-title">No skills found</div>
          <div className="empty-state-text">Try adjusting your search or filter.</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearch('')
              setActiveCategory(null)
              setActiveArchetype(null)
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
