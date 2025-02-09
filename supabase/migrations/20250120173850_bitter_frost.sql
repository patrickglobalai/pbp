-- First drop any existing tables and types to start fresh
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.user_agreements CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create enum types
CREATE TYPE user_role AS ENUM ('respondent', 'coach', 'partner', 'admin');
CREATE TYPE subscription_tier AS ENUM ('basic', 'advanced', 'partner', 'admin');

-- Create users table
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users,
    full_name text,
    email text UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'respondent',
    subscription_tier subscription_tier NOT NULL DEFAULT 'basic',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create user agreements table
CREATE TABLE public.user_agreements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    privacy_accepted boolean DEFAULT false,
    terms_accepted boolean DEFAULT false,
    disclaimer_accepted boolean DEFAULT false,
    privacy_accepted_at timestamptz,
    terms_accepted_at timestamptz,
    disclaimer_accepted_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users NOT NULL,
    permissions jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create basic policies
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

CREATE POLICY "Admins have full access"
    ON public.users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
            AND u.subscription_tier = 'admin'
        )
    );

CREATE POLICY "Users can read own agreements"
    ON public.user_agreements
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all data"
    ON public.admins
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
            AND u.subscription_tier = 'admin'
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

-- Create initial admin user
DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'naderdahdal8008@gmail.com';

  -- If admin user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    admin_user_id := gen_random_uuid();
    
    -- Create auth user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at,
      role,
      aud
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'naderdahdal8008@gmail.com',
      crypt('Admin123!', gen_salt('bf')),
      now(),
      jsonb_build_object(
        'full_name', 'System Administrator',
        'role', 'admin',
        'subscription_tier', 'admin'
      ),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    -- Create admin record
    INSERT INTO public.admins (
      id,
      user_id,
      permissions
    ) VALUES (
      gen_random_uuid(),
      admin_user_id,
      jsonb_build_object(
        'manage_users', true,
        'manage_coaches', true,
        'manage_partners', true,
        'manage_assessment_codes', true,
        'view_analytics', true,
        'manage_system', true
      )
    );

    RAISE NOTICE 'Created admin user with email: naderdahdal8008@gmail.com and password: Admin123!';
  ELSE
    RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
  END IF;
END $$;