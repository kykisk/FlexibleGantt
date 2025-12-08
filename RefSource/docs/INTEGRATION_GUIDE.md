# Teamcenter ActiveWorkspace 통합 가이드

## 🎯 목표

FlexibleGantt 기능을 Teamcenter ActiveWorkspace 프로젝트에 통합

---

## 📋 사전 준비

### 1. Teamcenter DB 테이블 생성

**파일**: `RefSource/docs/database_schema.sql` 참조

```sql
-- Gantt 설정 테이블
CREATE TABLE TC_GANTT_CONFIG (
  config_id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  project_id VARCHAR(50),

  summary_content TEXT,
  timeline_config TEXT,
  structure_config TEXT,
  attributes_config TEXT,
  task_shapes TEXT,

  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task 데이터 테이블
CREATE TABLE TC_GANTT_TASKS (
  task_id VARCHAR(50) PRIMARY KEY,
  config_id VARCHAR(50),

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  product_type VARCHAR(50),
  density VARCHAR(20),
  process VARCHAR(20),
  is_main_process VARCHAR(20),
  is_npi VARCHAR(10),
  organization VARCHAR(20),
  stack_method VARCHAR(20),
  number_of_stack VARCHAR(20),
  number_of_die VARCHAR(20),
  package_size DECIMAL(10,2),
  package_height DECIMAL(10,2),
  vdd1 DECIMAL(10,2),
  vdd2 DECIMAL(10,2),
  vddq DECIMAL(10,2),
  speed DECIMAL(10,2),

  FOREIGN KEY (config_id) REFERENCES TC_GANTT_CONFIG(config_id)
);
```

### 2. 폴더 구조 준비

```
your-aw-project/
├── src/
│   ├── components/
│   │   └── GanttReport/       ← RefSource/components/* 복사
│   ├── utils/
│   │   ├── tcDbService.js     ← RefSource/utils/tcDbService.js 복사 및 구현
│   │   ├── ganttUtils.js      ← RefSource/utils/ganttUtils.js 복사
│   │   └── exportUtils.js     ← RefSource/utils/exportUtils.js 복사
│   └── constants/
│       ├── attributes.js      ← RefSource/constants/attributes.js 복사
│       └── shapes.js          ← RefSource/constants/shapes.js 복사
```

---

## 🔌 Teamcenter 연동

### Step 1: tcDbService.js 구현

**위치**: `utils/tcDbService.js`

```javascript
import { callSOA } from '../tc-aw-framework' // 프로젝트의 SOA 호출 유틸

const callTeamcenterSOA = async (serviceName, operationName, inputData) => {
  // 실제 Teamcenter SOA 호출로 대체
  return await callSOA(serviceName, operationName, inputData)
}
```

**구현해야 할 함수**:
1. `loadGanttConfig(userId, projectId)` - 설정 로드
2. `saveGanttConfig(configId, configData)` - 설정 저장
3. `loadTasks(configId)` - Task 로드
4. `createTask(configId, taskData)` - Task 생성
5. `updateTask(taskId, updates)` - Task 업데이트
6. `deleteTask(taskId)` - Task 삭제

### Step 2: 컴포넌트 초기화

**파일**: `components/GanttReport/GanttReportMain.jsx`

```javascript
import { loadGanttConfig, loadTasks } from '../../utils/tcDbService'

function GanttReportMain() {
  const [config, setConfig] = useState(null)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    initializeGantt()
  }, [])

  const initializeGantt = async () => {
    try {
      // Teamcenter에서 현재 사용자/프로젝트 정보 가져오기
      const userId = getCurrentUserId()      // ← 프로젝트 함수
      const projectId = getCurrentProjectId() // ← 프로젝트 함수

      // Gantt 설정 로드
      const config = await loadGanttConfig(userId, projectId)
      setConfig(config)

      // Task 데이터 로드
      const tasks = await loadTasks(config.configId)
      setTasks(tasks)
    } catch (error) {
      console.error('Failed to initialize Gantt:', error)
    }
  }

  // ... 나머지 컴포넌트
}
```

---

## 🎨 UI 커스터마이징

### 스타일 수정

#### 1. Tailwind CSS → 내부 스타일 시스템

**현재 (Tailwind)**:
```jsx
<div className="bg-blue-600 text-white px-4 py-2 rounded">
```

**변경 후 (내부 CSS)**:
```jsx
<div className="tc-button tc-button-primary">
```

**파일**: `components/GanttReport/styles.css` 생성
```css
/* Teamcenter 내부 디자인 규정에 맞춰 작성 */
.tc-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.tc-button-primary {
  background-color: var(--tc-primary-color);
  color: white;
}
```

#### 2. 색상 변수

**파일**: `constants/uiTheme.js` 생성
```javascript
// Teamcenter 디자인 규정에 맞춰 수정
export const colors = {
  primary: '#0066CC',        // ← 내부 primary 색상
  secondary: '#F5F5F5',      // ← 내부 secondary
  border: '#CCCCCC',         // ← 내부 border
  taskBar: '#93C5FD',        // ← Task 바 색상
  // ...
}
```

#### 3. 폰트 크기

**파일**: 각 컴포넌트 내 `fontSize` 속성
```javascript
// 현재
fontSize: '8px'

// 변경 → 내부 규정에 맞춰
fontSize: 'var(--tc-font-size-small)'
```

---

## 📊 데이터 매핑

### Task 속성 → Teamcenter 속성

**현재 속성 (18개)**:
```javascript
{
  startDate, endDate,
  productType, density, process,
  isMainProcess, isNPI,
  organization, stackMethod,
  numberOfStack, numberOfDie,
  packageSize, packageHeight,
  vdd1, vdd2, vddq, speed,
  praSchedule
}
```

**Teamcenter 속성 매핑**:
```javascript
// 예시: Teamcenter Item 속성과 매핑
const mapTeamcenterToGantt = (tcItem) => {
  return {
    id: tcItem.uid,
    startDate: tcItem.start_date,
    endDate: tcItem.finish_date,
    productType: tcItem.item_type,
    density: tcItem.density_property,
    // ... 프로젝트에 맞게 매핑
  }
}
```

---

## 🔄 Export/Import 수정

### JSON Export → Teamcenter DB 저장

**기존 코드** (파일 다운로드):
```javascript
const handleExportJSON = () => {
  const blob = new Blob([JSON.stringify(data)])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = 'gantt.json'
  a.click()
}
```

**변경 후** (DB 저장):
```javascript
const handleSaveConfig = async () => {
  const configData = {
    summary: summaryContent,
    timeline: { startYear, endYear, ... },
    structure: structureRows,
    attributes: taskConfig,
    taskShapes
  }

  // Teamcenter DB에 저장
  await saveGanttConfig(configId, configData)
  alert('설정이 저장되었습니다')
}
```

### JSON Import → Teamcenter DB 로드

**기존** (파일 업로드):
```javascript
<input type="file" onChange={handleImportJSON} />
```

**변경 후** (DB 로드):
```javascript
const handleLoadConfig = async () => {
  const config = await loadGanttConfig(userId, projectId)

  setSummaryContent(config.summary)
  setStartYear(config.timeline.startYear)
  // ... 설정 복원
}
```

---

## 🧪 통합 예시

### 예시 파일 생성
**위치**: `RefSource/examples/TeamcenterIntegration.jsx`

---

## 📦 RefSource 폴더 내용

```
RefSource/
├── components/        (주석 달린 핵심 컴포넌트)
│   ├── GanttTable.jsx
│   ├── AttributesTab.jsx
│   └── StructureTab.jsx
├── utils/             (유틸리티 함수)
│   ├── tcDbService.js (Teamcenter 연동 템플릿)
│   ├── ganttUtils.js
│   └── exportUtils.js
├── constants/         (상수)
│   ├── attributes.js
│   └── shapes.js
├── docs/              (문서)
│   ├── README.md
│   └── INTEGRATION_GUIDE.md
└── examples/          (사용 예시)
    └── TeamcenterIntegration.jsx
```

---

**계속 생성 중...**
