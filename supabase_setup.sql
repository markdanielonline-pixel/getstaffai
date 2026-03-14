-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    stage TEXT DEFAULT 'New' CHECK (stage IN ('New', 'Contacted', 'Qualified', 'Meeting Booked', 'Proposal Sent', 'Closed Won', 'Closed Lost')),
    source TEXT DEFAULT 'Website',
    niche TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('Lead Gen Agent', 'Appointment Setter', 'Closer Agent', 'Human')),
    content TEXT NOT NULL,
    is_ai BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for public access during MVP development
-- IMPORTANT: For a true production app with user logins, these policies must be locked down to authenticated users only.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access to leads" ON public.leads FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read access to conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access to conversations" ON public.conversations FOR INSERT WITH CHECK (true);

-- Insert Mock Data to populate the dashboard immediately
INSERT INTO public.leads (name, email, phone, stage, source) VALUES 
('Sarah Jenkins', 'sarah@example.com', '+15551234567', 'Contacted', 'Organic Search'),
('Michael Chang', 'michael@techcorp.io', '+15559876543', 'Meeting Booked', 'Inbound Call'),
('Acme Corp', 'info@acme.org', '+15556667777', 'Proposal Sent', 'Outbound SMS');

-- 3. Create Profiles Table (For Subscription Tier Routing)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscription_tier TEXT DEFAULT 'Launch' CHECK (subscription_tier IN ('Launch', 'Operator', 'Accelerator', 'Authority', 'Dominance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier)
  VALUES (new.id, new.email, 'Launch');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
