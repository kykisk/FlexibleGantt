# 메모 기능 가이드

## 📝 메모 기능 개요

Gantt Chart에 포스트잇 스타일의 메모를 추가할 수 있는 기능입니다.

---

## 🎯 주요 기능

### 1. 메모 추가
- **위치**: Gantt 영역 어디서나 우클릭 → "📝 메모 추가"
- **방법**:
  - Task 바 우클릭 → 메모 추가
  - Row 라벨 우클릭 → 메모 추가
  - 빈 공간 우클릭 → 메모 추가

### 2. 메모 편집
- **더블클릭**: 편집 모드 진입
- **텍스트 입력**: 자유롭게 작성
- **저장**: "저장" 버튼 클릭
- **취소**: "취소" 버튼 클릭

### 3. 메모 이동
- **드래그**: 메모 박스 클릭 & 드래그로 이동

### 4. 크기 조정
- **핸들**: 우하단 삼각형 핸들 드래그
- **최소 크기**: 80px × 60px
- **최대 크기**: 제한 없음

### 5. 메모 삭제
- **X 버튼**: 우상단 × 클릭
- **확인 팝업**: 삭제 확인 후 제거

---

## 🔧 기술 구현

### 컴포넌트: Memo.jsx

```javascript
/**
 * 메모 컴포넌트
 *
 * @param {Object} memo - 메모 데이터
 * @param {Function} onUpdate - 메모 업데이트 핸들러
 * @param {Function} onDelete - 메모 삭제 핸들러
 */
```

### 메모 데이터 구조

```javascript
{
  id: 'memo-1234567890',     // 고유 ID
  x: 150,                     // X 좌표 (px)
  y: 200,                     // Y 좌표 (px)
  width: 200,                 // 너비 (px)
  height: 150,                // 높이 (px)
  content: '메모 내용',      // 텍스트 내용
  createdDate: '2025-12-09...' // 생성일
}
```

### State 관리

```javascript
// App.jsx
const [memos, setMemos] = useState([])

// 메모 추가
const handleAddMemo = (x, y) => {
  const newMemo = {
    id: `memo-${Date.now()}`,
    x, y,
    width: 200,
    height: 150,
    content: '',
    createdDate: new Date().toISOString()
  }
  setMemos([...memos, newMemo])
}

// 메모 업데이트
const handleUpdateMemo = (id, updates) => {
  setMemos(memos.map(m => m.id === id ? { ...m, ...updates } : m))
}

// 메모 삭제
const handleDeleteMemo = (id) => {
  setMemos(memos.filter(m => m.id !== id))
}
```

---

## 💾 저장 및 복원

### JSON Export에 포함

```javascript
// Export
exportJSON({
  summary: summaryContent,
  timeline: { ... },
  structure: [ ... ],
  attributes: { ... },
  taskShapes: { ... },
  tasks: [ ... ],
  memos: [                    // ← 메모 추가
    {
      id: 'memo-001',
      x: 150,
      y: 200,
      width: 200,
      height: 150,
      content: '메모 내용',
      createdDate: '2025-12-09...'
    }
  ]
})
```

### JSON Import 시 복원

```javascript
// Import
await importJSON(file, {
  // ... 다른 콜백들
  setMemos: (data) => setMemos(data.memos || [])
})
```

---

## 🎨 스타일 커스터마이징

### 색상 변경

**파일**: `components/Memo.jsx`

```javascript
// 메모 배경색
className="bg-yellow-100"  // ← 원하는 색상으로 변경

// 테두리 색상
className="border-yellow-400"  // ← 테두리 색상
```

**색상 옵션**:
- 노란색: `bg-yellow-100` (기본)
- 파란색: `bg-blue-100`
- 분홍색: `bg-pink-100`
- 초록색: `bg-green-100`

### 크기 제한 변경

```javascript
// 최소 크기
width: Math.max(80, ...)   // ← 최소 너비 (px)
height: Math.max(60, ...)  // ← 최소 높이 (px)

// 초기 크기
width: 200,                // ← 초기 너비
height: 150                // ← 초기 높이
```

---

## 🔌 Teamcenter 통합

### DB 테이블 추가

```sql
-- 메모 테이블
CREATE TABLE TC_GANTT_MEMOS (
  memo_id VARCHAR(50) PRIMARY KEY,
  config_id VARCHAR(50),

  x_position INT,
  y_position INT,
  width INT,
  height INT,
  content TEXT,
  created_date TIMESTAMP,

  FOREIGN KEY (config_id) REFERENCES TC_GANTT_CONFIG(config_id)
)
```

### tcDbService.js에 함수 추가

```javascript
/**
 * 메모 로드
 */
export const loadMemos = async (configId) => {
  const result = await callTeamcenterSOA(
    'Custom-GanttService',
    'loadMemos',
    { configId }
  )
  return result.memos || []
}

/**
 * 메모 저장
 */
export const saveMemos = async (configId, memos) => {
  await callTeamcenterSOA(
    'Custom-GanttService',
    'saveMemos',
    { configId, memos: JSON.stringify(memos) }
  )
}
```

---

## 🧪 사용 예시

### 1. 메모 추가
```javascript
// Gantt 영역 우클릭 핸들러
const handleGanttAreaRightClick = (e) => {
  e.preventDefault()
  const ganttSection = e.currentTarget.getBoundingClientRect()
  const relativeX = e.clientX - ganttSection.left
  const relativeY = e.clientY - ganttSection.top

  setContextMenu({
    x: e.clientX,
    y: e.clientY,
    relativeX,
    relativeY,
    type: 'gantt-area'
  })
}
```

### 2. 메모 렌더링
```jsx
{/* Gantt 영역 내 */}
<div className="relative">
  {/* Gantt Table */}
  <GanttTable {...props} />

  {/* Memos overlay */}
  {memos.map(memo => (
    <Memo
      key={memo.id}
      memo={memo}
      onUpdate={handleUpdateMemo}
      onDelete={handleDeleteMemo}
    />
  ))}
</div>
```

---

## ⚠️ 주의사항

### 1. 좌표 시스템
- 메모 좌표는 **Gantt 영역 기준 절대 좌표** (px)
- 스크롤 시 메모도 함께 스크롤됨
- `position: absolute` 사용

### 2. z-index
- 메모: z-index 40
- Task 바: z-index 10-30
- 메모가 항상 위에 표시됨

### 3. 드래그 충돌 방지
```javascript
// 메모 드래그 시 Task 드래그 방지
onMouseDown={(e) => {
  e.stopPropagation()  // Task 이벤트 차단
  handleMemoMouseDown(e)
}}
```

---

업데이트 날짜: 2025-12-09
버전: v0.3 (메모 기능 추가)
