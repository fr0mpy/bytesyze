-- Push notification subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Allow anonymous users to insert subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to push" ON push_subscriptions
  FOR INSERT TO anon WITH CHECK (true);

-- Only service role can read/delete subscriptions
CREATE POLICY "Service role can manage subscriptions" ON push_subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
