-- Create tasks table with all 18 attributes
-- Based on SPEC_FEATURE.md section 6.3

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,

  -- 날짜 속성
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pra_schedule DATE,

  -- 텍스트 속성
  product_type VARCHAR(50) NOT NULL,
  density VARCHAR(20) NOT NULL,
  process VARCHAR(20) NOT NULL,
  is_main_process VARCHAR(20) NOT NULL,
  is_npi VARCHAR(10) NOT NULL,
  organization VARCHAR(20) NOT NULL,
  stack_method VARCHAR(20) NOT NULL DEFAULT 'TSV',
  number_of_stack VARCHAR(20) NOT NULL,
  number_of_die VARCHAR(20) NOT NULL,

  -- 수치 속성
  package_size DECIMAL(10,2),
  package_height DECIMAL(10,2),
  vdd1 DECIMAL(10,2),
  vdd2 DECIMAL(10,2),
  vddq DECIMAL(10,2),
  speed DECIMAL(10,2),

  -- 메타 정보
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 제약 조건
  CONSTRAINT check_dates CHECK (end_date >= start_date),
  CONSTRAINT check_density CHECK (density IN ('16Gb', '32Gb', '12Gb', '8Gb', '4Gb')),
  CONSTRAINT check_process CHECK (process IN ('D1', 'D2', 'D3')),
  CONSTRAINT check_main_process CHECK (is_main_process IN ('모제품', '자제품')),
  CONSTRAINT check_npi CHECK (is_npi IN ('Yes', 'No')),
  CONSTRAINT check_organization CHECK (organization IN ('x4', 'x8', 'x16')),
  CONSTRAINT check_number_of_stack CHECK (number_of_stack IN ('4H', '8H')),
  CONSTRAINT check_number_of_die CHECK (number_of_die IN ('SDP', '16DP'))
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_tasks_product_type ON tasks(product_type);
CREATE INDEX idx_tasks_density ON tasks(density);
CREATE INDEX idx_tasks_start_date ON tasks(start_date);
CREATE INDEX idx_tasks_end_date ON tasks(end_date);
CREATE INDEX idx_tasks_process ON tasks(process);

-- 코멘트 추가
COMMENT ON TABLE tasks IS 'Gantt Task 데이터 - 18개 속성 포함';
COMMENT ON COLUMN tasks.product_type IS '제품 Type (LPDDR5, LPDDR5X, DDR5, HBM3, GDDR6)';
COMMENT ON COLUMN tasks.density IS 'Density (16Gb, 32Gb, 12Gb, 8Gb, 4Gb)';
COMMENT ON COLUMN tasks.process IS '공정명 (D1, D2, D3)';
