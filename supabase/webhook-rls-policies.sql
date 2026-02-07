-- Add RLS policies to allow webhook (anon role) to insert leads and messages
-- This is necessary for the n8n webhook integration to work

-- Allow anon role to insert leads (for webhook)
CREATE POLICY "Anon can insert leads via webhook"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon role to insert messages (for webhook)
CREATE POLICY "Anon can insert messages via webhook"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon role to view leads (needed for upsert logic)
CREATE POLICY "Anon can view leads"
  ON leads FOR SELECT
  TO anon
  USING (true);

-- Allow anon role to update leads (for webhook upsert)
CREATE POLICY "Anon can update leads via webhook"
  ON leads FOR UPDATE
  TO anon
  USING (true);

-- Allow anon role to insert notifications (for webhook)
CREATE POLICY "Anon can insert notifications via webhook"
  ON notifications FOR INSERT
  TO anon
  WITH CHECK (true);
