# Quick Start Guide

## 🚀 5분 안에 통합하기

### 1️⃣ 파일 복사 (1분)
```bash
# RefSource 폴더 내용을 프로젝트로 복사
cp -r RefSource/components/* your-project/src/components/GanttReport/
cp -r RefSource/utils/* your-project/src/utils/
cp -r RefSource/constants/* your-project/src/constants/
```

### 2️⃣ Teamcenter DB 테이블 생성 (1분)
```sql
-- docs/database_schema.sql 실행
-- TC_GANTT_CONFIG, TC_GANTT_TASKS 테이블 생성
```

### 3️⃣ tcDbService.js 구현 (2분)
```javascript
// utils/tcDbService.js 파일에서
// callTeamcenterSOA 함수를 프로젝트의 SOA 호출 방식으로 교체
```

### 4️⃣ 라우터 등록 (1분)
```javascript
import TeamcenterGanttReport from './components/GanttReport/TeamcenterIntegration'

<Route path="/gantt-report" element={<TeamcenterGanttReport />} />
```

---

## ✅ 완료!

이제 `/gantt-report` 경로로 접속하면 Gantt Report가 표시됩니다.

---

## 📞 주요 수정 포인트

### ⚠️ 필수 수정
1. **tcDbService.js**: Teamcenter SOA 호출 구현
2. **userId, projectId**: 현재 사용자/프로젝트 가져오기

### 🎨 선택 수정
1. **스타일**: Tailwind → 내부 CSS
2. **색상**: colors 상수 수정
3. **폰트**: fontSize 조정

---

더 자세한 내용은 `INTEGRATION_GUIDE.md`를 참조하세요!
