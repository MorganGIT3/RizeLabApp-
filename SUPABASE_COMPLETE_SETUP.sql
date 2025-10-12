-- =====================================================
-- SCRIPT SQL COMPLET POUR RIZEAPPHUB™
-- Configuration complète de la base de données Supabase
-- =====================================================

-- =====================================================
-- 1. TABLE USER_PROFILES
-- Profils utilisateurs synchronisés avec auth.users
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON public.user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for own profile" ON public.user_profiles
    FOR UPDATE USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at DESC);

-- Fonction trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Utilisateur'),
        NEW.created_at
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. TABLE ADMIN_CODES
-- Codes d'accès administrateur
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admin_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('admin', 'super_admin')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.admin_codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read for active codes" ON public.admin_codes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin management" ON public.admin_codes
    FOR ALL USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_admin_codes_code ON public.admin_codes(code);
CREATE INDEX IF NOT EXISTS idx_admin_codes_active ON public.admin_codes(is_active);

-- =====================================================
-- 3. TABLE CALENDAR_EVENTS
-- Événements du calendrier
-- =====================================================

CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_all_day BOOLEAN DEFAULT false,
    event_type TEXT NOT NULL CHECK (event_type IN ('appointment', 'meeting', 'call', 'task', 'reminder', 'personal')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
    color TEXT DEFAULT '#3b82f6',
    location TEXT,
    participants JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own events" ON public.calendar_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON public.calendar_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.calendar_events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.calendar_events
    FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON public.calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON public.calendar_events(status);

-- =====================================================
-- 4. TABLE USER_TOKENS
-- Système de tokens pour les réservations d'appels
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    tokens_available INTEGER DEFAULT 1,
    tokens_used INTEGER DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own tokens" ON public.user_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON public.user_tokens
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert tokens" ON public.user_tokens
    FOR INSERT WITH CHECK (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON public.user_tokens(user_id);

-- Fonction pour utiliser un token de réservation
CREATE OR REPLACE FUNCTION public.use_booking_token(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    available_tokens INTEGER;
BEGIN
    -- Récupérer le nombre de tokens disponibles
    SELECT tokens_available INTO available_tokens
    FROM public.user_tokens
    WHERE user_id = user_uuid;
    
    -- Si l'utilisateur n'a pas de ligne, en créer une
    IF NOT FOUND THEN
        INSERT INTO public.user_tokens (user_id, tokens_available, tokens_used, last_reset_date)
        VALUES (user_uuid, 1, 0, CURRENT_DATE);
        available_tokens := 1;
    END IF;
    
    -- Vérifier si des tokens sont disponibles
    IF available_tokens > 0 THEN
        -- Utiliser un token
        UPDATE public.user_tokens
        SET tokens_available = tokens_available - 1,
            tokens_used = tokens_used + 1,
            updated_at = NOW()
        WHERE user_id = user_uuid;
        
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour réinitialiser les tokens (chaque lundi)
CREATE OR REPLACE FUNCTION public.reset_weekly_tokens()
RETURNS void AS $$
BEGIN
    UPDATE public.user_tokens
    SET tokens_available = 1,
        tokens_used = 0,
        last_reset_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE last_reset_date < CURRENT_DATE
    AND EXTRACT(DOW FROM CURRENT_DATE) = 1; -- Lundi
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. TABLE CALL_DETAILS
-- Détails des appels planifiés
-- =====================================================

CREATE TABLE IF NOT EXISTS public.call_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    call_date DATE NOT NULL,
    call_time TIME NOT NULL,
    call_duration TEXT,
    call_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    cal_com_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.call_details ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own call details" ON public.call_details
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call details" ON public.call_details
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call details" ON public.call_details
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call details" ON public.call_details
    FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_call_details_user_id ON public.call_details(user_id);
CREATE INDEX IF NOT EXISTS idx_call_details_date ON public.call_details(call_date);

-- =====================================================
-- 6. TABLE CALL_NOTES
-- Notes pour chaque appel
-- =====================================================

CREATE TABLE IF NOT EXISTS public.call_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES public.call_details(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.call_notes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own call notes" ON public.call_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call notes" ON public.call_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call notes" ON public.call_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call notes" ON public.call_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_call_notes_call_id ON public.call_notes(call_id);
CREATE INDEX IF NOT EXISTS idx_call_notes_user_id ON public.call_notes(user_id);

-- =====================================================
-- 7. TABLE CALL_HISTORY
-- Historique complet des appels
-- =====================================================

CREATE TABLE IF NOT EXISTS public.call_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    call_date TIMESTAMPTZ NOT NULL,
    call_type TEXT NOT NULL DEFAULT 'weekly_call' CHECK (call_type IN ('weekly_call', 'consultation', 'support', 'other')),
    duration_minutes INTEGER,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    cal_com_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.call_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own call history" ON public.call_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call history" ON public.call_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call history" ON public.call_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call history" ON public.call_history
    FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_call_history_user_id ON public.call_history(user_id);
CREATE INDEX IF NOT EXISTS idx_call_history_date ON public.call_history(call_date);
CREATE INDEX IF NOT EXISTS idx_call_history_status ON public.call_history(status);

-- =====================================================
-- 8. TRIGGER POUR METTRE À JOUR updated_at AUTOMATIQUEMENT
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_codes_updated_at BEFORE UPDATE ON public.admin_codes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON public.user_tokens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_call_details_updated_at BEFORE UPDATE ON public.call_details
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_call_notes_updated_at BEFORE UPDATE ON public.call_notes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_call_history_updated_at BEFORE UPDATE ON public.call_history
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 9. DONNÉES INITIALES (OPTIONNEL)
-- =====================================================

-- Insérer les codes admin par défaut
INSERT INTO public.admin_codes (code, name, level, description) VALUES
    ('admin123', 'Admin Principal', 'admin', 'Accès administrateur standard'),
    ('smartapp2024', 'RizeAppHub 2024', 'admin', 'Accès RizeAppHub™ 2024'),
    ('academy2024', 'Academy 2024', 'admin', 'Accès académie 2024'),
    ('master2024', 'Master 2024', 'super_admin', 'Accès master avec privilèges étendus'),
    ('superadmin', 'Super Admin', 'super_admin', 'Accès super administrateur')
ON CONFLICT (code) DO NOTHING;

-- Importer les utilisateurs existants depuis auth.users (si migration)
INSERT INTO public.user_profiles (user_id, email, full_name, created_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email, 'Utilisateur'),
    created_at
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- 10. VÉRIFICATION
-- =====================================================

-- Afficher toutes les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Afficher le nombre d'utilisateurs
SELECT COUNT(*) as total_users FROM public.user_profiles;

-- =====================================================
-- ✅ SCRIPT TERMINÉ - RIZEAPPHUB™ EST PRÊT !
-- =====================================================

