CREATE TABLE documents (
  id UUID PRIMARY KEY,
  original_filename TEXT,
  head_version_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  parent_version_id UUID REFERENCES versions(id),
  storage_key TEXT NOT NULL,
  page_count INT,
  diff_summary TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '6 hours'),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE messages ADD COLUMN workspace_id UUID NOT NULL;
CREATE INDEX idx_messages_workspace_id ON messages(workspace_id);