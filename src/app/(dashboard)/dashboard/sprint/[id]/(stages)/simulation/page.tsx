'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function SimulationIndexPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      router.replace(`/dashboard/sprint/${id}/simulation/guided`)
    }
  }, [id, router])

  return (
    <div className="flex-center" style={{ minHeight: '50vh', flexDirection: 'column', gap: 16 }}>
      <div className="typing-dots">
        <span>●</span>
        <span>●</span>
        <span>●</span>
      </div>
      <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
        Loading Roleplay Simulation...
      </p>
    </div>
  )
}
