-- Add max_sick_days column to companies table
-- This column stores the maximum number of sick days an employee can take per year
-- NULL means unlimited sick days

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS max_sick_days INTEGER DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN companies.max_sick_days IS 'Maximum sick days per employee per year. NULL means unlimited.';
