-- VedaShield AI - Supabase Production Schema with Row Level Security (RLS)

-- 1. Profiles Table (Family members)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL CHECK (relationship IN ('Self', 'Spouse', 'Parent', 'Child', 'Grandparent', 'Other')),
    dob DATE,
    blood_group TEXT,
    allergies TEXT,
    chronic_conditions TEXT,
    notes TEXT,
    avatar_color TEXT DEFAULT '#059669',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own family profiles"
    ON public.profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Medical Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    lab_name TEXT,
    type TEXT NOT NULL DEFAULT 'lab' CHECK (type IN ('lab', 'prescription', 'imaging', 'other')),
    rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    extracted_text TEXT,
    doctor_notes TEXT,
    ai_summary_en TEXT,
    ai_summary_hi TEXT,
    prescribed_medicines JSONB DEFAULT '[]'::jsonb,
    file_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage reports belonging to their profiles"
    ON public.reports
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Storage Bucket for Medical Documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-records', 'medical-records', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload records"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'medical-records' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own medical documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'medical-records' AND auth.uid() = owner);
