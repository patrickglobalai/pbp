/*
  # Initialize Database Schema

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - role (enum)
      - subscription_tier (enum)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - admins
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - permissions (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - coaches
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - partner_id (uuid, references users)
      - assessment_code (text)
      - tier (text)
      - ai_analysis_access (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admins
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('respondent', 'coach', 'partner', 'admin');
CREATE TYPE subscription_tier AS ENUM ('basic', 'advanced', 'partner', 'admin');

-- Create users table
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users,
    email text UNIQUE NOT NULL,
    full_name text,
    role user_role NOT NULL DEFAULT 'respondent',
    subscription_tier subscription_tier NOT NULL DEFAULT 'basic',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users NOT NULL UNIQUE,
    permissions jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create coaches table
CREATE TABLE public.coaches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users NOT NULL UNIQUE,
    partner_id uuid REFERENCES public.users,
    assessment_code text UNIQUE,
    tier text NOT NULL DEFAULT 'basic',
    ai_analysis_access boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admins have full access to users"
    ON public.users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access to admins"
    ON public.admins
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access to coaches"
    ON public.coaches
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        subscription_tier
    ) VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'respondent'),
        COALESCE((NEW.raw_user_meta_data->>'subscription_tier')::subscription_tier, 'basic')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();