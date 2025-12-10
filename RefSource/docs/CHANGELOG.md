# RefSource 변경 이력

## 최신 업데이트 (2025-12-09)

### 메모 기능 추가
- Gantt 영역 우클릭으로 포스트잇 스타일 메모 추가
- 메모 드래그/리사이즈/편집/삭제 기능
- JSON Export/Import 시 메모 포함
- 최소 크기: 80px × 60px

### 버그 수정
- React key prop 에러 수정 (GanttTable.jsx)
- Context menu 이벤트 버블링 수정
- Task/Row 우클릭 시 도형 변경 메뉴 정상 표시

### 추가 파일
- `components/Memo.jsx` (메모 컴포넌트)
- `docs/MEMO_FEATURE.md` (메모 기능 가이드)

---

## 이전 업데이트 (2025-12-08)

### 버그 수정
- PDF Export 시 `pageSizes is not defined` 오류 수정
- PDF Export 시 `jsPDF is not defined` 오류 수정

### 필수 import 추가
```javascript
// App.jsx 또는 메인 컴포넌트에 추가 필요
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { pageSizes } from './constants/shapes'
```

### Row 전체 도형 변경 기능
- Y축 라벨 우클릭 → Row 전체 Task 도형 일괄 변경
- ContextMenu 컴포넌트에 `onSelectRowShapes` 추가

---

## 통합 시 주의사항

### 1. 의존성 설치
```bash
npm install jspdf html2canvas
```

### 2. import 확인
메인 컴포넌트에서 다음을 import해야 합니다:
```javascript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { pageSizes } from './constants/shapes'
import { exportJSON, importJSON, exportPDF } from './utils/exportUtils'
```

### 3. Teamcenter 연동
- `utils/tcDbService.js`의 `callTeamcenterSOA` 함수 구현 필수
- 프로젝트의 SOA 호출 방식에 맞춰 수정

---

## 주요 함수 사용법

### PDF Export
```javascript
import { exportPDF } from './utils/exportUtils'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const handleExportPDF = async (options) => {
  const summaryElement = document.querySelector('.summary-section')
  const ganttElement = document.querySelector('.gantt-section')

  await exportPDF(options, {
    summary: summaryElement.textContent,
    gantt: ganttElement
  })
}
```

### JSON Export/Import
```javascript
import { exportJSON, importJSON } from './utils/exportUtils'

// Export
exportJSON({
  summary: summaryContent,
  timeline: { startYear, endYear, ... },
  // ...
})

// Import
await importJSON(file, {
  setSummary: setSummaryContent,
  setTimeline: (timeline) => { ... },
  // ...
})
```

---

업데이트된 파일:
- exportUtils.js
- shapes.js (pageSizes 포함)
- ContextMenu.jsx (Row 도형 변경)
- Legend.jsx (최신 범례)
