/**
 * useArchetypeFlow — returns stage navigation, labels, and routing for a given archetype.
 *
 * This hook is the frontend equivalent of the backend archetype resolver.
 * Any component needing to know what stages exist, what order they're in,
 * or what the next stage is after the current one should use this hook.
 */

'use client'

import { useMemo } from 'react'
import type { SkillArchetype, StageType } from '@/types'
import { ARCHETYPE_STAGE_NAV, ARCHETYPE_STAGE_FLOWS, STAGE_URL_SEGMENT } from '@/types'

export interface StageNavItem {
  key: string      // URL path segment (e.g. 'reasoning', 'simulation')
  label: string
  icon: string
}

export interface ArchetypeFlow {
  /** Ordered nav items for the top bar */
  navItems: StageNavItem[]
  /** Ordered full stage flow (StageType keys) */
  stageFlow: StageType[]
  /** Check if a URL segment is "active" given the current path segment */
  isActive: (navKey: string, currentSegment: string) => boolean
  /** Check if a nav item is "completed" given the current active index */
  isCompleted: (navKey: string, currentSegment: string) => boolean
  /** Get the URL segment for a given stage type */
  getStageUrl: (stage: StageType) => string
  /** Get the next stage URL segment from the current one */
  nextStageUrl: (currentSegment: string, sprintId: string) => string
  /** Archetype-specific simulation label */
  simulationLabel: string
  /** Archetype-specific drill label */
  drillLabel: string
}

const ARCHETYPE_SIMULATION_LABELS: Record<SkillArchetype, string> = {
  conversational: 'Roleplay Simulation',
  analytical: 'Reasoning Workspace',
  reflective: 'Guided Reflection',
  creation: 'Creation Workshop',
  performance: 'Performance Practice',
  systems: 'Systems Canvas',
}

const ARCHETYPE_DRILL_LABELS: Record<SkillArchetype, string> = {
  conversational: 'Scenario Drills',
  analytical: 'Analysis Drills',
  reflective: 'Reflection Exercises',
  creation: 'Creation Drills',
  performance: 'Practice Runs',
  systems: 'Design Exercises',
}

export function useArchetypeFlow(archetype: SkillArchetype): ArchetypeFlow {
  return useMemo(() => {
    const navItems = ARCHETYPE_STAGE_NAV[archetype] ?? ARCHETYPE_STAGE_NAV.conversational
    const stageFlow = ARCHETYPE_STAGE_FLOWS[archetype] ?? ARCHETYPE_STAGE_FLOWS.conversational

    const isActive = (navKey: string, currentSegment: string): boolean => {
      if (navKey === currentSegment) return true
      // Handle simulation sub-routes: 'simulation' matches 'simulation/guided', etc.
      if (navKey === 'simulation' && currentSegment.startsWith('simulation')) return true
      if (navKey === 'guided-reflection' && currentSegment.startsWith('guided-reflection')) return true
      if (navKey === 'reasoning' && currentSegment.startsWith('reasoning')) return true
      return false
    }

    const isCompleted = (navKey: string, currentSegment: string): boolean => {
      const activeIndex = navItems.findIndex(n => isActive(n.key, currentSegment))
      const thisIndex = navItems.findIndex(n => n.key === navKey)
      return activeIndex > 0 && thisIndex < activeIndex
    }

    const getStageUrl = (stage: StageType): string => {
      return STAGE_URL_SEGMENT[stage] ?? stage.replace(/_/g, '-')
    }

    const nextStageUrl = (currentSegment: string, sprintId: string): string => {
      const activeIndex = navItems.findIndex(n => isActive(n.key, currentSegment))
      const next = navItems[activeIndex + 1]
      if (!next) return `/dashboard/sprint/${sprintId}/report`
      return `/dashboard/sprint/${sprintId}/${next.key}`
    }

    return {
      navItems,
      stageFlow,
      isActive,
      isCompleted,
      getStageUrl,
      nextStageUrl,
      simulationLabel: ARCHETYPE_SIMULATION_LABELS[archetype],
      drillLabel: ARCHETYPE_DRILL_LABELS[archetype],
    }
  }, [archetype])
}
