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

-- Create admins table with unique constraint on user_id
CREATE TABLE public.admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users NOT NULL UNIQUE,
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
    -- Insert into public.users
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

    -- Insert into user_agreements
    INSERT INTO public.user_agreements (
        user_id
    ) VALUES (
        NEW.id
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
  user_exists boolean;
BEGIN
  -- First check if the user exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'naderdahdal8008@gmail.com'
  ) INTO user_exists;

  -- If user doesn't exist, create everything
  IF NOT user_exists THEN
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

    -- Manually create user record since trigger might not fire immediately
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      subscription_tier
    ) VALUES (
      admin_user_id,
      'naderdahdal8008@gmail.com',
      'System Administrator',
      'admin',
      'admin'
    );

    -- Create user agreements
    INSERT INTO public.user_agreements (
      user_id
    ) VALUES (
      admin_user_id
    );

    -- Create admin record
    INSERT INTO public.admins (
      user_id,
      permissions
    ) VALUES (
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

    RAISE NOTICE 'Created new admin user with email: naderdahdal8008@gmail.com';
  ELSE
    -- Get existing user ID
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'naderdahdal8008@gmail.com';

    -- Ensure user record exists with admin role
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      subscription_tier
    ) VALUES (
      admin_user_id,
      'naderdahdal8008@gmail.com',
      'System Administrator',
      'admin',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      subscription_tier = 'admin',
      updated_at = now();

    -- Ensure admin record exists
    INSERT INTO public.admins (
      user_id,
      permissions
    ) VALUES (
      admin_user_id,
      jsonb_build_object(
        'manage_users', true,
        'manage_coaches', true,
        'manage_partners', true,
        'manage_assessment_codes', true,
        'view_analytics', true,
        'manage_system', true
      )
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Updated existing admin user with ID: %', admin_user_id;
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;