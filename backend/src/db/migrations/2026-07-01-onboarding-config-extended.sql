-- Add steps, safety_tips, and footer columns to onboarding_config
ALTER TABLE onboarding_config
  ADD COLUMN IF NOT EXISTS steps TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS safety_tips TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS footer TEXT DEFAULT '';
