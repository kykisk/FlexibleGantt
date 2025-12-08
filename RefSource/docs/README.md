# FlexibleGantt - 참조 매뉴얼

## 📋 개요

이 문서는 **Teamcenter ActiveWorkspace** 환경에서 FlexibleGantt 기능을 통합하기 위한 참조 자료입니다.

---

## 🎯 개발 환경

### 기본 환경
- **프레임워크**: React (기존 ActiveWorkspace 프로젝트)
- **데이터베이스**: Teamcenter DB (PostgreSQL 대체)
- **상태 관리**: React Hooks
- **스타일링**: Tailwind CSS → 내부 디자인 규정으로 대체 가능

---

## 🏗️ 아키텍처

### 전체 구조
```
ActiveWorkspace/
├── components/
│   ├── GanttReport/          ← 새로 추가
│   │   ├── GanttChart.jsx    (메인 Gantt 컴포넌트)
│   │   ├── GanttTable.jsx    (테이블 렌더링)
│   │   ├── AttributesTab.jsx (속성 설정)
│   │   ├── StructureTab.jsx  (구조 설정)
│   │   └── Legend.jsx        (범례)
│   └── ...
├── utils/
│   ├── ganttUtils.js         (Gantt 로직)
│   ├── tcDbService.js        ← 새로 추가 (Teamcenter DB 연동)
│   └── ...
└── constants/
    ├── ganttConfig.js        (Gantt 설정)
    └── ...
```

---

## 🔌 Teamcenter DB 통합

### 1. 데이터 저장 구조

#### Gantt 설정 테이블 (TC_GANTT_CONFIG)
```sql
CREATE TABLE TC_GANTT_CONFIG (
  config_id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  project_id VARCHAR(50),
  config_name VARCHAR(100),

  -- JSON 형태로 저장
  summary_content TEXT,
  timeline_config TEXT,      -- JSON: { startYear, endYear, showQuarters... }
  structure_config TEXT,     -- JSON: [ { depths: [...] } ]
  attributes_config TEXT,    -- JSON: { ganttAttributes, shapeAttributes... }
  task_shapes TEXT,          -- JSON: { taskId: 'gantt' | 'circle'... }

  created_date TIMESTAMP,
  modified_date TIMESTAMP
)
```

#### Task 데이터 테이블 (TC_GANTT_TASKS)
```sql
CREATE TABLE TC_GANTT_TASKS (
  task_id VARCHAR(50) PRIMARY KEY,
  config_id VARCHAR(50),      -- FK to TC_GANTT_CONFIG

  -- Task 속성 (18개)
  start_date DATE,
  end_date DATE,
  product_type VARCHAR(50),
  density VARCHAR(20),
  process VARCHAR(20),
  is_main_process VARCHAR(20),
  is_npi VARCHAR(10),
  organization VARCHAR(20),
  -- ... (나머지 속성)

  FOREIGN KEY (config_id) REFERENCES TC_GANTT_CONFIG(config_id)
)
```

### 2. 서비스 레이어 구현

**파일**: `utils/tcDbService.js` (RefSource 폴더에 포함)

```javascript
/**
 * Teamcenter DB 연동 서비스
 *
 * 기존 PostgreSQL API 호출을 Teamcenter SOA 호출로 대체
 *
 * 주요 함수:
 * - loadGanttConfig(): DB에서 설정 로드
 * - saveGanttConfig(): DB에 설정 저장
 * - loadTasks(): Task 데이터 로드
 * - saveTaskShape(): 개별 Task 도형 저장
 */
```

---

## 🎨 UI 커스터마이징

### 스타일 수정 지점

#### 1. 색상 테마
**파일**: `constants/uiTheme.js`
```javascript
// Teamcenter 내부 디자인 규정에 맞춰 수정
export const colors = {
  primary: '#3B82F6',      // 파란색 → 내부 primary 색상
  secondary: '#F8FAFC',    // 회색 → 내부 secondary
  border: '#E2E8F0',       // 테두리 색상
  // ... 수정 가능
}
```

#### 2. Gantt Bar 모양
**파일**: `components/GanttTable.jsx` (라인 217)
```javascript
clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
         // ↑ 85%를 조정하여 화살표 각도 변경
```

#### 3. 텍스트 크기
**파일**: `components/GanttTable.jsx`
```javascript
fontSize: '8px'  // ← 내부 폰트 규정에 맞춰 조정
```

---

## 📊 데이터 흐름

### 초기 로드
```
1. Component Mount
   ↓
2. tcDbService.loadGanttConfig(userId, projectId)
   ↓
3. Teamcenter DB 조회
   ↓
4. JSON 파싱
   ↓
5. State 설정 (timeline, structure, attributes...)
   ↓
6. tcDbService.loadTasks(configId)
   ↓
7. Task 데이터 렌더링
```

### 설정 저장
```
1. Export JSON 버튼 클릭
   ↓
2. 현재 상태 수집 (timeline, structure, attributes...)
   ↓
3. JSON 직렬화
   ↓
4. tcDbService.saveGanttConfig(configId, jsonData)
   ↓
5. Teamcenter DB INSERT/UPDATE
```

---

## 🔧 통합 체크리스트

### Phase 1: 기본 통합
- [ ] RefSource 코드를 ActiveWorkspace 프로젝트에 복사
- [ ] Teamcenter DB 테이블 생성 (TC_GANTT_CONFIG, TC_GANTT_TASKS)
- [ ] tcDbService.js 구현 (SOA 호출)
- [ ] 기존 스타일 시스템과 통합

### Phase 2: 데이터 연동
- [ ] loadGanttConfig 구현
- [ ] saveGanttConfig 구현
- [ ] loadTasks 구현
- [ ] Task CRUD 연동

### Phase 3: UI 커스터마이징
- [ ] 색상 테마 적용
- [ ] 폰트/사이즈 조정
- [ ] 레이아웃 조정

### Phase 4: 테스트
- [ ] 설정 저장/로드 테스트
- [ ] Task 편집 테스트
- [ ] PDF Export 테스트

---

## 📞 주요 함수 참조

### 설정 로드
```javascript
// Teamcenter DB에서 Gantt 설정 로드
const config = await tcDbService.loadGanttConfig(userId, projectId)

// State에 적용
setStartYear(config.timeline.startYear)
setStructureRows(config.structure)
setTaskConfig(config.attributes)
```

### 설정 저장
```javascript
// 현재 상태 수집
const currentConfig = {
  summary: summaryContent,
  timeline: { startYear, endYear, ... },
  structure: structureRows,
  attributes: taskConfig,
  taskShapes
}

// Teamcenter DB에 저장
await tcDbService.saveGanttConfig(configId, currentConfig)
```

---

## 📚 추가 문서

RefSource 폴더 내:
1. `components/` - 주석이 상세히 달린 컴포넌트 코드
2. `utils/tcDbService.js` - Teamcenter 연동 템플릿
3. `examples/` - 사용 예시 코드
4. `docs/INTEGRATION_GUIDE.md` - 상세 통합 가이드

---

**다음 파일을 생성 중...**
