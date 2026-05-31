-- ============================================================
-- Migration 012: Sync skills.archetype + Skill DNA from catalog
-- Run after 011. Matches src/data/skills-taxonomy.ts + skill-dna.
-- ============================================================

UPDATE skills SET
  archetype = 'conversational',
  cognitive_patterns = ARRAY['dialogue','framing','stakeholder_alignment','influence'],
  evaluation_dimensions = ARRAY['clarity','adaptability','empathy_signal'],
  telemetry_dimensions = ARRAY['turn_taking','recovery_after_pushback']
WHERE name = 'Communication';

UPDATE skills SET
  archetype = 'conversational',
  cognitive_patterns = ARRAY['influence','framing','pushback','stakeholder_alignment','dialogue'],
  evaluation_dimensions = ARRAY['clarity','adaptability','empathy_signal'],
  telemetry_dimensions = ARRAY['turn_taking','recovery_after_pushback']
WHERE name = 'Influence & Negotiation';

UPDATE skills SET
  archetype = 'conversational',
  cognitive_patterns = ARRAY['strategic_thinking','framing','influence','evidence_evaluation'],
  evaluation_dimensions = ARRAY['clarity','adaptability','empathy_signal'],
  telemetry_dimensions = ARRAY['turn_taking','recovery_after_pushback']
WHERE name = 'Strategic Sales';

UPDATE skills SET
  archetype = 'conversational',
  cognitive_patterns = ARRAY['judgment','stakeholder_alignment','prioritization','dialogue'],
  evaluation_dimensions = ARRAY['clarity','adaptability','empathy_signal'],
  telemetry_dimensions = ARRAY['turn_taking','recovery_after_pushback']
WHERE name = 'Leadership Essentials';

UPDATE skills SET
  archetype = 'analytical',
  cognitive_patterns = ARRAY['assumption_detection','evidence_evaluation','counterfactual_reasoning','ethical_judgment'],
  evaluation_dimensions = ARRAY['reasoning_quality','evidence_quality'],
  telemetry_dimensions = ARRAY['revision_speed','hypothesis_updates']
WHERE name = 'Critical Thinking';

UPDATE skills SET
  archetype = 'analytical',
  cognitive_patterns = ARRAY['root_cause','hypothesis_generation','prioritization','causal_analysis'],
  evaluation_dimensions = ARRAY['reasoning_quality','evidence_quality'],
  telemetry_dimensions = ARRAY['revision_speed','hypothesis_updates']
WHERE name = 'Problem Solving';

UPDATE skills SET
  archetype = 'analytical',
  cognitive_patterns = ARRAY['hypothesis_generation','counterfactual_reasoning','pattern_recognition'],
  evaluation_dimensions = ARRAY['reasoning_quality','evidence_quality'],
  telemetry_dimensions = ARRAY['revision_speed','hypothesis_updates']
WHERE name = 'Creative Thinking';

UPDATE skills SET
  archetype = 'analytical',
  cognitive_patterns = ARRAY['judgment','tradeoff_analysis','evidence_evaluation','strategic_thinking'],
  evaluation_dimensions = ARRAY['reasoning_quality','evidence_quality'],
  telemetry_dimensions = ARRAY['revision_speed','hypothesis_updates']
WHERE name = 'Judgment';

UPDATE skills SET
  archetype = 'reflective',
  cognitive_patterns = ARRAY['self_awareness','emotional_regulation','dialogue','stakeholder_alignment'],
  evaluation_dimensions = ARRAY['insight_depth','self_awareness_signal'],
  telemetry_dimensions = ARRAY['reflection_depth','pattern_mentions']
WHERE name = 'Emotional Intelligence';

UPDATE skills SET
  archetype = 'reflective',
  cognitive_patterns = ARRAY['assumption_detection','pattern_recognition','self_awareness'],
  evaluation_dimensions = ARRAY['insight_depth','self_awareness_signal'],
  telemetry_dimensions = ARRAY['reflection_depth','pattern_mentions']
WHERE name = 'Metacognition';

UPDATE skills SET
  archetype = 'reflective',
  cognitive_patterns = ARRAY['pattern_recognition','emotional_regulation','prioritization'],
  evaluation_dimensions = ARRAY['insight_depth','self_awareness_signal'],
  telemetry_dimensions = ARRAY['reflection_depth','pattern_mentions']
WHERE name = 'Adaptability';

UPDATE skills SET
  archetype = 'systems',
  cognitive_patterns = ARRAY['systems_mapping','causal_analysis','pattern_recognition'],
  evaluation_dimensions = ARRAY['systems_thinking','leverage_identification'],
  telemetry_dimensions = ARRAY['loop_identification','dependency_mentions']
WHERE name = 'Systems Thinking';

UPDATE skills SET
  archetype = 'systems',
  cognitive_patterns = ARRAY['systems_mapping','tradeoff_analysis','prioritization'],
  evaluation_dimensions = ARRAY['systems_thinking','leverage_identification'],
  telemetry_dimensions = ARRAY['loop_identification','dependency_mentions']
WHERE name = 'System Design';

UPDATE skills SET
  archetype = 'creation',
  cognitive_patterns = ARRAY['evidence_evaluation','assumption_detection','ethical_judgment'],
  evaluation_dimensions = ARRAY['originality','feasibility'],
  telemetry_dimensions = ARRAY['iteration_count','constraint_handling']
WHERE name = 'AI Literacy';
