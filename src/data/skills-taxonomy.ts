/* ============================================================
   Lumi6 Skill Lab — Skills Taxonomy Data
   Archetype-based capability graph with atomic skill breakdown
   ============================================================ */

import type { SkillArchetype, SessionEngine } from '@/types'

export interface AtomicSkill {
  name: string
  description: string
  difficulty_level: number
}

export interface SubSkillEntry {
  name: string
  description: string
  difficulty_level: number
  atomic_skills: AtomicSkill[]
}

export interface SkillTaxonomyEntry {
  name: string
  category: string
  description: string
  archetype: SkillArchetype
  session_engine: SessionEngine
  icon: string
  sub_skills: SubSkillEntry[]
}

export const SKILLS_TAXONOMY: SkillTaxonomyEntry[] = [
  // ─── CONVERSATIONAL ARCHETYPE ─────────────────────────────────────────────
  // Engine: roleplay_engine — live dialogue, AI character, pushback, escalation
  {
    name: 'Communication',
    category: 'Human Skills',
    description: 'Articulate ideas clearly, listen actively, adapt to audiences, and facilitate productive dialogues across contexts.',
    archetype: 'conversational',
    session_engine: 'roleplay_engine',
    icon: '💬',
    sub_skills: [
      {
        name: 'Storytelling',
        description: 'Craft compelling narratives that engage and persuade.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Narrative Arc Construction', description: 'Structure stories with a clear beginning, tension, and resolution that keeps the audience engaged.', difficulty_level: 2 },
          { name: 'Emotional Hook Setting', description: 'Open with a vivid, relatable moment that makes the listener care about what comes next.', difficulty_level: 3 },
          { name: 'Concrete Detail Selection', description: 'Choose specific, sensory details over abstractions to make your story tangible and memorable.', difficulty_level: 2 },
          { name: 'Audience-Relevant Framing', description: 'Tailor your story\'s stakes and examples to what matters most to your specific audience.', difficulty_level: 3 },
          { name: 'Punchline Delivery', description: 'Land your key takeaway with clarity and impact — the "so what" that makes the story worth telling.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Active Listening',
        description: 'Fully concentrate, understand, and respond thoughtfully.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Paraphrasing', description: 'Restate the speaker\'s message in your own words to confirm understanding and show engagement.', difficulty_level: 1 },
          { name: 'Reflective Questioning', description: 'Ask questions that demonstrate you heard the underlying message, not just the surface words.', difficulty_level: 2 },
          { name: 'Non-verbal Acknowledgment', description: 'Use body language, eye contact, and vocal cues (nodding, "mm-hmm") to signal attentiveness.', difficulty_level: 1 },
          { name: 'Emotional Validation', description: 'Acknowledge the speaker\'s feelings before responding to their content — "I can see why that frustrated you."', difficulty_level: 3 },
          { name: 'Summarizing', description: 'Synthesize key points from extended dialogue to show comprehensive understanding and move the conversation forward.', difficulty_level: 2 },
          { name: 'Silence Management', description: 'Use strategic pauses to give the speaker space and process what was said before responding.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Executive Communication',
        description: 'Deliver concise, high-impact messages to leadership.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Bottom-Line-Up-Front (BLUF)', description: 'Lead with your conclusion or recommendation, then provide supporting evidence — never bury the lead.', difficulty_level: 2 },
          { name: 'Data Compression', description: 'Distill complex information into 2-3 key metrics or insights that drive the decision.', difficulty_level: 3 },
          { name: 'So-What Framing', description: 'Connect every data point to a business implication — executives care about impact, not raw information.', difficulty_level: 4 },
          { name: 'Anticipating Questions', description: 'Prepare for the 3-5 most likely pushback questions and have crisp, evidence-backed answers ready.', difficulty_level: 4 },
          { name: 'Confident Brevity', description: 'Say more with fewer words — eliminate filler, hedging language, and unnecessary qualifiers.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Audience Adaptation',
        description: 'Tailor communication style and content to different groups.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Stakeholder Profiling', description: 'Assess your audience\'s knowledge level, priorities, and communication preferences before speaking.', difficulty_level: 2 },
          { name: 'Vocabulary Calibration', description: 'Adjust technical depth and jargon level based on who you\'re addressing — engineers vs. executives vs. clients.', difficulty_level: 2 },
          { name: 'Motivation Mapping', description: 'Identify what each audience member cares about and frame your message around their specific concerns.', difficulty_level: 3 },
          { name: 'Channel Selection', description: 'Choose the right medium (email, presentation, 1:1, Slack) based on message complexity and audience preference.', difficulty_level: 2 },
          { name: 'Real-Time Calibration', description: 'Read the room during delivery and adjust tone, pace, and detail level based on audience reactions.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Cross-Functional Communication',
        description: 'Bridge gaps between departments with different vocabularies.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Jargon Translation', description: 'Convert domain-specific terminology into language that other teams can immediately understand.', difficulty_level: 2 },
          { name: 'Shared Goal Anchoring', description: 'Frame cross-team discussions around common business objectives rather than departmental priorities.', difficulty_level: 3 },
          { name: 'Assumption Surfacing', description: 'Explicitly state assumptions that are obvious within your team but invisible to others.', difficulty_level: 3 },
          { name: 'Context Bridging', description: 'Provide the minimum necessary background so people outside your domain can follow your reasoning.', difficulty_level: 2 },
          { name: 'Conflict De-escalation Across Teams', description: 'Mediate misunderstandings that arise from different team cultures, priorities, or definitions of success.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Digital Communication',
        description: 'Communicate effectively through written and digital channels.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Subject Line Precision', description: 'Write email subjects that convey the action needed and urgency level in under 10 words.', difficulty_level: 1 },
          { name: 'Scannable Formatting', description: 'Use bullet points, bold text, and short paragraphs so busy readers can extract key information in seconds.', difficulty_level: 1 },
          { name: 'Tone Calibration in Text', description: 'Ensure written messages convey the intended tone — avoiding accidental coldness, urgency, or ambiguity.', difficulty_level: 3 },
          { name: 'Async Thread Management', description: 'Keep async conversations (Slack, email threads) focused, organized, and easy for late-joiners to follow.', difficulty_level: 2 },
          { name: 'Action-Oriented Closing', description: 'End every message with a clear next step, owner, and deadline — never leave ambiguity about what happens next.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Feedback Delivery',
        description: 'Give constructive feedback that drives improvement.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Observation vs. Interpretation', description: 'Describe the specific behavior you observed, not your interpretation of their intent or character.', difficulty_level: 2 },
          { name: 'Impact Framing', description: 'Explain the concrete impact of the behavior on you, the team, or the outcome — make it about effects, not judgments.', difficulty_level: 3 },
          { name: 'Forward-Looking Suggestion', description: 'Offer a specific, actionable alternative rather than just pointing out what went wrong.', difficulty_level: 2 },
          { name: 'Timing and Setting Selection', description: 'Choose the right moment and environment for feedback — private for critical, timely for developmental.', difficulty_level: 2 },
          { name: 'Receptivity Reading', description: 'Gauge whether the recipient is ready to hear feedback and adjust your approach based on their emotional state.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Facilitation',
        description: 'Guide group discussions toward productive outcomes.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Agenda Framing', description: 'Set clear objectives and structure at the start so participants know what "done" looks like.', difficulty_level: 2 },
          { name: 'Balanced Participation', description: 'Draw out quiet voices and manage dominant speakers so all perspectives are heard.', difficulty_level: 3 },
          { name: 'Redirecting Off-Topic Discussion', description: 'Acknowledge tangents respectfully while steering the group back to the core agenda.', difficulty_level: 3 },
          { name: 'Decision Crystallization', description: 'Synthesize diverse viewpoints into a clear decision or next steps that the group can commit to.', difficulty_level: 4 },
          { name: 'Conflict Surfacing', description: 'Bring hidden disagreements into the open constructively, rather than letting them fester or derail.', difficulty_level: 5 },
        ],
      },
    ],
  },
  {
    name: 'Influence & Negotiation',
    category: 'Leadership Skills',
    description: 'Persuade ethically, navigate conflicts, align stakeholders, and reach agreements that create mutual value.',
    archetype: 'conversational',
    session_engine: 'roleplay_engine',
    icon: '🤝',
    sub_skills: [
      {
        name: 'Framing',
        description: 'Present information in ways that shape perception and decisions.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Loss vs. Gain Framing', description: 'Choose whether to emphasize what stakeholders gain or what they risk losing based on the decision context.', difficulty_level: 2 },
          { name: 'Anchor Setting', description: 'Establish an initial reference point that shapes how subsequent information is interpreted.', difficulty_level: 3 },
          { name: 'Narrative Reframing', description: 'Recast a negative situation into an opportunity narrative without being dishonest or dismissive.', difficulty_level: 3 },
          { name: 'Comparison Selection', description: 'Choose the right comparison set to make your proposal look favorable without manipulation.', difficulty_level: 3 },
          { name: 'Constraint Framing', description: 'Present limitations as design parameters that strengthen the solution rather than weaken it.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Ethical Persuasion',
        description: 'Influence others through honest, principled arguments.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Evidence-Based Advocacy', description: 'Build your case on verifiable facts and transparent reasoning rather than emotional manipulation.', difficulty_level: 2 },
          { name: 'Reciprocity Building', description: 'Create genuine goodwill through helpful actions that naturally incline others to support your position.', difficulty_level: 3 },
          { name: 'Social Proof Deployment', description: 'Reference credible examples and precedents to demonstrate that your approach has worked elsewhere.', difficulty_level: 2 },
          { name: 'Values Alignment', description: 'Connect your proposal to the audience\'s stated values and principles, not just their interests.', difficulty_level: 3 },
          { name: 'Transparency About Trade-offs', description: 'Openly acknowledge the costs and limitations of your proposal to build trust and credibility.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Negotiation',
        description: 'Reach mutually beneficial agreements through structured dialogue.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'BATNA Assessment', description: 'Know your Best Alternative To a Negotiated Agreement — and estimate theirs — before entering any negotiation.', difficulty_level: 3 },
          { name: 'Interest Discovery', description: 'Probe beneath stated positions to uncover underlying interests and motivations that create room for creative solutions.', difficulty_level: 4 },
          { name: 'Concession Strategy', description: 'Plan which concessions to make, in what order, and what to ask for in return — never give without getting.', difficulty_level: 3 },
          { name: 'Zone of Agreement Mapping', description: 'Identify the overlap between what both parties can accept and focus energy on solutions within that zone.', difficulty_level: 4 },
          { name: 'Commitment Locking', description: 'Secure clear, specific agreements at key moments rather than leaving terms vague or "to be discussed."', difficulty_level: 3 },
        ],
      },
      {
        name: 'Conflict Resolution',
        description: 'Mediate disputes and find common ground between parties.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Emotion Acknowledgment', description: 'Name and validate the emotions present before attempting to solve the substantive problem.', difficulty_level: 3 },
          { name: 'Issue Separation', description: 'Distinguish between the person, the relationship, and the substantive issue to address each appropriately.', difficulty_level: 3 },
          { name: 'Common Ground Identification', description: 'Find shared interests, values, or goals that both parties agree on as a foundation for resolution.', difficulty_level: 3 },
          { name: 'De-escalation Techniques', description: 'Lower emotional intensity through tone, pacing, and language choices when conflict is heating up.', difficulty_level: 4 },
          { name: 'Solution Co-creation', description: 'Involve both parties in generating solutions so they have ownership over the outcome.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Stakeholder Alignment',
        description: 'Build consensus across diverse stakeholder groups.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Influence Mapping', description: 'Identify who has decision-making power, who influences them, and who can block progress.', difficulty_level: 3 },
          { name: 'Pre-meeting Alignment', description: 'Build support 1:1 before group meetings so key decisions aren\'t made cold in the room.', difficulty_level: 3 },
          { name: 'Objection Anticipation', description: 'Predict each stakeholder\'s likely concerns and prepare responses before the conversation.', difficulty_level: 4 },
          { name: 'Win-Win Positioning', description: 'Frame proposals so each stakeholder can see how it serves their specific priorities.', difficulty_level: 4 },
          { name: 'Progress Communication', description: 'Keep stakeholders informed with the right level of detail at the right cadence to maintain trust.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Trust Building',
        description: 'Establish and maintain trust through consistent, reliable behavior.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Commitment Follow-Through', description: 'Do what you said you\'d do, when you said you\'d do it — even small broken promises erode trust fast.', difficulty_level: 2 },
          { name: 'Vulnerability Calibration', description: 'Share appropriate amounts of uncertainty or concern to signal authenticity without undermining confidence.', difficulty_level: 3 },
          { name: 'Consistency of Character', description: 'Behave the same way regardless of audience — people trust those who don\'t change personas.', difficulty_level: 3 },
          { name: 'Credit Sharing', description: 'Publicly acknowledge others\' contributions to build relational capital and demonstrate fairness.', difficulty_level: 2 },
          { name: 'Difficult Truth Telling', description: 'Deliver hard truths directly and respectfully rather than avoiding them or sugar-coating to the point of dishonesty.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Objection Handling',
        description: 'Address resistance and objections with structured responses.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Objection Classification', description: 'Quickly determine whether an objection is substantive, emotional, procedural, or a stall tactic.', difficulty_level: 3 },
          { name: 'Acknowledgment Before Response', description: 'Validate the objection as legitimate before providing your counter — "That\'s a fair concern."', difficulty_level: 2 },
          { name: 'Evidence Matching', description: 'Match the type of evidence to the type of objection — data for analytical concerns, stories for emotional ones.', difficulty_level: 3 },
          { name: 'Redirect to Shared Goals', description: 'Pivot from the objection back to the common objective you both agree on.', difficulty_level: 3 },
          { name: 'Graceful Concession', description: 'Know when to concede a point and do so cleanly — partial concessions often build more trust than total resistance.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Consensus Building',
        description: 'Guide groups to shared agreement through facilitated dialogue.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Option Generation', description: 'Help the group generate multiple viable options before evaluating any — expand before you narrow.', difficulty_level: 2 },
          { name: 'Criteria Agreement', description: 'Get the group to agree on decision criteria before discussing solutions — this prevents endless debate.', difficulty_level: 3 },
          { name: 'Dissent Integration', description: 'Incorporate minority viewpoints into the final solution rather than overriding them with majority rule.', difficulty_level: 4 },
          { name: 'Commitment Verification', description: 'Explicitly check that each person can support the decision, not just that they\'re silent about it.', difficulty_level: 3 },
          { name: 'Disagree-and-Commit Facilitation', description: 'Help people who disagree with the final decision genuinely commit to supporting it, with their concerns documented.', difficulty_level: 5 },
        ],
      },
    ],
  },
  {
    name: 'Strategic Sales',
    category: 'Business Skills',
    description: 'Master buyer psychology, frame value propositions, map stakeholders, and navigate complex sales cycles.',
    archetype: 'conversational',
    session_engine: 'roleplay_engine',
    icon: '📊',
    sub_skills: [
      {
        name: 'Discovery & Qualification',
        description: 'Uncover buyer needs and assess opportunity fit.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Open-Ended Probing', description: 'Ask questions that invite the buyer to describe their situation, pain points, and goals in their own words.', difficulty_level: 1 },
          { name: 'Pain Quantification', description: 'Help the buyer put a number on the cost of their problem — lost revenue, wasted time, or missed opportunity.', difficulty_level: 3 },
          { name: 'Fit Assessment', description: 'Honestly evaluate whether your solution is a genuine fit for the buyer\'s situation — and walk away when it isn\'t.', difficulty_level: 2 },
          { name: 'Priority Sequencing', description: 'Determine which of the buyer\'s multiple needs are most urgent and focus your pitch there first.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Buyer Psychology',
        description: 'Understand cognitive patterns that drive purchasing decisions.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Loss Aversion Recognition', description: 'Understand that buyers feel losses ~2x more intensely than equivalent gains and frame accordingly.', difficulty_level: 2 },
          { name: 'Status Quo Bias Navigation', description: 'Help buyers overcome their natural preference for doing nothing by making the cost of inaction concrete.', difficulty_level: 3 },
          { name: 'Social Proof Timing', description: 'Deploy customer stories and case studies at the moment when the buyer is most receptive to peer validation.', difficulty_level: 3 },
          { name: 'Decision Fatigue Prevention', description: 'Simplify choices and guide the buyer through decisions without overwhelming them with options.', difficulty_level: 3 },
          { name: 'Emotional vs. Rational Triggers', description: 'Read whether the buyer is making an emotional or rational decision and adjust your approach accordingly.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Value Framing',
        description: 'Articulate business value in terms that resonate with buyers.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'ROI Narrative Construction', description: 'Build a compelling return-on-investment story using the buyer\'s own numbers and context.', difficulty_level: 3 },
          { name: 'Outcome vs. Feature Language', description: 'Translate product features into business outcomes — not "we have X" but "you\'ll achieve Y."', difficulty_level: 2 },
          { name: 'Competitive Differentiation', description: 'Articulate why your solution is uniquely better without bashing competitors.', difficulty_level: 3 },
          { name: 'Risk Mitigation Framing', description: 'Position your solution as a way to reduce risk, not just generate value — especially for risk-averse buyers.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Stakeholder Mapping',
        description: 'Identify and engage all decision-makers in complex deals.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Decision Process Discovery', description: 'Uncover the actual decision-making process — who decides, who influences, who can veto, and what the timeline is.', difficulty_level: 3 },
          { name: 'Champion Identification', description: 'Find and cultivate an internal advocate who will sell on your behalf when you\'re not in the room.', difficulty_level: 3 },
          { name: 'Blocker Neutralization', description: 'Identify people who may block the deal and address their concerns directly rather than working around them.', difficulty_level: 4 },
          { name: 'Multi-threaded Engagement', description: 'Build relationships with multiple contacts at different levels so your deal doesn\'t depend on a single person.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Objection Handling',
        description: 'Systematically address and overcome buyer objections.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Objection Anticipation', description: 'Prepare responses for the 5 most common objections before they arise in conversation.', difficulty_level: 2 },
          { name: 'Feel-Felt-Found Method', description: 'Validate the concern, share that others felt similarly, and describe what they found after using the solution.', difficulty_level: 2 },
          { name: 'Price Objection Reframing', description: 'Shift price conversations from cost to value, total cost of ownership, or cost of inaction.', difficulty_level: 3 },
          { name: 'Timing Objection Navigation', description: 'Address "not now" by creating urgency around the cost of delay without being pushy.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Negotiation Fundamentals',
        description: 'Close deals that create value for both sides.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Walk-Away Clarity', description: 'Know your minimum acceptable terms before entering any negotiation and stick to them.', difficulty_level: 2 },
          { name: 'Trading vs. Giving', description: 'Never make a concession without getting something in return — even small trades maintain balance.', difficulty_level: 3 },
          { name: 'Closing Signal Recognition', description: 'Identify verbal and behavioral cues that indicate the buyer is ready to commit and move to close.', difficulty_level: 3 },
          { name: 'Contract Language Awareness', description: 'Understand how negotiation points translate into contract terms to avoid post-deal surprises.', difficulty_level: 3 },
        ],
      },
    ],
  },
  {
    name: 'Leadership Essentials',
    category: 'Leadership Skills',
    description: 'Make decisions under uncertainty, delegate effectively, align teams, and build cultures of accountability.',
    archetype: 'conversational',
    session_engine: 'roleplay_engine',
    icon: '👑',
    sub_skills: [
      {
        name: 'Decision-Making Under Uncertainty',
        description: 'Make sound decisions when information is incomplete.',
        difficulty_level: 5,
        atomic_skills: [
          { name: 'Information Sufficiency Judgment', description: 'Determine when you have "enough" information to decide rather than waiting for perfect data.', difficulty_level: 4 },
          { name: 'Reversibility Assessment', description: 'Classify decisions as one-way or two-way doors to calibrate how much analysis is warranted.', difficulty_level: 3 },
          { name: 'Scenario Planning', description: 'Map out 2-3 likely outcomes for each option and prepare contingency responses for each.', difficulty_level: 4 },
          { name: 'Bias Correction', description: 'Actively check for anchoring, confirmation bias, and sunk cost fallacy in your own reasoning.', difficulty_level: 5 },
          { name: 'Decision Communication', description: 'Clearly explain the rationale behind a decision so others can support it even if they disagreed.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Delegation',
        description: 'Assign work effectively while maintaining accountability.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Task-Person Matching', description: 'Assign work based on the intersection of skill, development needs, and capacity — not just who\'s available.', difficulty_level: 2 },
          { name: 'Outcome Definition', description: 'Define what "done" looks like clearly enough that the person can succeed without constant check-ins.', difficulty_level: 2 },
          { name: 'Authority Granting', description: 'Give the person decision-making authority over how to accomplish the task, not just the task itself.', difficulty_level: 3 },
          { name: 'Check-in Cadence Setting', description: 'Establish the right frequency and format for progress updates without micromanaging.', difficulty_level: 3 },
          { name: 'Letting Go of Control', description: 'Accept that the delegatee may do it differently than you would — and that\'s okay if the outcome is met.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Team Alignment',
        description: 'Create shared vision and coordinate toward common goals.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Vision Articulation', description: 'Describe where the team is going and why in terms that are concrete, memorable, and motivating.', difficulty_level: 3 },
          { name: 'Goal Cascading', description: 'Break the vision into team goals, then individual goals, so everyone sees how their work connects.', difficulty_level: 3 },
          { name: 'Priority Communication', description: 'Make trade-offs explicit — when everything is priority 1, nothing is. Communicate what matters most right now.', difficulty_level: 4 },
          { name: 'Cross-role Dependency Mapping', description: 'Identify where team members depend on each other and make those handoffs visible and smooth.', difficulty_level: 3 },
          { name: 'Realignment After Disruption', description: 'Quickly re-orient the team after a change in direction, setback, or new information.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Accountability',
        description: 'Hold self and others responsible for commitments and outcomes.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Commitment Clarity', description: 'Ensure every commitment has a specific owner, deliverable, and deadline — no ambiguity.', difficulty_level: 2 },
          { name: 'Progress Visibility', description: 'Create systems where progress (or lack of it) is visible to the team without constant status meetings.', difficulty_level: 2 },
          { name: 'Difficult Conversation Initiation', description: 'Address missed commitments promptly and directly rather than hoping they resolve themselves.', difficulty_level: 4 },
          { name: 'Accountability Without Blame', description: 'Focus on what happened, what was learned, and what changes — not on who is at fault.', difficulty_level: 3 },
          { name: 'Self-Accountability Modeling', description: 'Publicly own your own mistakes and commitments to set the standard for the team.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Coaching & Feedback',
        description: 'Develop others through guided practice and honest feedback.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Question-Led Coaching', description: 'Guide the person to discover the answer themselves through questions rather than just telling them what to do.', difficulty_level: 3 },
          { name: 'Strength Spotting', description: 'Identify and name the person\'s specific strengths so they can lean into them deliberately.', difficulty_level: 2 },
          { name: 'Growth Edge Identification', description: 'Pinpoint the one or two skills that would have the highest impact if improved right now.', difficulty_level: 3 },
          { name: 'Real-Time Coaching', description: 'Provide in-the-moment feedback during or immediately after key situations when the experience is fresh.', difficulty_level: 4 },
          { name: 'Development Plan Co-creation', description: 'Build a growth plan together rather than imposing one — shared ownership drives follow-through.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Resource Allocation',
        description: 'Distribute limited resources for maximum impact.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Impact Assessment', description: 'Evaluate the potential return of each initiative before allocating time, money, or people.', difficulty_level: 3 },
          { name: 'Trade-off Communication', description: 'When saying yes to one thing means saying no to another, make the trade-off visible to stakeholders.', difficulty_level: 3 },
          { name: 'Capacity Realism', description: 'Assess actual team capacity honestly — accounting for interruptions, context-switching, and maintenance work.', difficulty_level: 3 },
          { name: 'Rebalancing Triggers', description: 'Define clear signals that indicate resources should be shifted from one initiative to another.', difficulty_level: 4 },
          { name: 'Strategic Underfunding Prevention', description: 'Avoid spreading resources so thin that nothing gets done well — concentrate to win.', difficulty_level: 4 },
        ],
      },
    ],
  },

  // ─── ANALYTICAL ARCHETYPE ─────────────────────────────────────────────────
  // Engine: reasoning_engine — structured workspace, assumption mapping, counterfactuals
  {
    name: 'Critical Thinking',
    category: 'Cognitive Skills',
    description: 'Analyze arguments, detect biases, evaluate evidence, and reason logically to form well-founded judgments.',
    archetype: 'analytical',
    session_engine: 'reasoning_engine',
    icon: '🔍',
    sub_skills: [
      {
        name: 'Bias Detection',
        description: 'Identify cognitive and systemic biases in arguments and data.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Confirmation Bias Recognition', description: 'Catch when you or others are selectively seeking evidence that supports a pre-existing belief.', difficulty_level: 2 },
          { name: 'Anchoring Effect Awareness', description: 'Notice when an initial number or reference point is disproportionately influencing subsequent judgments.', difficulty_level: 3 },
          { name: 'Survivorship Bias Detection', description: 'Identify when conclusions are drawn only from successes while ignoring the larger pool of failures.', difficulty_level: 3 },
          { name: 'Availability Heuristic Check', description: 'Recognize when you\'re overweighting information that comes to mind easily rather than using representative data.', difficulty_level: 3 },
          { name: 'Source Bias Evaluation', description: 'Assess whether the source of information has incentives that might distort their presentation of facts.', difficulty_level: 3 },
        ],
      },
      {
        name: 'First Principles Thinking',
        description: 'Break problems down to fundamental truths and reason upward.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Assumption Stripping', description: 'Remove inherited assumptions and conventions to see what remains as genuinely fundamental.', difficulty_level: 3 },
          { name: 'Foundational Truth Identification', description: 'Identify the core facts that are independently verifiable and not dependent on other claims.', difficulty_level: 4 },
          { name: 'Bottom-Up Reconstruction', description: 'Rebuild your reasoning from foundational truths upward, testing each logical step.', difficulty_level: 4 },
          { name: 'Analogy vs. First Principles Distinction', description: 'Recognize when you\'re reasoning by analogy (this is like X) vs. from first principles (the physics of this situation).', difficulty_level: 4 },
        ],
      },
      {
        name: 'Argument Analysis',
        description: 'Evaluate the structure and validity of arguments.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Premise Identification', description: 'Extract the explicit and implicit premises from an argument to evaluate them independently.', difficulty_level: 2 },
          { name: 'Logical Fallacy Detection', description: 'Spot common logical fallacies — ad hominem, straw man, false dichotomy, appeal to authority.', difficulty_level: 2 },
          { name: 'Conclusion Validity Testing', description: 'Determine whether the conclusion actually follows from the premises, even if the premises are true.', difficulty_level: 3 },
          { name: 'Counter-argument Generation', description: 'Construct the strongest possible argument against a position to test its robustness.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Evidence Evaluation',
        description: 'Assess the quality, relevance, and reliability of evidence.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Evidence Quality Rating', description: 'Distinguish between strong evidence (controlled studies, large samples) and weak evidence (anecdotes, small samples).', difficulty_level: 2 },
          { name: 'Relevance Assessment', description: 'Determine whether a piece of evidence actually supports the specific claim being made, not just a related one.', difficulty_level: 3 },
          { name: 'Conflicting Evidence Reconciliation', description: 'When evidence points in different directions, determine which is more reliable and why.', difficulty_level: 4 },
          { name: 'Missing Evidence Identification', description: 'Ask "what evidence would I need to see, and what evidence is suspiciously absent?"', difficulty_level: 3 },
        ],
      },
      {
        name: 'Logical Reasoning',
        description: 'Apply deductive and inductive reasoning to reach conclusions.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Deductive Chain Building', description: 'Construct valid if-then reasoning chains where the conclusion necessarily follows from the premises.', difficulty_level: 2 },
          { name: 'Inductive Pattern Recognition', description: 'Draw reasonable generalizations from specific observations while noting the limits of induction.', difficulty_level: 2 },
          { name: 'Conditional Reasoning', description: 'Handle "if P then Q" statements correctly — understanding that Q doesn\'t prove P (affirming the consequent).', difficulty_level: 3 },
          { name: 'Reductio ad Absurdum', description: 'Test a claim by assuming it\'s true and showing it leads to a contradiction or absurd consequence.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Probabilistic Thinking',
        description: 'Reason about uncertainty and make decisions with incomplete information.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Base Rate Consideration', description: 'Start with the base rate (how common something is) before updating based on new evidence.', difficulty_level: 3 },
          { name: 'Bayesian Updating', description: 'Adjust your confidence in a belief proportionally to the strength of new evidence.', difficulty_level: 4 },
          { name: 'Confidence Calibration', description: 'Assign honest probability estimates to your beliefs and track how well-calibrated they are over time.', difficulty_level: 4 },
          { name: 'Expected Value Calculation', description: 'Multiply probability × impact for each option to compare decisions under uncertainty.', difficulty_level: 3 },
          { name: 'Tail Risk Awareness', description: 'Account for low-probability, high-impact events that standard analysis often ignores.', difficulty_level: 5 },
        ],
      },
    ],
  },
  {
    name: 'Problem Solving',
    category: 'Cognitive Skills',
    description: 'Diagnose root causes, generate creative solutions, prioritize effectively, and iterate through complex challenges.',
    archetype: 'analytical',
    session_engine: 'reasoning_engine',
    icon: '🧩',
    sub_skills: [
      {
        name: 'Root Cause Analysis',
        description: 'Identify the underlying cause of problems, not just symptoms.',
        difficulty_level: 2,
        atomic_skills: [
          { name: '5-Whys Drilling', description: 'Ask "why?" iteratively to move from symptoms to deeper causes until you reach a systemic root.', difficulty_level: 1 },
          { name: 'Symptom vs. Cause Distinction', description: 'Clearly separate what you observe (symptom) from what\'s producing it (cause) — they\'re often confused.', difficulty_level: 2 },
          { name: 'Fishbone Diagramming', description: 'Map potential causes across categories (people, process, technology, environment) to avoid tunnel vision.', difficulty_level: 2 },
          { name: 'Multiple Root Cause Awareness', description: 'Accept that most problems have several contributing causes, not a single "silver bullet" root cause.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Ideation',
        description: 'Generate diverse and creative solution options.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Divergent Thinking', description: 'Generate many ideas without judging them — quantity leads to quality in the early phase.', difficulty_level: 1 },
          { name: 'Cross-Domain Borrowing', description: 'Look at how unrelated fields solve similar problems and adapt their approaches.', difficulty_level: 3 },
          { name: 'Constraint Removal', description: 'Ask "what would we do if we had unlimited time/money/people?" to unlock ideas that constraints are hiding.', difficulty_level: 2 },
          { name: 'Idea Combination', description: 'Merge two mediocre ideas into one strong hybrid solution that captures the best of both.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Decision Frameworks',
        description: 'Apply structured approaches to making decisions.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Framework Selection', description: 'Choose the right decision-making tool for the situation — SWOT, decision matrix, pros/cons, or expected value.', difficulty_level: 2 },
          { name: 'Criteria Weighting', description: 'Assign relative importance to decision criteria to prevent all factors being treated as equally important.', difficulty_level: 3 },
          { name: 'Sensitivity Analysis', description: 'Test how much the decision changes if your key assumptions are wrong by 20-50%.', difficulty_level: 3 },
          { name: 'Decision Documentation', description: 'Record the reasoning, assumptions, and evidence behind important decisions for future review.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Iteration & Testing',
        description: 'Build, test, and refine solutions rapidly.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'MVP Scoping', description: 'Define the smallest version of a solution that can test your most critical assumption.', difficulty_level: 2 },
          { name: 'Hypothesis Formulation', description: 'Turn vague ideas into testable hypotheses — "If we do X, we expect Y because of Z."', difficulty_level: 2 },
          { name: 'Feedback Interpretation', description: 'Separate signal from noise in test results — know when to pivot, persevere, or iterate.', difficulty_level: 3 },
          { name: 'Rapid Prototyping', description: 'Build quick, imperfect versions to learn fast rather than spending months on a polished first attempt.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Prioritization',
        description: 'Rank tasks and solutions by impact and feasibility.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Impact-Effort Matrix', description: 'Plot options on an impact vs. effort grid to identify quick wins and strategic investments.', difficulty_level: 1 },
          { name: 'Urgency vs. Importance Separation', description: 'Distinguish between what\'s screaming for attention and what actually matters most — they\'re different.', difficulty_level: 2 },
          { name: 'Sequencing Logic', description: 'Determine which tasks unlock others and should go first (dependencies, prerequisites, bottlenecks).', difficulty_level: 2 },
          { name: 'Saying No Constructively', description: 'Decline lower-priority requests in a way that maintains relationships and explains the trade-off.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Constraint Navigation',
        description: 'Find solutions within tight resource, time, or rule constraints.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Constraint Classification', description: 'Distinguish between real constraints (physics, law) and assumed constraints (policy, tradition, fear).', difficulty_level: 3 },
          { name: 'Creative Workarounds', description: 'Find paths around constraints without violating them — work with the constraint, not against it.', difficulty_level: 3 },
          { name: 'Scope Negotiation', description: 'When you can\'t change the constraint, negotiate the scope of what\'s delivered within it.', difficulty_level: 3 },
          { name: 'Resource Substitution', description: 'When one resource is unavailable, identify alternative resources that can serve the same function.', difficulty_level: 4 },
        ],
      },
    ],
  },
  {
    name: 'Creative Thinking',
    category: 'Cognitive Skills',
    description: 'Generate novel ideas, reframe problems, synthesize diverse inputs, and think laterally to find innovative solutions.',
    archetype: 'analytical',
    session_engine: 'reasoning_engine',
    icon: '💡',
    sub_skills: [
      {
        name: 'Lateral Thinking',
        description: 'Approach problems from unexpected angles and perspectives.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Assumption Reversal', description: 'Take a core assumption about the problem and deliberately reverse it to see what new solutions emerge.', difficulty_level: 2 },
          { name: 'Random Entry Point', description: 'Force a connection between the problem and a random concept to break out of conventional thinking patterns.', difficulty_level: 3 },
          { name: 'Perspective Shifting', description: 'View the problem from a completely different stakeholder\'s perspective — customer, competitor, new employee.', difficulty_level: 3 },
          { name: 'Provocation Technique', description: 'Make deliberately absurd statements about the problem to provoke new thinking directions.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Reframing',
        description: 'Transform how a problem is perceived to unlock new solutions.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Problem Redefinition', description: 'Challenge whether you\'re solving the right problem — sometimes the framing itself is the constraint.', difficulty_level: 3 },
          { name: 'Opportunity Finding', description: 'Recast problems as opportunities — "We have too many customers" → "We have a scaling challenge to solve."', difficulty_level: 2 },
          { name: 'Level Shifting', description: 'Move up or down the abstraction ladder — zoom out to see the system or zoom in to see the details.', difficulty_level: 3 },
          { name: 'Stakeholder Reframing', description: 'Redefine who the beneficiary is to unlock different solution spaces.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Synthesis',
        description: 'Combine disparate ideas into coherent new concepts.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Pattern Connection', description: 'Identify structural similarities between ideas from different domains that aren\'t obviously related.', difficulty_level: 3 },
          { name: 'Tension Resolution', description: 'Find solutions that reconcile seemingly contradictory requirements rather than choosing one over the other.', difficulty_level: 4 },
          { name: 'Integrative Thinking', description: 'Hold two opposing models in mind simultaneously and produce a new model that\'s better than either.', difficulty_level: 5 },
          { name: 'Narrative Synthesis', description: 'Weave diverse data points, perspectives, and evidence into a coherent story that reveals a new insight.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Generative Brainstorming',
        description: 'Produce high volumes of ideas without self-censoring.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Judgment Suspension', description: 'Actively suppress the "that won\'t work" voice during generation — evaluation comes later.', difficulty_level: 2 },
          { name: 'Building on Others\' Ideas', description: 'Use "yes, and..." thinking to extend someone else\'s idea rather than starting from scratch each time.', difficulty_level: 1 },
          { name: 'Quantity Forcing', description: 'Set a specific target (e.g., 20 ideas in 10 minutes) to push past the obvious first few answers.', difficulty_level: 2 },
          { name: 'Category Hopping', description: 'Deliberately switch between different categories of solutions to ensure breadth of exploration.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Conceptual Blending',
        description: 'Merge ideas from different domains to create innovation.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Analogical Transfer', description: 'Map the structure of a solution from one domain onto a problem in a different domain.', difficulty_level: 3 },
          { name: 'Feature Recombination', description: 'Take features from two existing solutions and combine them into a novel hybrid.', difficulty_level: 3 },
          { name: 'Metaphor Construction', description: 'Create metaphors that reveal hidden properties of the problem and suggest new solution directions.', difficulty_level: 4 },
          { name: 'Cross-Industry Scanning', description: 'Systematically look at how other industries solved structurally similar challenges.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Creative Constraints',
        description: 'Use limitations as a catalyst for creative breakthroughs.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Deliberate Constraint Addition', description: 'Add artificial constraints (e.g., "solve it in one page" or "without technology") to force novel thinking.', difficulty_level: 2 },
          { name: 'Resource Creativity', description: 'Ask "what can we do with what we already have?" before requesting new resources.', difficulty_level: 2 },
          { name: 'Time Boxing for Creativity', description: 'Use tight deadlines to prevent perfectionism and force rapid creative output.', difficulty_level: 2 },
          { name: 'Constraint as Feature', description: 'Reframe a limitation as a feature or selling point rather than something to overcome.', difficulty_level: 3 },
        ],
      },
    ],
  },
  {
    name: 'Judgment',
    category: 'Strategic Skills',
    description: 'Distinguish signal from noise, assess risks, analyze trade-offs, and make ethically sound decisions.',
    archetype: 'analytical',
    session_engine: 'reasoning_engine',
    icon: '⚖️',
    sub_skills: [
      {
        name: 'Signal vs Noise Detection',
        description: 'Distinguish meaningful information from distractions.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Pattern vs. Coincidence Distinction', description: 'Determine whether a recurring observation represents a real pattern or random clustering.', difficulty_level: 3 },
          { name: 'Information Triage', description: 'Quickly sort incoming information into "act on", "monitor", and "ignore" categories.', difficulty_level: 3 },
          { name: 'Leading Indicator Identification', description: 'Find the early signals that predict outcomes before lagging indicators confirm them.', difficulty_level: 4 },
          { name: 'Noise Source Recognition', description: 'Identify sources of noise — media hype, recency bias, vocal minorities — and discount them appropriately.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Risk Assessment',
        description: 'Evaluate probability and impact of potential outcomes.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Probability Estimation', description: 'Assign rough but honest probability estimates to potential outcomes rather than thinking in binary (will/won\'t).', difficulty_level: 3 },
          { name: 'Impact Dimensioning', description: 'Assess impact across multiple dimensions — financial, reputational, operational, and human.', difficulty_level: 3 },
          { name: 'Risk Appetite Calibration', description: 'Match the level of risk you\'re willing to take to the specific context and stakes involved.', difficulty_level: 3 },
          { name: 'Mitigation Planning', description: 'For each significant risk, define a specific action that reduces either the probability or the impact.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Trade-off Analysis',
        description: 'Compare options when each involves giving something up.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Hidden Cost Surfacing', description: 'Identify the non-obvious costs of each option — opportunity cost, maintenance burden, relationship costs.', difficulty_level: 3 },
          { name: 'Reversibility Evaluation', description: 'Assess how easy or hard it would be to reverse each option if it turns out to be wrong.', difficulty_level: 2 },
          { name: 'Time Horizon Matching', description: 'Ensure you\'re comparing options across the same time frame — short-term pain vs. long-term gain.', difficulty_level: 3 },
          { name: 'Value Hierarchy Clarification', description: 'When values conflict (speed vs. quality, innovation vs. stability), clarify which takes precedence.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Ethical Judgment',
        description: 'Make decisions that balance effectiveness with moral principles.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Stakeholder Impact Mapping', description: 'Identify all parties affected by a decision, including those who don\'t have a voice in the room.', difficulty_level: 3 },
          { name: 'Newspaper Test', description: 'Ask "Would I be comfortable if this decision was reported on the front page?" as a quick ethical check.', difficulty_level: 2 },
          { name: 'Precedent Thinking', description: 'Consider what precedent this decision sets — if everyone did this, would the system still work?', difficulty_level: 3 },
          { name: 'Values vs. Incentives Audit', description: 'Check whether the decision aligns with stated values or is being driven by misaligned incentives.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Long-term Thinking',
        description: 'Consider extended consequences and future implications.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Second-Order Effect Anticipation', description: 'Think beyond the immediate effect to ask "and then what?" — what cascading consequences follow?', difficulty_level: 4 },
          { name: 'Trend Extrapolation', description: 'Project current trends forward to see where they lead, while accounting for diminishing or accelerating returns.', difficulty_level: 3 },
          { name: 'Option Preservation', description: 'When uncertain, choose paths that keep future options open rather than ones that lock you in.', difficulty_level: 3 },
          { name: 'Legacy Thinking', description: 'Consider what impact this decision will have in 5 years, not just this quarter.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Decision Quality Evaluation',
        description: 'Assess the quality of past decisions to improve future ones.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Process vs. Outcome Separation', description: 'Evaluate whether the decision process was sound regardless of the outcome — good processes sometimes produce bad results.', difficulty_level: 3 },
          { name: 'Hindsight Bias Control', description: 'Assess past decisions based on what was known at the time, not what you know now.', difficulty_level: 3 },
          { name: 'Decision Journal Review', description: 'Document and periodically review your decisions, reasoning, and confidence levels to improve calibration.', difficulty_level: 2 },
          { name: 'Pattern Extraction', description: 'Identify recurring themes in your decision successes and failures to build personal decision heuristics.', difficulty_level: 3 },
        ],
      },
    ],
  },

  // ─── REFLECTIVE ARCHETYPE ─────────────────────────────────────────────────
  // Engine: reflection_engine — journaling, pattern detection, behavior analysis
  {
    name: 'Emotional Intelligence',
    category: 'Human Skills',
    description: 'Understand and manage your own emotions, empathize with others, and navigate social complexity with self-awareness and resilience.',
    archetype: 'reflective',
    session_engine: 'reflection_engine',
    icon: '🧠',
    sub_skills: [
      {
        name: 'Self Awareness',
        description: 'Recognize your own emotional patterns, triggers, and blind spots.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Emotion Labeling', description: 'Name your emotions with precision — "frustrated" vs. "angry" vs. "disappointed" are different and require different responses.', difficulty_level: 1 },
          { name: 'Trigger Identification', description: 'Map the specific situations, words, or behaviors that reliably provoke an emotional reaction in you.', difficulty_level: 2 },
          { name: 'Body Signal Reading', description: 'Notice physical cues (tension, heart rate, shallow breathing) as early indicators of emotional states.', difficulty_level: 2 },
          { name: 'Blind Spot Acceptance', description: 'Actively seek and accept feedback about patterns you can\'t see in yourself.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Self Regulation',
        description: 'Manage impulses, stay composed under pressure, and adapt responses.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Pause Before Responding', description: 'Create a deliberate gap between stimulus and response — even 3 seconds changes the quality of your reaction.', difficulty_level: 2 },
          { name: 'Reappraisal', description: 'Reinterpret a triggering situation in a less threatening way — "they\'re stressed" vs. "they\'re attacking me."', difficulty_level: 3 },
          { name: 'Impulse Redirection', description: 'Channel the energy from an emotional impulse into a constructive action rather than suppressing it.', difficulty_level: 3 },
          { name: 'Recovery Speed', description: 'Reduce the time it takes to return to baseline after an emotional disruption — from hours to minutes.', difficulty_level: 4 },
          { name: 'Composure Under Observation', description: 'Maintain emotional control when others are watching, judging, or depending on your steadiness.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Empathy',
        description: 'Perceive and understand others\' emotions and perspectives.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Emotional Reading', description: 'Detect the emotional state of others through facial expressions, tone of voice, and body language.', difficulty_level: 2 },
          { name: 'Perspective Taking', description: 'Mentally step into someone else\'s position and understand why they see the situation the way they do.', difficulty_level: 2 },
          { name: 'Empathic Listening', description: 'Listen with the goal of understanding feelings, not just facts — hear the emotion behind the words.', difficulty_level: 2 },
          { name: 'Compassion Without Absorption', description: 'Care about someone\'s pain without taking it on as your own — maintain boundaries while being present.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Social Skills',
        description: 'Build rapport, manage relationships, and influence positively.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Rapport Building', description: 'Establish genuine connection quickly through authentic curiosity, mirroring, and finding common ground.', difficulty_level: 2 },
          { name: 'Social Context Reading', description: 'Assess the unspoken dynamics in a group — power structures, alliances, and tensions — before acting.', difficulty_level: 3 },
          { name: 'Relationship Maintenance', description: 'Proactively nurture professional relationships through consistent small gestures, not just when you need something.', difficulty_level: 2 },
          { name: 'Difficult Person Navigation', description: 'Work effectively with people you find challenging without either confrontation or avoidance.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Motivation',
        description: 'Maintain drive, optimism, and commitment to goals.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Intrinsic Motivation Activation', description: 'Connect tasks to personal meaning and purpose rather than relying on external rewards or pressure.', difficulty_level: 2 },
          { name: 'Progress Tracking', description: 'Make progress visible to yourself — small wins sustain motivation more than distant end goals.', difficulty_level: 1 },
          { name: 'Optimism Calibration', description: 'Maintain realistic optimism — believing things can improve while honestly acknowledging current challenges.', difficulty_level: 3 },
          { name: 'Energy Management', description: 'Match high-importance tasks to high-energy periods and protect your capacity for sustained effort.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Resilience',
        description: 'Recover from setbacks, adapt to adversity, and sustain performance.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Setback Reframing', description: 'Reinterpret failures as learning data rather than evidence of inadequacy.', difficulty_level: 3 },
          { name: 'Recovery Rituals', description: 'Develop specific practices (reflection, exercise, conversation) that reliably restore your emotional baseline.', difficulty_level: 2 },
          { name: 'Stress Inoculation', description: 'Deliberately expose yourself to manageable challenges to build tolerance for future high-stress situations.', difficulty_level: 4 },
          { name: 'Support Network Activation', description: 'Know when and how to lean on your support network — resilience isn\'t about going it alone.', difficulty_level: 3 },
          { name: 'Meaning-Making', description: 'Find meaning or purpose in difficult experiences to transform them from purely negative to growth-oriented.', difficulty_level: 4 },
        ],
      },
    ],
  },
  {
    name: 'Metacognition',
    category: 'Cognitive Skills',
    description: 'Think about your own thinking — calibrate confidence, manage attention, select mental models, and optimize learning.',
    archetype: 'reflective',
    session_engine: 'reflection_engine',
    icon: '🪞',
    sub_skills: [
      {
        name: 'Cognitive Bias Awareness',
        description: 'Recognize when your own thinking is being distorted by biases.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Real-Time Bias Catching', description: 'Notice in the moment when a cognitive bias is influencing your thinking — not just in retrospect.', difficulty_level: 3 },
          { name: 'Bias Trigger Mapping', description: 'Map which situations (time pressure, social pressure, fatigue) make you most susceptible to specific biases.', difficulty_level: 3 },
          { name: 'De-biasing Routines', description: 'Apply specific counteractions — like considering the opposite, or using checklists — when you detect bias risk.', difficulty_level: 3 },
          { name: 'Distinguishing Biases from Heuristics', description: 'Know when a cognitive shortcut is serving you well (useful heuristic) vs. when it\'s distorting your judgment (harmful bias).', difficulty_level: 4 },
        ],
      },
      {
        name: 'Confidence Calibration',
        description: 'Accurately assess how much you actually know.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Knowledge Boundary Mapping', description: 'Clearly delineate what you know, what you think you know, and what you don\'t know about a topic.', difficulty_level: 3 },
          { name: 'Prediction Tracking', description: 'Make explicit predictions with confidence levels and track your accuracy over time.', difficulty_level: 3 },
          { name: 'Dunning-Kruger Self-Check', description: 'Actively consider whether your confidence in a domain is based on expertise or on ignorance of complexity.', difficulty_level: 4 },
          { name: 'Uncertainty Communication', description: 'Express your confidence level clearly to others — "I\'m 70% sure" is more useful than "I think so."', difficulty_level: 3 },
        ],
      },
      {
        name: 'Self Reflection',
        description: 'Systematically review your own performance and growth.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Structured Debriefing', description: 'After important events, ask: What went well? What didn\'t? What will I do differently next time?', difficulty_level: 1 },
          { name: 'Pattern Identification', description: 'Look across multiple experiences to find recurring themes in your successes and struggles.', difficulty_level: 2 },
          { name: 'Feedback Integration', description: 'Actively seek feedback from others and incorporate it into your self-assessment rather than relying solely on self-perception.', difficulty_level: 2 },
          { name: 'Growth Tracking', description: 'Document your development over time to see progress that daily perspective makes invisible.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Attention Management',
        description: 'Direct and sustain focus on high-priority cognitive tasks.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Distraction Anticipation', description: 'Predict and preemptively block likely distractions before starting deep work.', difficulty_level: 2 },
          { name: 'Focus Recovery', description: 'Develop techniques to quickly re-enter a state of concentration after an interruption.', difficulty_level: 3 },
          { name: 'Attention Allocation', description: 'Consciously decide where to direct attention rather than letting it be pulled by whatever is most urgent or novel.', difficulty_level: 3 },
          { name: 'Cognitive Load Management', description: 'Break complex tasks into chunks that fit within working memory limits rather than trying to hold everything at once.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Mental Model Selection',
        description: 'Choose the right framework for the problem at hand.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Model Repertoire Building', description: 'Accumulate a diverse toolkit of mental models from different disciplines — economics, physics, psychology, systems.', difficulty_level: 3 },
          { name: 'Problem-Model Matching', description: 'Assess which mental model is most applicable to the current problem rather than defaulting to your favorite.', difficulty_level: 4 },
          { name: 'Model Limitation Awareness', description: 'Understand the boundaries and failure modes of each mental model — "all models are wrong, some are useful."', difficulty_level: 4 },
          { name: 'Multi-Model Analysis', description: 'Apply 2-3 different mental models to the same problem to see what each reveals and conceals.', difficulty_level: 5 },
        ],
      },
      {
        name: 'Learning Optimization',
        description: 'Identify the most efficient strategies for skill acquisition.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Deliberate Practice Design', description: 'Structure practice sessions around specific weaknesses with immediate feedback, not just repetition.', difficulty_level: 2 },
          { name: 'Learning Style Adaptation', description: 'Experiment with different learning methods (reading, doing, teaching, observing) to find what works for specific skills.', difficulty_level: 2 },
          { name: 'Spaced Repetition', description: 'Distribute learning over time with increasing intervals to maximize long-term retention.', difficulty_level: 2 },
          { name: 'Transfer Training', description: 'Practice applying learned skills in progressively different contexts to build flexible, generalizable competence.', difficulty_level: 3 },
        ],
      },
    ],
  },
  {
    name: 'Adaptability',
    category: 'Human Skills',
    description: 'Navigate ambiguity, embrace change, pivot quickly, and maintain performance under shifting conditions.',
    archetype: 'reflective',
    session_engine: 'reflection_engine',
    icon: '🌊',
    sub_skills: [
      {
        name: 'Cognitive Flexibility',
        description: 'Shift thinking between different concepts and perspectives.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Task Switching Efficiency', description: 'Transition between different types of work with minimal cognitive ramp-up time.', difficulty_level: 2 },
          { name: 'Perspective Rotation', description: 'Deliberately view the same situation from 3+ different perspectives to avoid cognitive fixation.', difficulty_level: 3 },
          { name: 'Rule Updating', description: 'Let go of rules and approaches that worked before when evidence shows they no longer apply.', difficulty_level: 3 },
          { name: 'Ambidextrous Thinking', description: 'Switch between creative/divergent and analytical/convergent thinking modes as the task demands.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Ambiguity Tolerance',
        description: 'Perform effectively when information is incomplete or unclear.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Discomfort Management', description: 'Sit with the discomfort of not knowing rather than rushing to premature closure.', difficulty_level: 3 },
          { name: 'Provisional Decision-Making', description: 'Make "good enough for now" decisions with explicit plans to revisit when more information arrives.', difficulty_level: 2 },
          { name: 'Uncertainty Communication', description: 'Communicate ambiguity honestly to your team rather than projecting false certainty.', difficulty_level: 3 },
          { name: 'Opportunity Spotting in Chaos', description: 'Look for advantages and openings that only exist during periods of ambiguity and change.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Learning Agility',
        description: 'Rapidly acquire new skills and apply them in novel situations.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Speed to Competence', description: 'Identify the minimum viable knowledge needed to start being useful and acquire it quickly.', difficulty_level: 2 },
          { name: 'Pattern Transfer', description: 'Recognize when a new situation is structurally similar to something you\'ve handled before and apply those lessons.', difficulty_level: 2 },
          { name: 'Beginner\'s Mindset', description: 'Approach new domains with genuine curiosity rather than assuming your expertise elsewhere translates directly.', difficulty_level: 2 },
          { name: 'Rapid Experimentation', description: 'Test your understanding by doing, not just studying — action reveals gaps that reading conceals.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Pivot Speed',
        description: 'Quickly change direction when circumstances change.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Sunk Cost Release', description: 'Let go of time and resources already invested when the path is no longer viable — they\'re gone regardless.', difficulty_level: 3 },
          { name: 'Rapid Reassessment', description: 'Quickly evaluate the new situation and determine the best next move rather than mourning the old plan.', difficulty_level: 3 },
          { name: 'Stakeholder Realignment', description: 'Bring others up to speed on the pivot quickly and get their commitment to the new direction.', difficulty_level: 3 },
          { name: 'Emotional Processing Speed', description: 'Move through the emotional stages of change (denial, frustration, acceptance) faster so you can act sooner.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Change Navigation',
        description: 'Lead self and others through organizational change.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Change Impact Assessment', description: 'Map who is affected by a change and how — different people experience the same change very differently.', difficulty_level: 3 },
          { name: 'Resistance Understanding', description: 'Seek to understand the reasons behind resistance rather than dismissing it — resistance often carries valuable information.', difficulty_level: 3 },
          { name: 'Small Win Creation', description: 'Create early, visible wins that build momentum and demonstrate that the change is working.', difficulty_level: 3 },
          { name: 'Narrative Control', description: 'Shape the story of why the change is happening and what the future looks like to reduce anxiety and build buy-in.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Stress Adaptation',
        description: 'Maintain cognitive performance under high-stress conditions.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Stress Signal Recognition', description: 'Notice your early stress indicators (sleep disruption, irritability, tunnel vision) before they affect performance.', difficulty_level: 2 },
          { name: 'Cognitive Performance Under Pressure', description: 'Maintain decision-making quality when stakes are high and time is short through practiced routines.', difficulty_level: 4 },
          { name: 'Recovery Optimization', description: 'Build recovery periods into high-stress stretches to prevent accumulated fatigue from degrading performance.', difficulty_level: 3 },
          { name: 'Stress Reframing', description: 'Interpret stress arousal as energy and readiness rather than anxiety — the physiological response is the same.', difficulty_level: 4 },
        ],
      },
    ],
  },

  // ─── SYSTEMS ARCHETYPE (Phase 2) ─────────────────────────────────────────
  {
    name: 'Systems Thinking',
    category: 'Strategic Skills',
    description: 'See the big picture, understand feedback loops, map dependencies, and identify leverage points in complex systems.',
    archetype: 'systems',
    session_engine: 'systems_engine',
    icon: '🔗',
    sub_skills: [
      {
        name: 'Feedback Loops',
        description: 'Identify and understand reinforcing and balancing feedback.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Reinforcing Loop Detection', description: 'Spot virtuous or vicious cycles where outputs amplify inputs.', difficulty_level: 2 },
          { name: 'Balancing Loop Detection', description: 'Identify self-correcting mechanisms that resist change and maintain stability.', difficulty_level: 3 },
          { name: 'Delay Recognition', description: 'Account for time delays between actions and their effects in feedback systems.', difficulty_level: 3 },
          { name: 'Loop Interaction Mapping', description: 'Understand how multiple feedback loops interact and sometimes create unexpected emergent behavior.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Second-Order Effects',
        description: 'Anticipate indirect consequences of actions and decisions.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Consequence Chain Tracing', description: 'Follow the chain of effects beyond the immediate: A causes B, B causes C, C causes D.', difficulty_level: 3 },
          { name: 'Unintended Consequence Anticipation', description: 'Predict side effects that the primary actors didn\'t intend or foresee.', difficulty_level: 4 },
          { name: 'Behavioral Response Prediction', description: 'Predict how people will change their behavior in response to new rules, incentives, or constraints.', difficulty_level: 4 },
          { name: 'Systemic Risk Identification', description: 'See where small local failures could cascade into large systemic failures.', difficulty_level: 5 },
        ],
      },
      {
        name: 'Dependency Mapping',
        description: 'Chart relationships and dependencies between system components.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Critical Path Identification', description: 'Find the sequence of dependent tasks that determines the minimum completion time.', difficulty_level: 2 },
          { name: 'Single Point of Failure Detection', description: 'Identify components whose failure would bring down the entire system.', difficulty_level: 3 },
          { name: 'Interface Boundary Definition', description: 'Clearly define where one system component ends and another begins, including data and control flows.', difficulty_level: 3 },
          { name: 'Circular Dependency Breaking', description: 'Detect and resolve situations where components depend on each other in ways that create deadlock.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Pattern Recognition',
        description: 'Detect recurring structures and behaviors across systems.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Archetype Recognition', description: 'Identify common system archetypes (tragedy of the commons, shifting the burden, fixes that fail).', difficulty_level: 3 },
          { name: 'Cross-System Pattern Transfer', description: 'Recognize when different systems share structural similarities despite surface-level differences.', difficulty_level: 3 },
          { name: 'Anomaly Detection', description: 'Notice when system behavior deviates from established patterns in ways that signal emerging issues.', difficulty_level: 3 },
          { name: 'Temporal Pattern Reading', description: 'Identify cyclical, trending, and seasonal patterns in system behavior over time.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Leverage Point Identification',
        description: 'Find high-impact intervention points in complex systems.',
        difficulty_level: 5,
        atomic_skills: [
          { name: 'Constraint Identification', description: 'Find the bottleneck or constraint that limits the throughput of the entire system.', difficulty_level: 3 },
          { name: 'Rules and Norms Assessment', description: 'Evaluate how the rules governing the system shape behavior and where changing rules would have outsized impact.', difficulty_level: 4 },
          { name: 'Information Flow Optimization', description: 'Identify where better information distribution would naturally improve system performance.', difficulty_level: 4 },
          { name: 'Paradigm Shifting', description: 'Recognize when incremental changes aren\'t enough and a fundamental reframing of the system is needed.', difficulty_level: 5 },
        ],
      },
      {
        name: 'Systems Modeling',
        description: 'Build mental and visual models of system dynamics.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Stock and Flow Thinking', description: 'Model systems in terms of accumulations (stocks) and rates of change (flows).', difficulty_level: 3 },
          { name: 'Causal Loop Diagramming', description: 'Create visual maps that show how variables in a system influence each other.', difficulty_level: 3 },
          { name: 'Boundary Setting', description: 'Decide what to include and exclude from your system model based on the question you\'re trying to answer.', difficulty_level: 4 },
          { name: 'Model Validation', description: 'Test your mental model against reality by making predictions and checking them.', difficulty_level: 4 },
        ],
      },
    ],
  },
  {
    name: 'System Design',
    category: 'Technical Skills',
    description: 'Architect scalable systems, manage dependencies, handle failures gracefully, and optimize for performance.',
    archetype: 'systems',
    session_engine: 'systems_engine',
    icon: '🏗️',
    sub_skills: [
      {
        name: 'Scalability Thinking',
        description: 'Design systems that handle growth in users, data, and complexity.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Load Anticipation', description: 'Project future load requirements and design for 10x current capacity without over-engineering.', difficulty_level: 3 },
          { name: 'Horizontal vs. Vertical Scaling', description: 'Choose the right scaling strategy based on the system architecture and bottleneck type.', difficulty_level: 3 },
          { name: 'Stateless Design', description: 'Minimize shared state to enable easy horizontal scaling and reduce coordination overhead.', difficulty_level: 4 },
          { name: 'Data Partitioning Strategy', description: 'Choose the right sharding or partitioning approach based on access patterns and consistency requirements.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Architecture Planning',
        description: 'Create high-level blueprints for complex technical systems.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Component Decomposition', description: 'Break a system into components with clear responsibilities and minimal coupling.', difficulty_level: 3 },
          { name: 'Interface Design', description: 'Define clean, stable interfaces between components that allow independent evolution.', difficulty_level: 3 },
          { name: 'Technology Selection', description: 'Choose technologies based on fit for the problem, team capability, and long-term maintainability.', difficulty_level: 4 },
          { name: 'Evolution Planning', description: 'Design the system so it can evolve incrementally rather than requiring big-bang rewrites.', difficulty_level: 4 },
        ],
      },
      {
        name: 'Trade-off Analysis',
        description: 'Navigate competing concerns in system design decisions.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'CAP Theorem Awareness', description: 'Understand that distributed systems must trade off between consistency, availability, and partition tolerance.', difficulty_level: 3 },
          { name: 'Build vs. Buy Evaluation', description: 'Assess when to build custom vs. use off-the-shelf based on total cost, control, and strategic importance.', difficulty_level: 3 },
          { name: 'Complexity Budget Management', description: 'Treat complexity as a limited resource — every added complexity must justify its value.', difficulty_level: 3 },
          { name: 'Performance vs. Maintainability Balance', description: 'Choose the right level of optimization based on actual (not imagined) performance requirements.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Dependency Management',
        description: 'Handle inter-system relationships and versioning.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Dependency Minimization', description: 'Reduce the number of external dependencies to decrease surface area for breaking changes.', difficulty_level: 2 },
          { name: 'Version Compatibility Planning', description: 'Design for backward and forward compatibility to avoid coordinated deployments.', difficulty_level: 3 },
          { name: 'Dependency Health Assessment', description: 'Evaluate third-party dependencies for maintenance health, security, and bus factor.', difficulty_level: 3 },
          { name: 'Abstraction Layer Design', description: 'Wrap external dependencies behind interfaces so they can be replaced without system-wide changes.', difficulty_level: 3 },
        ],
      },
      {
        name: 'Failure Handling',
        description: 'Design for graceful degradation and fault tolerance.',
        difficulty_level: 5,
        atomic_skills: [
          { name: 'Failure Mode Analysis', description: 'Systematically enumerate how each component can fail and design responses for each scenario.', difficulty_level: 3 },
          { name: 'Circuit Breaker Pattern', description: 'Implement mechanisms that prevent cascading failures by stopping requests to failing services.', difficulty_level: 4 },
          { name: 'Graceful Degradation Design', description: 'Ensure the system continues providing core functionality even when secondary systems are down.', difficulty_level: 4 },
          { name: 'Recovery Automation', description: 'Design self-healing systems that detect failures and recover automatically without human intervention.', difficulty_level: 5 },
        ],
      },
      {
        name: 'Performance Optimization',
        description: 'Identify and resolve performance bottlenecks.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Bottleneck Identification', description: 'Use profiling and measurement to find the actual bottleneck rather than optimizing based on intuition.', difficulty_level: 3 },
          { name: 'Caching Strategy', description: 'Choose the right caching layer, invalidation strategy, and TTL based on access patterns and consistency needs.', difficulty_level: 3 },
          { name: 'Query Optimization', description: 'Analyze and optimize database queries using indexes, query plans, and denormalization where appropriate.', difficulty_level: 4 },
          { name: 'Load Testing', description: 'Design and execute load tests that simulate realistic traffic patterns to validate performance under stress.', difficulty_level: 3 },
        ],
      },
    ],
  },

  // ─── CREATION ARCHETYPE (Phase 2) ────────────────────────────────────────
  {
    name: 'AI Literacy',
    category: 'Technical Skills',
    description: 'Understand, evaluate, and effectively collaborate with AI systems in professional settings.',
    archetype: 'creation',
    session_engine: 'creation_engine',
    icon: '🤖',
    sub_skills: [
      {
        name: 'Prompt Crafting',
        description: 'Write clear, effective prompts that produce high-quality AI outputs.',
        difficulty_level: 1,
        atomic_skills: [
          { name: 'Specificity and Context Setting', description: 'Provide enough context and constraints in your prompt to guide the AI toward useful outputs.', difficulty_level: 1 },
          { name: 'Output Format Specification', description: 'Define the format, length, and structure you want in the response to get usable results on the first try.', difficulty_level: 1 },
          { name: 'Iterative Refinement', description: 'Treat prompting as a conversation — refine based on the AI\'s output rather than expecting perfection on attempt one.', difficulty_level: 1 },
          { name: 'Role and Persona Assignment', description: 'Set the AI\'s perspective by assigning it a role that shapes the expertise and tone of its response.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Output Evaluation',
        description: 'Critically assess AI-generated content for accuracy and bias.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Factual Verification', description: 'Cross-check AI claims against authoritative sources — AI confidently generates plausible-sounding falsehoods.', difficulty_level: 2 },
          { name: 'Bias Detection in AI Output', description: 'Identify when AI responses reflect biases in training data — demographic, cultural, or ideological.', difficulty_level: 3 },
          { name: 'Quality Benchmarking', description: 'Compare AI output against what a competent human would produce to calibrate expectations.', difficulty_level: 2 },
          { name: 'Hallucination Detection', description: 'Spot fabricated details, invented citations, and confabulated facts that look legitimate.', difficulty_level: 2 },
        ],
      },
      {
        name: 'AI Ethics Awareness',
        description: 'Understand ethical implications of AI usage in work contexts.',
        difficulty_level: 2,
        atomic_skills: [
          { name: 'Data Privacy Judgment', description: 'Assess whether the data you\'re sharing with AI tools creates privacy, confidentiality, or IP risks.', difficulty_level: 2 },
          { name: 'Attribution Ethics', description: 'Navigate the ethical landscape of presenting AI-assisted work — when to disclose, when to own.', difficulty_level: 2 },
          { name: 'Automation Impact Assessment', description: 'Consider how AI deployment affects colleagues, teams, and job functions — not just efficiency metrics.', difficulty_level: 3 },
          { name: 'Responsible Use Guidelines', description: 'Apply organizational and professional guidelines for AI use in sensitive contexts.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Tool Fluency',
        description: 'Navigate and leverage various AI tools effectively.',
        difficulty_level: 1,
        atomic_skills: [
          { name: 'Tool-Task Matching', description: 'Choose the right AI tool for the specific task rather than using one tool for everything.', difficulty_level: 1 },
          { name: 'Capability Assessment', description: 'Understand what each AI tool can and cannot do to set realistic expectations.', difficulty_level: 1 },
          { name: 'Workflow Integration', description: 'Embed AI tools into existing workflows rather than creating separate AI-specific workflows.', difficulty_level: 2 },
          { name: 'Cost-Benefit Analysis', description: 'Evaluate whether using AI for a task actually saves time and improves quality vs. doing it manually.', difficulty_level: 2 },
        ],
      },
      {
        name: 'Human-AI Collaboration',
        description: 'Design workflows that optimally combine human and AI capabilities.',
        difficulty_level: 3,
        atomic_skills: [
          { name: 'Task Decomposition', description: 'Break work into components and assign each to human or AI based on comparative advantage.', difficulty_level: 2 },
          { name: 'Human Review Point Design', description: 'Place human checkpoints at the right stages to catch errors without creating bottlenecks.', difficulty_level: 3 },
          { name: 'Feedback Loop Creation', description: 'Design systems where human corrections improve AI output over time through structured feedback.', difficulty_level: 3 },
          { name: 'Augmentation vs. Automation Judgment', description: 'Decide when AI should assist a human vs. when it should handle the task independently.', difficulty_level: 3 },
        ],
      },
      {
        name: 'AI Workflow Design',
        description: 'Architect multi-step AI processes for complex business tasks.',
        difficulty_level: 4,
        atomic_skills: [
          { name: 'Multi-Step Pipeline Design', description: 'Chain multiple AI operations where the output of one step feeds the input of the next.', difficulty_level: 3 },
          { name: 'Error Handling in AI Pipelines', description: 'Design fallbacks and error handling for each step in an AI workflow.', difficulty_level: 3 },
          { name: 'Quality Assurance Integration', description: 'Build automated quality checks between AI processing steps to catch errors early.', difficulty_level: 4 },
          { name: 'Scalability Planning', description: 'Design AI workflows that can handle increasing volume without proportional cost increases.', difficulty_level: 4 },
        ],
      },
    ],
  },
]

// Helper: Get all unique categories
export const SKILL_CATEGORIES = [...new Set(SKILLS_TAXONOMY.map(s => s.category))]

// Helper: Get all unique archetypes in taxonomy
export const SKILL_ARCHETYPES = [...new Set(SKILLS_TAXONOMY.map(s => s.archetype))]

// Helper: Count total sub-skills
export const TOTAL_SUB_SKILLS = SKILLS_TAXONOMY.reduce((acc, s) => acc + s.sub_skills.length, 0)

// Helper: Get skills by archetype
export function getSkillsByArchetype(archetype: SkillTaxonomyEntry['archetype']) {
  return SKILLS_TAXONOMY.filter(s => s.archetype === archetype)
}
