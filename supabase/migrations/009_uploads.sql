-- ============================================================
-- Migration 009: Uploaded Documents
-- ============================================================

CREATE TABLE IF NOT EXISTS uploaded_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT,  -- 'meeting', 'email', 'recording', 'presentation', 'feedback'
  file_url TEXT NOT NULL,  -- S3 URL
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  extracted_text TEXT,
  extracted_entities JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_uploads_user ON uploaded_documents(user_id);
CREATE INDEX idx_uploads_type ON uploaded_documents(document_type);
