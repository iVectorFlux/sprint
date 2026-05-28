-- ============================================================
-- Migration 011: Seed Skills Taxonomy
-- 14 skills with ~88 sub-skills from PRD
-- ============================================================

-- Emotional Intelligence
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Emotional Intelligence', 'Human Skills', 'Understand and manage your own emotions, empathize with others, and navigate social complexity with self-awareness and resilience.', 'reflective_ai_mirror', '🧠');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Emotional Intelligence'), 'Self Awareness', 'Recognize your own emotional patterns, triggers, and blind spots.', 2),
((SELECT id FROM skills WHERE name = 'Emotional Intelligence'), 'Self Regulation', 'Manage impulses, stay composed under pressure, and adapt responses.', 3),
((SELECT id FROM skills WHERE name = 'Emotional Intelligence'), 'Empathy', 'Perceive and understand others'' emotions and perspectives.', 2),
((SELECT id FROM skills WHERE name = 'Emotional Intelligence'), 'Social Skills', 'Build rapport, manage relationships, and influence positively.', 3),
((SELECT id FROM skills WHERE name = 'Emotional Intelligence'), 'Motivation', 'Maintain drive, optimism, and commitment to goals.', 2),
((SELECT id FROM skills WHERE name = 'Emotional Intelligence'), 'Resilience', 'Recover from setbacks, adapt to adversity, and sustain performance.', 4);

-- AI Literacy
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('AI Literacy', 'Technical Skills', 'Understand, evaluate, and effectively collaborate with AI systems in professional settings.', 'structured_reasoning', '🤖');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'AI Literacy'), 'Prompt Crafting', 'Write clear, effective prompts that produce high-quality AI outputs.', 1),
((SELECT id FROM skills WHERE name = 'AI Literacy'), 'Output Evaluation', 'Critically assess AI-generated content for accuracy and bias.', 2),
((SELECT id FROM skills WHERE name = 'AI Literacy'), 'AI Ethics Awareness', 'Understand ethical implications of AI usage in work contexts.', 2),
((SELECT id FROM skills WHERE name = 'AI Literacy'), 'Tool Fluency', 'Navigate and leverage various AI tools effectively.', 1),
((SELECT id FROM skills WHERE name = 'AI Literacy'), 'Human-AI Collaboration', 'Design workflows that optimally combine human and AI capabilities.', 3),
((SELECT id FROM skills WHERE name = 'AI Literacy'), 'AI Workflow Design', 'Architect multi-step AI processes for complex business tasks.', 4);

-- Critical Thinking
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Critical Thinking', 'Cognitive Skills', 'Analyze arguments, detect biases, evaluate evidence, and reason logically to form well-founded judgments.', 'structured_reasoning', '🔍');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Critical Thinking'), 'Bias Detection', 'Identify cognitive and systemic biases in arguments and data.', 3),
((SELECT id FROM skills WHERE name = 'Critical Thinking'), 'First Principles Thinking', 'Break problems down to fundamental truths and reason upward.', 4),
((SELECT id FROM skills WHERE name = 'Critical Thinking'), 'Argument Analysis', 'Evaluate the structure and validity of arguments.', 2),
((SELECT id FROM skills WHERE name = 'Critical Thinking'), 'Evidence Evaluation', 'Assess the quality, relevance, and reliability of evidence.', 3),
((SELECT id FROM skills WHERE name = 'Critical Thinking'), 'Logical Reasoning', 'Apply deductive and inductive reasoning to reach conclusions.', 2),
((SELECT id FROM skills WHERE name = 'Critical Thinking'), 'Probabilistic Thinking', 'Reason about uncertainty and make decisions with incomplete information.', 4);

-- Problem Solving
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Problem Solving', 'Cognitive Skills', 'Diagnose root causes, generate creative solutions, prioritize effectively, and iterate through complex challenges.', 'consequence_simulation', '🧩');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Problem Solving'), 'Root Cause Analysis', 'Identify the underlying cause of problems, not just symptoms.', 2),
((SELECT id FROM skills WHERE name = 'Problem Solving'), 'Ideation', 'Generate diverse and creative solution options.', 2),
((SELECT id FROM skills WHERE name = 'Problem Solving'), 'Decision Frameworks', 'Apply structured approaches to making decisions.', 3),
((SELECT id FROM skills WHERE name = 'Problem Solving'), 'Iteration & Testing', 'Build, test, and refine solutions rapidly.', 3),
((SELECT id FROM skills WHERE name = 'Problem Solving'), 'Prioritization', 'Rank tasks and solutions by impact and feasibility.', 2),
((SELECT id FROM skills WHERE name = 'Problem Solving'), 'Constraint Navigation', 'Find solutions within tight resource, time, or rule constraints.', 4);

-- Adaptability
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Adaptability', 'Human Skills', 'Navigate ambiguity, embrace change, pivot quickly, and maintain performance under shifting conditions.', 'recovery_conditioning', '🌊');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Adaptability'), 'Cognitive Flexibility', 'Shift thinking between different concepts and perspectives.', 3),
((SELECT id FROM skills WHERE name = 'Adaptability'), 'Ambiguity Tolerance', 'Perform effectively when information is incomplete or unclear.', 3),
((SELECT id FROM skills WHERE name = 'Adaptability'), 'Learning Agility', 'Rapidly acquire new skills and apply them in novel situations.', 2),
((SELECT id FROM skills WHERE name = 'Adaptability'), 'Pivot Speed', 'Quickly change direction when circumstances change.', 3),
((SELECT id FROM skills WHERE name = 'Adaptability'), 'Change Navigation', 'Lead self and others through organizational change.', 4),
((SELECT id FROM skills WHERE name = 'Adaptability'), 'Stress Adaptation', 'Maintain cognitive performance under high-stress conditions.', 4);

-- Creative Thinking
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Creative Thinking', 'Cognitive Skills', 'Generate novel ideas, reframe problems, synthesize diverse inputs, and think laterally to find innovative solutions.', 'cognitive_conflict', '💡');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Creative Thinking'), 'Lateral Thinking', 'Approach problems from unexpected angles and perspectives.', 3),
((SELECT id FROM skills WHERE name = 'Creative Thinking'), 'Reframing', 'Transform how a problem is perceived to unlock new solutions.', 3),
((SELECT id FROM skills WHERE name = 'Creative Thinking'), 'Synthesis', 'Combine disparate ideas into coherent new concepts.', 4),
((SELECT id FROM skills WHERE name = 'Creative Thinking'), 'Generative Brainstorming', 'Produce high volumes of ideas without self-censoring.', 2),
((SELECT id FROM skills WHERE name = 'Creative Thinking'), 'Conceptual Blending', 'Merge ideas from different domains to create innovation.', 4),
((SELECT id FROM skills WHERE name = 'Creative Thinking'), 'Creative Constraints', 'Use limitations as a catalyst for creative breakthroughs.', 3);

-- Systems Thinking
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Systems Thinking', 'Strategic Skills', 'See the big picture, understand feedback loops, map dependencies, and identify leverage points in complex systems.', 'constraint_architecture', '🔗');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Systems Thinking'), 'Feedback Loops', 'Identify and understand reinforcing and balancing feedback.', 3),
((SELECT id FROM skills WHERE name = 'Systems Thinking'), 'Second-Order Effects', 'Anticipate indirect consequences of actions and decisions.', 4),
((SELECT id FROM skills WHERE name = 'Systems Thinking'), 'Dependency Mapping', 'Chart relationships and dependencies between system components.', 3),
((SELECT id FROM skills WHERE name = 'Systems Thinking'), 'Pattern Recognition', 'Detect recurring structures and behaviors across systems.', 3),
((SELECT id FROM skills WHERE name = 'Systems Thinking'), 'Leverage Point Identification', 'Find high-impact intervention points in complex systems.', 5),
((SELECT id FROM skills WHERE name = 'Systems Thinking'), 'Systems Modeling', 'Build mental and visual models of system dynamics.', 4);

-- Communication
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Communication', 'Human Skills', 'Articulate ideas clearly, listen actively, adapt to audiences, and facilitate productive dialogues across contexts.', 'simulation_based', '💬');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Communication'), 'Storytelling', 'Craft compelling narratives that engage and persuade.', 3),
((SELECT id FROM skills WHERE name = 'Communication'), 'Active Listening', 'Fully concentrate, understand, and respond thoughtfully.', 2),
((SELECT id FROM skills WHERE name = 'Communication'), 'Executive Communication', 'Deliver concise, high-impact messages to leadership.', 4),
((SELECT id FROM skills WHERE name = 'Communication'), 'Audience Adaptation', 'Tailor communication style and content to different groups.', 3),
((SELECT id FROM skills WHERE name = 'Communication'), 'Cross-Functional Communication', 'Bridge gaps between departments with different vocabularies.', 3),
((SELECT id FROM skills WHERE name = 'Communication'), 'Digital Communication', 'Communicate effectively through written and digital channels.', 2),
((SELECT id FROM skills WHERE name = 'Communication'), 'Feedback Delivery', 'Give constructive feedback that drives improvement.', 3),
((SELECT id FROM skills WHERE name = 'Communication'), 'Facilitation', 'Guide group discussions toward productive outcomes.', 4);

-- Influence & Negotiation
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Influence & Negotiation', 'Leadership Skills', 'Persuade ethically, navigate conflicts, align stakeholders, and reach agreements that create mutual value.', 'simulation_based', '🤝');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Framing', 'Present information in ways that shape perception and decisions.', 3),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Ethical Persuasion', 'Influence others through honest, principled arguments.', 3),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Negotiation', 'Reach mutually beneficial agreements through structured dialogue.', 4),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Conflict Resolution', 'Mediate disputes and find common ground between parties.', 4),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Stakeholder Alignment', 'Build consensus across diverse stakeholder groups.', 4),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Trust Building', 'Establish and maintain trust through consistent, reliable behavior.', 3),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Objection Handling', 'Address resistance and objections with structured responses.', 3),
((SELECT id FROM skills WHERE name = 'Influence & Negotiation'), 'Consensus Building', 'Guide groups to shared agreement through facilitated dialogue.', 4);

-- Strategic Sales
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Strategic Sales', 'Business Skills', 'Master buyer psychology, frame value propositions, map stakeholders, and navigate complex sales cycles.', 'simulation_based', '📊');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Strategic Sales'), 'Discovery & Qualification', 'Uncover buyer needs and assess opportunity fit.', 2),
((SELECT id FROM skills WHERE name = 'Strategic Sales'), 'Buyer Psychology', 'Understand cognitive patterns that drive purchasing decisions.', 3),
((SELECT id FROM skills WHERE name = 'Strategic Sales'), 'Value Framing', 'Articulate business value in terms that resonate with buyers.', 3),
((SELECT id FROM skills WHERE name = 'Strategic Sales'), 'Stakeholder Mapping', 'Identify and engage all decision-makers in complex deals.', 4),
((SELECT id FROM skills WHERE name = 'Strategic Sales'), 'Objection Handling', 'Systematically address and overcome buyer objections.', 3),
((SELECT id FROM skills WHERE name = 'Strategic Sales'), 'Negotiation Fundamentals', 'Close deals that create value for both sides.', 3);

-- Leadership Essentials
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Leadership Essentials', 'Leadership Skills', 'Make decisions under uncertainty, delegate effectively, align teams, and build cultures of accountability.', 'consequence_simulation', '👑');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Leadership Essentials'), 'Decision-Making Under Uncertainty', 'Make sound decisions when information is incomplete.', 5),
((SELECT id FROM skills WHERE name = 'Leadership Essentials'), 'Delegation', 'Assign work effectively while maintaining accountability.', 3),
((SELECT id FROM skills WHERE name = 'Leadership Essentials'), 'Team Alignment', 'Create shared vision and coordinate toward common goals.', 4),
((SELECT id FROM skills WHERE name = 'Leadership Essentials'), 'Accountability', 'Hold self and others responsible for commitments and outcomes.', 3),
((SELECT id FROM skills WHERE name = 'Leadership Essentials'), 'Coaching & Feedback', 'Develop others through guided practice and honest feedback.', 4),
((SELECT id FROM skills WHERE name = 'Leadership Essentials'), 'Resource Allocation', 'Distribute limited resources for maximum impact.', 4);

-- Metacognition
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Metacognition', 'Cognitive Skills', 'Think about your own thinking — calibrate confidence, manage attention, select mental models, and optimize learning.', 'reflective_ai_mirror', '🪞');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Metacognition'), 'Cognitive Bias Awareness', 'Recognize when your own thinking is being distorted by biases.', 3),
((SELECT id FROM skills WHERE name = 'Metacognition'), 'Confidence Calibration', 'Accurately assess how much you actually know.', 4),
((SELECT id FROM skills WHERE name = 'Metacognition'), 'Self Reflection', 'Systematically review your own performance and growth.', 2),
((SELECT id FROM skills WHERE name = 'Metacognition'), 'Attention Management', 'Direct and sustain focus on high-priority cognitive tasks.', 3),
((SELECT id FROM skills WHERE name = 'Metacognition'), 'Mental Model Selection', 'Choose the right framework for the problem at hand.', 4),
((SELECT id FROM skills WHERE name = 'Metacognition'), 'Learning Optimization', 'Identify the most efficient strategies for skill acquisition.', 3);

-- Judgment
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('Judgment', 'Strategic Skills', 'Distinguish signal from noise, assess risks, analyze trade-offs, and make ethically sound decisions.', 'consequence_simulation', '⚖️');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'Judgment'), 'Signal vs Noise Detection', 'Distinguish meaningful information from distractions.', 4),
((SELECT id FROM skills WHERE name = 'Judgment'), 'Risk Assessment', 'Evaluate probability and impact of potential outcomes.', 3),
((SELECT id FROM skills WHERE name = 'Judgment'), 'Trade-off Analysis', 'Compare options when each involves giving something up.', 3),
((SELECT id FROM skills WHERE name = 'Judgment'), 'Ethical Judgment', 'Make decisions that balance effectiveness with moral principles.', 4),
((SELECT id FROM skills WHERE name = 'Judgment'), 'Long-term Thinking', 'Consider extended consequences and future implications.', 4),
((SELECT id FROM skills WHERE name = 'Judgment'), 'Decision Quality Evaluation', 'Assess the quality of past decisions to improve future ones.', 3);

-- System Design
INSERT INTO skills (name, category, description, learning_engine_type, icon) VALUES
('System Design', 'Technical Skills', 'Architect scalable systems, manage dependencies, handle failures gracefully, and optimize for performance.', 'constraint_architecture', '🏗️');
INSERT INTO sub_skills (skill_id, name, description, difficulty_level) VALUES
((SELECT id FROM skills WHERE name = 'System Design'), 'Scalability Thinking', 'Design systems that handle growth in users, data, and complexity.', 4),
((SELECT id FROM skills WHERE name = 'System Design'), 'Architecture Planning', 'Create high-level blueprints for complex technical systems.', 4),
((SELECT id FROM skills WHERE name = 'System Design'), 'Trade-off Analysis', 'Navigate competing concerns in system design decisions.', 3),
((SELECT id FROM skills WHERE name = 'System Design'), 'Dependency Management', 'Handle inter-system relationships and versioning.', 3),
((SELECT id FROM skills WHERE name = 'System Design'), 'Failure Handling', 'Design for graceful degradation and fault tolerance.', 5),
((SELECT id FROM skills WHERE name = 'System Design'), 'Performance Optimization', 'Identify and resolve performance bottlenecks.', 4);
