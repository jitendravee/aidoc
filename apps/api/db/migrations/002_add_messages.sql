CREATE TABLE messages (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
