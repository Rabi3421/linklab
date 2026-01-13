-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    dns_configured BOOLEAN DEFAULT FALSE,
    ssl_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100), 
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shortened URLs table
CREATE TABLE IF NOT EXISTS urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    original_url TEXT NOT NULL,
    short_code VARCHAR(20) NOT NULL UNIQUE,
    custom_alias VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    favicon_url TEXT,
    qr_code_url TEXT,
    password VARCHAR(255),
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    click_limit INTEGER,
    geo_targeting JSONB,
    device_targeting JSONB,
    utm_parameters JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_alias UNIQUE(user_id, custom_alias)
);

-- Create URL analytics/clicks table
CREATE TABLE IF NOT EXISTS url_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url_id UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    country VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    os_version VARCHAR(50),
    is_bot BOOLEAN DEFAULT FALSE,
    is_unique BOOLEAN DEFAULT TRUE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_tag UNIQUE(user_id, name)
);

-- Create URL tags junction table
CREATE TABLE IF NOT EXISTS url_tags (
    url_id UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (url_id, tag_id)
);

-- Create user profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    timezone VARCHAR(100) DEFAULT 'UTC',
    default_domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    click_tracking BOOLEAN DEFAULT TRUE,
    analytics_retention_days INTEGER DEFAULT 365,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_url_clicks_url_id ON url_clicks(url_id);
CREATE INDEX IF NOT EXISTS idx_url_clicks_clicked_at ON url_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_url_clicks_country ON url_clicks(country);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON domains(user_id);

-- Function to generate short codes
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS VARCHAR(20) AS $$
DECLARE
    chars VARCHAR(62) := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(20) := '';
    i INTEGER := 0;
    code_length INTEGER := 6;
BEGIN
    -- Generate random short code
    FOR i IN 1..code_length LOOP
        result := result || substr(chars, (floor(random() * 62) + 1)::integer, 1);
    END LOOP;
    
    -- Check if code already exists, if so generate a new one
    WHILE EXISTS (SELECT 1 FROM urls WHERE short_code = result) LOOP
        result := '';
        FOR i IN 1..code_length LOOP
            result := result || substr(chars, (floor(random() * 62) + 1)::integer, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own domains" ON domains FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own domains" ON domains FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own domains" ON domains FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own domains" ON domains FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own URLs" ON urls FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own URLs" ON urls FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own URLs" ON urls FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own URLs" ON urls FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view clicks for own URLs" ON url_clicks FOR SELECT USING (
    EXISTS (SELECT 1 FROM urls WHERE urls.id = url_clicks.url_id AND urls.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert clicks" ON url_clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own tags" ON tags FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own tags" ON tags FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own tags" ON tags FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own tags" ON tags FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can manage own URL tags" ON url_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM urls WHERE urls.id = url_tags.url_id AND urls.user_id = auth.uid())
);

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (id = auth.uid());

-- Insert default user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();