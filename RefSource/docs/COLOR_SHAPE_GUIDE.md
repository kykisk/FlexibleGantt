# 개별 색상 및 도형 설정 가이드

## 🎨 개별 Task 설정

각 Task마다 독립적으로 도형과 색상을 설정할 수 있습니다.

---

## 📐 개별 도형 설정

### State 구조
```javascript
const [taskShapes, setTaskShapes] = useState({})
// { taskId: 'gantt' | 'circle' | 'rectangle' }

const [taskColors, setTaskColors] = useState({})
// { taskId: '#93C5FD' | '#000000' | ... }

// 예시:
taskShapes = {
  '1': 'circle',
  '5': 'rectangle',
  '10': 'gantt'
}

taskColors = {
  '1': '#EF4444',  // 빨간색
  '5': '#22C55E',  // 녹색
  '10': '#3B82F6'  // 파란색
}
```

### 설정 방법
1. Gantt Task 바 **우클릭**
2. "도형 변경 ›" hover
3. 서브메뉴에서 선택:
   - ▶ Gantt Bar
   - ● Circle
   - ■ Rectangle

### 가져오기
```javascript
const getTaskShape = (taskId) => {
  return taskShapes[taskId] || taskConfig.shape  // 개별 설정 또는 기본값
}
```

---

## 🎨 개별 색상 설정

### State 구조
```javascript
const [taskColors, setTaskColors] = useState({})
// { taskId: '#93C5FD' | '#000000' | ... }

// 예시:
{
  '1': '#EF4444',  // 빨간색
  '5': '#22C55E',  // 녹색
  '10': '#3B82F6'  // 파란색
}
```

### 설정 방법
1. Gantt Task 바 **우클릭**
2. "색상 선택 ›" hover
3. 서브메뉴에서 선택:
   - 기본색
   - 검은색
   - 회색
   - 파란색
   - 빨간색
   - 노란색
   - 녹색
   - 주황색
   - 보라색

### 가져오기
```javascript
const getTaskColor = (taskId) => {
  return taskColors[taskId] || taskConfig.color  // 개별 설정 또는 기본값
}
```

---

## 🔧 텍스트 색상 자동 조정

### 어두운 배경 → 흰색 텍스트
```javascript
import { isDarkColor } from '../constants/shapes'

// 사용
const textColor = isDarkColor(taskColor) ? '#ffffff' : '#1f2937'
```

### 판단 로직 (밝기 계산)
```javascript
export const isDarkColor = (hexColor) => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // 밝기 = (R*299 + G*587 + B*114) / 1000
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness < 128  // 128 미만이면 어두운 색
}
```

**예시**:
- `#000000` (검은색): brightness = 0 → 어두움 → 흰색 텍스트
- `#93C5FD` (하늘색): brightness = 180 → 밝음 → 검은색 텍스트

---

## 💾 JSON Export/Import

### Export 데이터
```json
{
  "taskShapes": {
    "1": "circle",
    "5": "rectangle"
  },
  "taskColors": {
    "1": "#EF4444",
    "5": "#22C55E"
  }
}
```

### Import 처리
```javascript
// App.jsx
await importJSON(file, {
  setTaskShapes: setTaskShapes,
  setTaskColors: (data) => setTaskColors(data.taskColors || {}),
  // ...
})
```

---

## 🔌 Teamcenter 통합

### DB 저장 구조
```sql
-- 개별 Task 설정 테이블 추가
CREATE TABLE TC_GANTT_TASK_SETTINGS (
  task_id VARCHAR(50) PRIMARY KEY,
  config_id VARCHAR(50),

  shape VARCHAR(20),        -- 'gantt' | 'circle' | 'rectangle'
  color VARCHAR(7),         -- '#93C5FD' 등

  FOREIGN KEY (config_id) REFERENCES TC_GANTT_CONFIG(config_id)
)
```

### 저장/로드 함수
```javascript
// tcDbService.js에 추가

/**
 * Task 개별 설정 저장
 */
export const saveTaskSettings = async (configId, taskShapes, taskColors) => {
  await callTeamcenterSOA(
    'Custom-GanttService',
    'saveTaskSettings',
    {
      configId,
      taskShapes: JSON.stringify(taskShapes),
      taskColors: JSON.stringify(taskColors)
    }
  )
}

/**
 * Task 개별 설정 로드
 */
export const loadTaskSettings = async (configId) => {
  const result = await callTeamcenterSOA(
    'Custom-GanttService',
    'loadTaskSettings',
    { configId }
  )

  return {
    taskShapes: JSON.parse(result.taskShapes || '{}'),
    taskColors: JSON.parse(result.taskColors || '{}')
  }
}
```

---

## 🎯 우클릭 메뉴 구조

### Task 바 우클릭:
```
┌───────────────┐
│ 도형 변경  ›  │ ──> ┌─────────┐
├───────────────┤      │ Gantt Bar│
│ 색상 선택  ›  │ ──> │ Circle   │
├───────────────┤      │ Rectangle│
│ 📝 메모 추가  │      └─────────┘
└───────────────┘
         ↓
    ┌─────────┐
    │ 기본색  │
    │ 검은색  │
    │ 회색    │
    │ ...     │
    └─────────┘
```

### Row 라벨 우클릭:
```
┌───────────────┐
│ Row 전체 도형 변경 › │ ──> ┌─────────┐
├───────────────┤              │ Gantt Bar│
│ 📝 메모 추가  │              │ Circle   │
└───────────────┘              │ Rectangle│
                               └─────────┘
```

---

업데이트 날짜: 2025-12-09
버전: v0.3
