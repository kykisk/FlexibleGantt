-- Balance product type distribution
-- Target: DDR5(6), DDR6(6), LPDDR5(7), LPDDR5X(6) = 25 tasks

-- Step 1: Check current distribution
SELECT product_type, COUNT(*) as count
FROM tasks
GROUP BY product_type
ORDER BY product_type;

-- Step 2: Move 2 tasks from DDR6 to LPDDR5
-- Find DDR6 tasks with IDs to update
UPDATE tasks
SET product_type = 'LPDDR5'
WHERE id IN (
  SELECT id FROM tasks WHERE product_type = 'DDR6' LIMIT 2
);

-- Step 3: Move 2 tasks from DDR6 to DDR5
UPDATE tasks
SET product_type = 'DDR5'
WHERE id IN (
  SELECT id FROM tasks WHERE product_type = 'DDR6' LIMIT 2
);

-- Step 4: Verify new distribution
SELECT product_type, COUNT(*) as count
FROM tasks
GROUP BY product_type
ORDER BY product_type;

-- Step 5: Show detailed distribution by product and density
SELECT
  product_type,
  density,
  COUNT(*) as task_count
FROM tasks
GROUP BY product_type, density
ORDER BY product_type, density;

SELECT 'Total tasks:', COUNT(*) FROM tasks;
