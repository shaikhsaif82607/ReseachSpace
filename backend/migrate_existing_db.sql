USE reseachspace;

-- Run this ONLY if your existing papers table does not have the abstract column.
ALTER TABLE papers ADD COLUMN abstract TEXT NOT NULL AFTER title;
