/*
  # Add Retake Feature Schema

  1. Changes
    - Add retake-related fields to results table
    - Add retake tracking fields to respondents table
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add retake fields to results table
ALTER TABLE IF EXISTS public.results
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS original_result_id uuid REFERENCES public.results(id),
ADD COLUMN IF NOT EXISTS retaken_at timestamptz;

-- Add retake tracking fields to respondents table
ALTER TABLE IF EXISTS public.respondents
ADD COLUMN IF NOT EXISTS retake_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS retake_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_assessment_date timestamptz,
ADD COLUMN IF NOT EXISTS total_assessments integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS next_retake_date timestamptz;