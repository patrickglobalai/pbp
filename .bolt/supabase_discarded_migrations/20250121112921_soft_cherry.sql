/*
  # Admin Authentication Setup

  1. New Tables
    - `admin_permissions` - Stores admin-specific permissions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on admin_permissions table
    - Add policies for admin access
    - Create admin user creation function
*/

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_admin_user UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can read all permissions"
    ON public.admin_permissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage permissions"
    ON public.admin_permissions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email text,
    admin_password text,
    admin_full_name text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Create auth user
    new_user_id := auth.uid();
    
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data
    ) VALUES (
        new_user_id,
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        now(),
        jsonb_build_object(
            'full_name', admin_full_name,
            'role', 'admin'
        )
    );

    -- Insert admin permissions
    INSERT INTO public.admin_permissions (
        user_id,
        permissions
    ) VALUES (
        new_user_id,
        jsonb_build_object(
            'manage_users', true,
            'manage_coaches', true,
            'manage_assessment_codes', true,
            'view_analytics', true
        )
    );

    RETURN new_user_id;
END;
$$;