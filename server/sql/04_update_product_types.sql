-- Update product types to DDR5, DDR6, LPDDR5, LPDDR5X
-- Remove HBM3 and GDDR6, Add DDR6

-- Step 1: Drop existing constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS check_product_type;

-- Step 2: Update existing data (HBM3 -> DDR6, GDDR6 -> DDR6)
UPDATE tasks SET product_type = 'DDR6' WHERE product_type = 'HBM3';
UPDATE tasks SET product_type = 'DDR6' WHERE product_type = 'GDDR6';

-- Step 3: Verify current distribution
SELECT product_type, COUNT(*) as count
FROM tasks
GROUP BY product_type
ORDER BY product_type;

-- Step 4: Add new constraint (optional, for data integrity)
-- Note: Commented out to keep flexibility, but can be enabled if needed
-- ALTER TABLE tasks ADD CONSTRAINT check_product_type
--   CHECK (product_type IN ('DDR5', 'DDR6', 'LPDDR5', 'LPDDR5X'));

-- Verification query
SELECT
  product_type,
  density,
  COUNT(*) as task_count
FROM tasks
GROUP BY product_type, density
ORDER BY product_type, density;
