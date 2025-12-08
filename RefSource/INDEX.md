# FlexibleGantt Reference Source

## 📦 패키지 개요

**대상**: Teamcenter ActiveWorkspace 개발자
**목적**: FlexibleGantt 기능 통합 참조
**환경**: React + Teamcenter DB

---

## 📂 폴더 구조

```
RefSource/
├── docs/                    📚 문서
│   ├── README.md           (개요 및 아키텍처)
│   ├── INTEGRATION_GUIDE.md (상세 통합 가이드)
│   └── QUICK_START.md      (5분 빠른 시작)
│
├── components/              🧩 핵심 컴포넌트 (주석 포함)
│   ├── GanttTable.jsx      (Gantt 테이블 렌더링)
│   ├── AttributesTab.jsx   (속성 설정 탭)
│   └── StructureTab.jsx    (구조 설정 탭)
│
├── utils/                   🛠️ 유틸리티
│   ├── tcDbService.js      ⭐ Teamcenter DB 연동 템플릿
│   ├── ganttUtils.js       (Gantt 로직)
│   ├── exportUtils.js      (Export 로직)
│   └── dateFormatter.js    (날짜 포맷)
│
├── constants/               📋 상수
│   ├── attributes.js       (Task 속성 정의)
│   └── shapes.js          (도형/색상/용지 크기)
│
└── examples/                💡 예시 코드
    └── TeamcenterIntegration.jsx (통합 예시)
```

---

## 🎯 주요 수정 포인트

### ⭐ 필수 수정 (Teamcenter 연동)

#### 1. `utils/tcDbService.js`
```javascript
const callTeamcenterSOA = async (serviceName, operationName, inputData) => {
  // TODO: 프로젝트의 SOA 호출 방식으로 교체
  return await yourProject.soaService.post(...)
}
```

#### 2. JSON 파일 → DB 저장
- **기존**: 파일 다운로드 (`Export JSON`)
- **변경**: DB 저장 (`saveGanttConfig()`)
- **위치**: `utils/tcDbService.js` 참조

#### 3. 초기 데이터 로드
- **기존**: `axios.get('/api/tasks')`
- **변경**: `loadTasks(configId)`
- **위치**: `examples/TeamcenterIntegration.jsx` 참조

---

## 🎨 선택 수정 (UI 커스터마이징)

### 색상 테마
**파일**: `constants/shapes.js`
```javascript
export const colors = {
  primary: '#3B82F6',    // ← 내부 primary 색상으로 변경
  taskBar: '#93C5FD',    // ← Task 바 색상 변경
  // ...
}
```

### 폰트 크기
**파일**: `components/GanttTable.jsx` (여러 위치)
```javascript
fontSize: '8px'  // ← 내부 폰트 규정으로 변경
```

### Gantt Bar 화살표 각도
**파일**: `components/GanttTable.jsx` (line 217)
```javascript
clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                     ↑ 85%를 조정 (80~90% 권장)
```

---

## 📖 문서 읽기 순서

1. **QUICK_START.md** (5분) - 빠른 통합
2. **README.md** (10분) - 전체 개요
3. **INTEGRATION_GUIDE.md** (20분) - 상세 가이드

---

## 🔗 주요 함수 요약

### Teamcenter DB 연동
```javascript
// 설정 로드
const config = await loadGanttConfig(userId, projectId)

// 설정 저장
await saveGanttConfig(configId, configData)

// Task 로드
const tasks = await loadTasks(configId)

// Task 생성/수정/삭제
await createTask(configId, taskData)
await updateTask(taskId, updates)
await deleteTask(taskId)
```

### 도형 변경
```javascript
// 개별 Task 도형 변경
setTaskShapes({ ...taskShapes, [taskId]: 'circle' })

// Row 전체 도형 변경
const newShapes = {}
rowTasks.forEach(t => newShapes[t.id] = 'rectangle')
setTaskShapes({ ...taskShapes, ...newShapes })
```

---

## ⚠️ 중요 참고사항

### 제외된 기능 (프로젝트에서 대체)
- ❌ Express.js 백엔드
- ❌ PostgreSQL 직접 연결
- ❌ 파일 시스템 저장
- ❌ localhost API 호출

### 포함된 기능 (그대로 사용)
- ✅ Gantt 렌더링 로직
- ✅ 드래그 & 드롭
- ✅ 속성 설정 UI
- ✅ 도형 커스터마이징
- ✅ PDF Export
- ✅ 날짜 포맷팅

---

## 📞 문의사항

통합 중 문제가 발생하면:
1. `docs/INTEGRATION_GUIDE.md` 체크리스트 확인
2. `utils/tcDbService.js` 함수 구현 확인
3. Browser Console 에러 메시지 확인

---

**총 13개 파일, 112KB**
**React + Teamcenter 통합 준비 완료!** 🎉
