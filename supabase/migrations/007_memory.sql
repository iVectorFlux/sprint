-- ============================================================
-- Migration 007: Memory Architecture
-- Short-term conversation + long-term semantic memory
-- ============================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Short-term: Conversation memory
CREATE TABLE IF NOT EXISTS conversation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID,
  role TEXT NOT NULL,  -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conv_memory_user ON conversation_memory(user_id);
CREATE INDEX idx_conv_memory_session ON conversation_memory(session_id);

-- Long-term: Semantic memory nodes with vector embeddings
CREATE TABLE IF NOT EXISTS memory_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL,  -- 'insight', 'pattern', 'milestone', 'reflection'
  title TEXT,
  content TEXT,
  emotional_weight FLOAT,
  importance_score FLOAT,
  confidence_score FLOAT,
  source_type TEXT,  -- 'simulation', 'reflection', 'assessment', 'conversation'
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memory_nodes_user ON memory_nodes(user_id);
CREATE INDEX idx_memory_nodes_type ON memory_nodes(memory_type);

-- Memory relationships (knowledge graph edges)
CREATE TABLE IF NOT EXISTS memory_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_memory_id UUID NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
  target_memory_id UUID NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT,  -- 'relates_to', 'contradicts', 'supports', 'caused_by'
  strength FLOAT DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- General embeddings table for any entity
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,  -- 'memory', 'report', 'simulation', 'document'
  entity_id UUID NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_embeddings_user ON embeddings(user_id);
CREATE INDEX idx_embeddings_entity ON embeddings(entity_type, entity_id);
