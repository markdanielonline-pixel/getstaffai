-- ==============================================================================
-- STAFF AI - DATABASE SECURITY & MULTI-TENANCY UPGRADE
-- RUN THIS ENTIRE SCRIPT IN YOUR SUPABASE SQL EDITOR
-- ==============================================================================

-- 1. UPGRADE SCHEMA: ADD MULTI-TENANT ISOLATION (user_id)
-- ------------------------------------------------------------------------------
-- Add user_id to leads and make it reference auth.users
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Default existing leads to the first user in the system (if any) so they aren't orphaned
-- (Safe to run even if auth.users is empty)
UPDATE public.leads 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1) 
WHERE user_id IS NULL;

-- Enforce NOT NULL for future leads
ALTER TABLE public.leads ALTER COLUMN user_id SET NOT NULL;


-- Add user_id to conversations and make it reference auth.users
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill conversations based on the lead's new user_id
UPDATE public.conversations c
SET user_id = l.user_id
FROM public.leads l
WHERE c.lead_id = l.id AND c.user_id IS NULL;

-- Enforce NOT NULL for future conversations
ALTER TABLE public.conversations ALTER COLUMN user_id SET NOT NULL;


-- 2. TEARDOWN: REMOVE OLD INSECURE PUBLIC ACCESS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anonymous read access to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous insert access to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous update access to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous read access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow anonymous insert access to conversations" ON public.conversations;


-- 3. LOCKDOWN: CREATE STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Ensure RLS is active
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- LEADS POLICIES
CREATE POLICY "Users can only view their own leads" 
ON public.leads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own leads" 
ON public.leads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own leads" 
ON public.leads FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own leads" 
ON public.leads FOR DELETE 
USING (auth.uid() = user_id);

-- CONVERSATIONS POLICIES
CREATE POLICY "Users can only view their own conversations" 
ON public.conversations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own conversations" 
ON public.conversations FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own conversations" 
ON public.conversations FOR DELETE 
USING (auth.uid() = user_id);

-- ==============================================================================
-- SUCCESS: YOUR DATABASE IS NOW FULLY MULTI-TENANT AND SECURE.
-- ==============================================================================
