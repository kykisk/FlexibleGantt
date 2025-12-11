# RefSource 변경 이력

## 최신 업데이트 (2025-12-09 v2)

### 도형 기능 개선
- Triangle 도형 제거
- Rectangle 도형 속성 배치 변경 (5개 고정 위치, 도형 내부)
- Circle 속성 위치 수정 (도형 위치 따라감)
- Rectangle Preview 크기 변경 (200px 직사각형)
- 속성 텍스트박스 ellipsis 처리
- Circle 종료일 중심 맞춤
- Rectangle 종료일 오른쪽 맞춤

### 필터 기능 추가
- Gantt 필터 팝업 (Structure 기반 동적 생성)
- Row별 독립 필터링
- 실시간 체크박스 반영
- Set Default 버튼 (전체 선택)

### 멀티 Row Gantt 통합
- 여러 Row를 하나의 테이블로 통합
- Y축 컬럼 자동 정렬
- 최대 Depth에 맞춰 헤더 생성

---

## 이전 업데이트 (2025-12-09 v1)

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
