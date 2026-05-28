/* ============================================================
   Lumi6 Skill Lab — Skills Taxonomy Data
   Hardcoded capability graph from PRD
   ============================================================ */

import type { LearningEngineType } from '@/types'

export interface SkillTaxonomyEntry {
  name: string
  category: string
  description: string
  learning_engine_type: LearningEngineType
  icon: string
  sub_skills: {
    name: string
    description: string
    difficulty_level: number
  }[]
}

export const SKILLS_TAXONOMY: SkillTaxonomyEntry[] = [
  {
    name: 'Emotional Intelligence',
    category: 'Human Skills',
    description: 'Understand and manage your own emotions, empathize with others, and navigate social complexity with self-awareness and resilience.',
    learning_engine_type: 'reflective_ai_mirror',
    icon: '🧠',
    sub_skills: [
      { name: 'Self Awareness', description: 'Recognize your own emotional patterns, triggers, and blind spots.', difficulty_level: 2 },
      { name: 'Self Regulation', description: 'Manage impulses, stay composed under pressure, and adapt responses.', difficulty_level: 3 },
      { name: 'Empathy', description: 'Perceive and understand others\' emotions and perspectives.', difficulty_level: 2 },
      { name: 'Social Skills', description: 'Build rapport, manage relationships, and influence positively.', difficulty_level: 3 },
      { name: 'Motivation', description: 'Maintain drive, optimism, and commitment to goals.', difficulty_level: 2 },
      { name: 'Resilience', description: 'Recover from setbacks, adapt to adversity, and sustain performance.', difficulty_level: 4 },
    ],
  },
  {
    name: 'AI Literacy',
    category: 'Technical Skills',
    description: 'Understand, evaluate, and effectively collaborate with AI systems in professional settings.',
    learning_engine_type: 'structured_reasoning',
    icon: '🤖',
    sub_skills: [
      { name: 'Prompt Crafting', description: 'Write clear, effective prompts that produce high-quality AI outputs.', difficulty_level: 1 },
      { name: 'Output Evaluation', description: 'Critically assess AI-generated content for accuracy and bias.', difficulty_level: 2 },
      { name: 'AI Ethics Awareness', description: 'Understand ethical implications of AI usage in work contexts.', difficulty_level: 2 },
      { name: 'Tool Fluency', description: 'Navigate and leverage various AI tools effectively.', difficulty_level: 1 },
      { name: 'Human-AI Collaboration', description: 'Design workflows that optimally combine human and AI capabilities.', difficulty_level: 3 },
      { name: 'AI Workflow Design', description: 'Architect multi-step AI processes for complex business tasks.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Critical Thinking',
    category: 'Cognitive Skills',
    description: 'Analyze arguments, detect biases, evaluate evidence, and reason logically to form well-founded judgments.',
    learning_engine_type: 'structured_reasoning',
    icon: '🔍',
    sub_skills: [
      { name: 'Bias Detection', description: 'Identify cognitive and systemic biases in arguments and data.', difficulty_level: 3 },
      { name: 'First Principles Thinking', description: 'Break problems down to fundamental truths and reason upward.', difficulty_level: 4 },
      { name: 'Argument Analysis', description: 'Evaluate the structure and validity of arguments.', difficulty_level: 2 },
      { name: 'Evidence Evaluation', description: 'Assess the quality, relevance, and reliability of evidence.', difficulty_level: 3 },
      { name: 'Logical Reasoning', description: 'Apply deductive and inductive reasoning to reach conclusions.', difficulty_level: 2 },
      { name: 'Probabilistic Thinking', description: 'Reason about uncertainty and make decisions with incomplete information.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Problem Solving',
    category: 'Cognitive Skills',
    description: 'Diagnose root causes, generate creative solutions, prioritize effectively, and iterate through complex challenges.',
    learning_engine_type: 'consequence_simulation',
    icon: '🧩',
    sub_skills: [
      { name: 'Root Cause Analysis', description: 'Identify the underlying cause of problems, not just symptoms.', difficulty_level: 2 },
      { name: 'Ideation', description: 'Generate diverse and creative solution options.', difficulty_level: 2 },
      { name: 'Decision Frameworks', description: 'Apply structured approaches to making decisions.', difficulty_level: 3 },
      { name: 'Iteration & Testing', description: 'Build, test, and refine solutions rapidly.', difficulty_level: 3 },
      { name: 'Prioritization', description: 'Rank tasks and solutions by impact and feasibility.', difficulty_level: 2 },
      { name: 'Constraint Navigation', description: 'Find solutions within tight resource, time, or rule constraints.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Adaptability',
    category: 'Human Skills',
    description: 'Navigate ambiguity, embrace change, pivot quickly, and maintain performance under shifting conditions.',
    learning_engine_type: 'recovery_conditioning',
    icon: '🌊',
    sub_skills: [
      { name: 'Cognitive Flexibility', description: 'Shift thinking between different concepts and perspectives.', difficulty_level: 3 },
      { name: 'Ambiguity Tolerance', description: 'Perform effectively when information is incomplete or unclear.', difficulty_level: 3 },
      { name: 'Learning Agility', description: 'Rapidly acquire new skills and apply them in novel situations.', difficulty_level: 2 },
      { name: 'Pivot Speed', description: 'Quickly change direction when circumstances change.', difficulty_level: 3 },
      { name: 'Change Navigation', description: 'Lead self and others through organizational change.', difficulty_level: 4 },
      { name: 'Stress Adaptation', description: 'Maintain cognitive performance under high-stress conditions.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Creative Thinking',
    category: 'Cognitive Skills',
    description: 'Generate novel ideas, reframe problems, synthesize diverse inputs, and think laterally to find innovative solutions.',
    learning_engine_type: 'cognitive_conflict',
    icon: '💡',
    sub_skills: [
      { name: 'Lateral Thinking', description: 'Approach problems from unexpected angles and perspectives.', difficulty_level: 3 },
      { name: 'Reframing', description: 'Transform how a problem is perceived to unlock new solutions.', difficulty_level: 3 },
      { name: 'Synthesis', description: 'Combine disparate ideas into coherent new concepts.', difficulty_level: 4 },
      { name: 'Generative Brainstorming', description: 'Produce high volumes of ideas without self-censoring.', difficulty_level: 2 },
      { name: 'Conceptual Blending', description: 'Merge ideas from different domains to create innovation.', difficulty_level: 4 },
      { name: 'Creative Constraints', description: 'Use limitations as a catalyst for creative breakthroughs.', difficulty_level: 3 },
    ],
  },
  {
    name: 'Systems Thinking',
    category: 'Strategic Skills',
    description: 'See the big picture, understand feedback loops, map dependencies, and identify leverage points in complex systems.',
    learning_engine_type: 'constraint_architecture',
    icon: '🔗',
    sub_skills: [
      { name: 'Feedback Loops', description: 'Identify and understand reinforcing and balancing feedback.', difficulty_level: 3 },
      { name: 'Second-Order Effects', description: 'Anticipate indirect consequences of actions and decisions.', difficulty_level: 4 },
      { name: 'Dependency Mapping', description: 'Chart relationships and dependencies between system components.', difficulty_level: 3 },
      { name: 'Pattern Recognition', description: 'Detect recurring structures and behaviors across systems.', difficulty_level: 3 },
      { name: 'Leverage Point Identification', description: 'Find high-impact intervention points in complex systems.', difficulty_level: 5 },
      { name: 'Systems Modeling', description: 'Build mental and visual models of system dynamics.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Communication',
    category: 'Human Skills',
    description: 'Articulate ideas clearly, listen actively, adapt to audiences, and facilitate productive dialogues across contexts.',
    learning_engine_type: 'simulation_based',
    icon: '💬',
    sub_skills: [
      { name: 'Storytelling', description: 'Craft compelling narratives that engage and persuade.', difficulty_level: 3 },
      { name: 'Active Listening', description: 'Fully concentrate, understand, and respond thoughtfully.', difficulty_level: 2 },
      { name: 'Executive Communication', description: 'Deliver concise, high-impact messages to leadership.', difficulty_level: 4 },
      { name: 'Audience Adaptation', description: 'Tailor communication style and content to different groups.', difficulty_level: 3 },
      { name: 'Cross-Functional Communication', description: 'Bridge gaps between departments with different vocabularies.', difficulty_level: 3 },
      { name: 'Digital Communication', description: 'Communicate effectively through written and digital channels.', difficulty_level: 2 },
      { name: 'Feedback Delivery', description: 'Give constructive feedback that drives improvement.', difficulty_level: 3 },
      { name: 'Facilitation', description: 'Guide group discussions toward productive outcomes.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Influence & Negotiation',
    category: 'Leadership Skills',
    description: 'Persuade ethically, navigate conflicts, align stakeholders, and reach agreements that create mutual value.',
    learning_engine_type: 'simulation_based',
    icon: '🤝',
    sub_skills: [
      { name: 'Framing', description: 'Present information in ways that shape perception and decisions.', difficulty_level: 3 },
      { name: 'Ethical Persuasion', description: 'Influence others through honest, principled arguments.', difficulty_level: 3 },
      { name: 'Negotiation', description: 'Reach mutually beneficial agreements through structured dialogue.', difficulty_level: 4 },
      { name: 'Conflict Resolution', description: 'Mediate disputes and find common ground between parties.', difficulty_level: 4 },
      { name: 'Stakeholder Alignment', description: 'Build consensus across diverse stakeholder groups.', difficulty_level: 4 },
      { name: 'Trust Building', description: 'Establish and maintain trust through consistent, reliable behavior.', difficulty_level: 3 },
      { name: 'Objection Handling', description: 'Address resistance and objections with structured responses.', difficulty_level: 3 },
      { name: 'Consensus Building', description: 'Guide groups to shared agreement through facilitated dialogue.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Strategic Sales',
    category: 'Business Skills',
    description: 'Master buyer psychology, frame value propositions, map stakeholders, and navigate complex sales cycles.',
    learning_engine_type: 'simulation_based',
    icon: '📊',
    sub_skills: [
      { name: 'Discovery & Qualification', description: 'Uncover buyer needs and assess opportunity fit.', difficulty_level: 2 },
      { name: 'Buyer Psychology', description: 'Understand cognitive patterns that drive purchasing decisions.', difficulty_level: 3 },
      { name: 'Value Framing', description: 'Articulate business value in terms that resonate with buyers.', difficulty_level: 3 },
      { name: 'Stakeholder Mapping', description: 'Identify and engage all decision-makers in complex deals.', difficulty_level: 4 },
      { name: 'Objection Handling', description: 'Systematically address and overcome buyer objections.', difficulty_level: 3 },
      { name: 'Negotiation Fundamentals', description: 'Close deals that create value for both sides.', difficulty_level: 3 },
    ],
  },
  {
    name: 'Leadership Essentials',
    category: 'Leadership Skills',
    description: 'Make decisions under uncertainty, delegate effectively, align teams, and build cultures of accountability.',
    learning_engine_type: 'consequence_simulation',
    icon: '👑',
    sub_skills: [
      { name: 'Decision-Making Under Uncertainty', description: 'Make sound decisions when information is incomplete.', difficulty_level: 5 },
      { name: 'Delegation', description: 'Assign work effectively while maintaining accountability.', difficulty_level: 3 },
      { name: 'Team Alignment', description: 'Create shared vision and coordinate toward common goals.', difficulty_level: 4 },
      { name: 'Accountability', description: 'Hold self and others responsible for commitments and outcomes.', difficulty_level: 3 },
      { name: 'Coaching & Feedback', description: 'Develop others through guided practice and honest feedback.', difficulty_level: 4 },
      { name: 'Resource Allocation', description: 'Distribute limited resources for maximum impact.', difficulty_level: 4 },
    ],
  },
  {
    name: 'Metacognition',
    category: 'Cognitive Skills',
    description: 'Think about your own thinking — calibrate confidence, manage attention, select mental models, and optimize learning.',
    learning_engine_type: 'reflective_ai_mirror',
    icon: '🪞',
    sub_skills: [
      { name: 'Cognitive Bias Awareness', description: 'Recognize when your own thinking is being distorted by biases.', difficulty_level: 3 },
      { name: 'Confidence Calibration', description: 'Accurately assess how much you actually know.', difficulty_level: 4 },
      { name: 'Self Reflection', description: 'Systematically review your own performance and growth.', difficulty_level: 2 },
      { name: 'Attention Management', description: 'Direct and sustain focus on high-priority cognitive tasks.', difficulty_level: 3 },
      { name: 'Mental Model Selection', description: 'Choose the right framework for the problem at hand.', difficulty_level: 4 },
      { name: 'Learning Optimization', description: 'Identify the most efficient strategies for skill acquisition.', difficulty_level: 3 },
    ],
  },
  {
    name: 'Judgment',
    category: 'Strategic Skills',
    description: 'Distinguish signal from noise, assess risks, analyze trade-offs, and make ethically sound decisions.',
    learning_engine_type: 'consequence_simulation',
    icon: '⚖️',
    sub_skills: [
      { name: 'Signal vs Noise Detection', description: 'Distinguish meaningful information from distractions.', difficulty_level: 4 },
      { name: 'Risk Assessment', description: 'Evaluate probability and impact of potential outcomes.', difficulty_level: 3 },
      { name: 'Trade-off Analysis', description: 'Compare options when each involves giving something up.', difficulty_level: 3 },
      { name: 'Ethical Judgment', description: 'Make decisions that balance effectiveness with moral principles.', difficulty_level: 4 },
      { name: 'Long-term Thinking', description: 'Consider extended consequences and future implications.', difficulty_level: 4 },
      { name: 'Decision Quality Evaluation', description: 'Assess the quality of past decisions to improve future ones.', difficulty_level: 3 },
    ],
  },
  {
    name: 'System Design',
    category: 'Technical Skills',
    description: 'Architect scalable systems, manage dependencies, handle failures gracefully, and optimize for performance.',
    learning_engine_type: 'constraint_architecture',
    icon: '🏗️',
    sub_skills: [
      { name: 'Scalability Thinking', description: 'Design systems that handle growth in users, data, and complexity.', difficulty_level: 4 },
      { name: 'Architecture Planning', description: 'Create high-level blueprints for complex technical systems.', difficulty_level: 4 },
      { name: 'Trade-off Analysis', description: 'Navigate competing concerns in system design decisions.', difficulty_level: 3 },
      { name: 'Dependency Management', description: 'Handle inter-system relationships and versioning.', difficulty_level: 3 },
      { name: 'Failure Handling', description: 'Design for graceful degradation and fault tolerance.', difficulty_level: 5 },
      { name: 'Performance Optimization', description: 'Identify and resolve performance bottlenecks.', difficulty_level: 4 },
    ],
  },
]

// Helper: Get all unique categories
export const SKILL_CATEGORIES = [...new Set(SKILLS_TAXONOMY.map(s => s.category))]

// Helper: Count total sub-skills
export const TOTAL_SUB_SKILLS = SKILLS_TAXONOMY.reduce((acc, s) => acc + s.sub_skills.length, 0)
