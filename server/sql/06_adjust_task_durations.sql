-- Adjust task durations to 2-8 months with random distribution
-- Tasks can span multiple quarters

-- Update tasks with new random durations (2-8 months)
-- Using sequential updates to ensure good distribution

-- Task 1: 2 months
UPDATE tasks SET start_date = '2022-01-15', end_date = '2022-03-15' WHERE id = 1;

-- Task 2: 6 months (spans 2 quarters)
UPDATE tasks SET start_date = '2022-02-01', end_date = '2022-08-01' WHERE id = 2;

-- Task 3: 8 months (spans 3 quarters)
UPDATE tasks SET start_date = '2022-04-01', end_date = '2022-12-01' WHERE id = 3;

-- Task 4: 3 months
UPDATE tasks SET start_date = '2022-06-15', end_date = '2022-09-15' WHERE id = 4;

-- Task 5: 5 months (spans 2 quarters)
UPDATE tasks SET start_date = '2022-08-01', end_date = '2023-01-01' WHERE id = 5;

-- Task 6: 4 months
UPDATE tasks SET start_date = '2022-10-01', end_date = '2023-02-01' WHERE id = 6;

-- Task 7: 7 months (spans 3 quarters)
UPDATE tasks SET start_date = '2022-11-15', end_date = '2023-06-15' WHERE id = 7;

-- Task 8: 2 months
UPDATE tasks SET start_date = '2023-01-01', end_date = '2023-03-01' WHERE id = 8;

-- Task 9: 6 months
UPDATE tasks SET start_date = '2023-03-15', end_date = '2023-09-15' WHERE id = 9;

-- Task 10: 4 months
UPDATE tasks SET start_date = '2023-05-01', end_date = '2023-09-01' WHERE id = 10;

-- Task 11: 8 months
UPDATE tasks SET start_date = '2023-07-01', end_date = '2024-03-01' WHERE id = 11;

-- Task 12: 3 months
UPDATE tasks SET start_date = '2023-09-15', end_date = '2023-12-15' WHERE id = 12;

-- Task 13: 5 months
UPDATE tasks SET start_date = '2023-11-01', end_date = '2024-04-01' WHERE id = 13;

-- Task 14: 7 months
UPDATE tasks SET start_date = '2024-01-15', end_date = '2024-08-15' WHERE id = 14;

-- Task 15: 2 months
UPDATE tasks SET start_date = '2024-03-01', end_date = '2024-05-01' WHERE id = 15;

-- Task 16: 6 months
UPDATE tasks SET start_date = '2024-04-15', end_date = '2024-10-15' WHERE id = 16;

-- Task 17: 4 months
UPDATE tasks SET start_date = '2024-06-01', end_date = '2024-10-01' WHERE id = 17;

-- Task 18: 8 months
UPDATE tasks SET start_date = '2024-08-01', end_date = '2025-04-01' WHERE id = 18;

-- Task 19: 3 months
UPDATE tasks SET start_date = '2024-10-15', end_date = '2025-01-15' WHERE id = 19;

-- Task 20: 5 months
UPDATE tasks SET start_date = '2024-12-01', end_date = '2025-05-01' WHERE id = 20;

-- Task 21: 7 months
UPDATE tasks SET start_date = '2025-02-01', end_date = '2025-09-01' WHERE id = 21;

-- Task 22: 2 months
UPDATE tasks SET start_date = '2025-04-15', end_date = '2025-06-15' WHERE id = 22;

-- Task 23: 6 months
UPDATE tasks SET start_date = '2025-06-01', end_date = '2025-12-01' WHERE id = 23;

-- Task 24: 4 months
UPDATE tasks SET start_date = '2025-08-15', end_date = '2025-12-15' WHERE id = 24;

-- Task 25: 8 months (extends to 2026)
UPDATE tasks SET start_date = '2025-10-01', end_date = '2026-06-01' WHERE id = 25;

-- Verify the changes
SELECT
  id,
  product_type,
  density,
  start_date,
  end_date,
  EXTRACT(MONTH FROM AGE(end_date, start_date)) as duration_months
FROM tasks
ORDER BY start_date;

-- Check distribution
SELECT
  EXTRACT(MONTH FROM AGE(end_date, start_date)) as duration_months,
  COUNT(*) as count
FROM tasks
GROUP BY duration_months
ORDER BY duration_months;
