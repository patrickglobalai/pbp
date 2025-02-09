-- Create test coach with proper cleanup and error handling
DO $$ 
DECLARE
  test_user_id uuid;
BEGIN
  -- First clean up any existing test data
  DELETE FROM public.coaches WHERE assessment_code = 'TEST123';
  DELETE FROM public.users WHERE email = 'test.coach@example.com';
  DELETE FROM auth.users WHERE email = 'test.coach@example.com';

  -- Wait a moment to ensure cleanup is complete
  PERFORM pg_sleep(1);

  -- Generate new UUID for test user
  test_user_id := gen_random_uuid();

  -- Insert test user for coach
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
    role
  ) VALUES (
    test_user_id,
    '00000000-0000-0000-0000-000000000000',
    'test.coach@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF',  -- This is a dummy hash
    now(),
    jsonb_build_object(
      'full_name', 'Test Coach',
      'email', 'test.coach@example.com'
    ),
    now(),
    now(),
    now(),
    'authenticated'
  );

  -- Insert user profile directly (let the trigger handle it)
  -- The trigger will create the user record automatically
  
  -- Insert coach record
  INSERT INTO public.coaches (
    id,
    user_id,
    assessment_code,
    tier,
    ai_analysis_access
  ) VALUES (
    gen_random_uuid(),
    test_user_id,
    'TEST123',
    'basic',
    true
  );

  -- Log success
  RAISE NOTICE 'Successfully created test coach with ID: %', test_user_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details
    RAISE NOTICE 'Error creating test coach: %', SQLERRM;
    -- Re-raise the exception
    RAISE;
END $$;