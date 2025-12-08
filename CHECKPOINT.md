# Checkpoint 복원 가이드

## 📌 Checkpoint 정보

**Tag Name**: `v1.0-stable`
**Commit**: 487a08c
**Date**: 2025-12-08
**GitHub**: https://github.com/kykisk/FlexibleGantt/releases/tag/v1.0-stable

---

## 🔄 이 상태로 돌아가는 방법

### 방법 1: 현재 변경사항 무시하고 복원

```bash
# 1. 모든 변경사항 버리기 (주의!)
git reset --hard v1.0-stable

# 2. 원격에서 강제로 받기 (원격이 최신일 경우)
git fetch origin
git reset --hard origin/main
git checkout v1.0-stable
```

### 방법 2: 변경사항 보존하고 복원

```bash
# 1. 현재 작업 임시 저장
git stash save "Current work in progress"

# 2. Checkpoint로 이동
git checkout v1.0-stable

# 3. 나중에 작업 복원 (필요시)
git checkout main
git stash pop
```

### 방법 3: 새 브랜치로 복원

```bash
# 1. Checkpoint 기반 새 브랜치 생성
git checkout -b restore-from-v1.0 v1.0-stable

# 2. 작업 후 원하면 main에 병합
git checkout main
git merge restore-from-v1.0
```

---

## ⚠️ 주의사항

### 복원 전 확인:
1. `.env` 파일 백업 (비밀번호 포함)
2. `node_modules/` 재설치 필요
3. 데이터베이스는 복원 안됨 (별도 백업 필요)

### 복원 후 할 일:
```bash
# 1. 의존성 재설치
npm install
cd client && npm install

# 2. 환경 변수 설정
cp .env.backup .env  # 또는 수동으로 작성

# 3. 서버 재시작
npm run dev              # Backend
cd client && npm run dev # Frontend
```

---

## 📦 이 Checkpoint에 포함된 기능

### ✅ Summary
- Rich Text Editor (텍스트 서식)

### ✅ Gantt Configuration
- **Timeline 탭**: Year Range, Show Quarters/Months, Date Format
- **Structure 탭**: Row/Depth 관리, 중복 방지
- **Attributes 탭**: 속성 선택, 도형/색상, 위치 설정

### ✅ Gantt Chart
- Sample2.PNG 스타일 (중첩 rowspan)
- Cartesian product (모든 조합 표시)
- Task Drag & Drop (이동/크기 조정)
- 도형별 다른 동작 (Gantt Bar, Circle, Rectangle, Triangle)
- 속성 라벨 표시 (Preview 위치 반영)
- 날짜 표시 (좌상단/우상단)
- 오각형 화살표 (85%)

### ✅ Backend
- Node.js + Express.js (Port 6001)
- PostgreSQL (flexiblegantt DB)
- RESTful API (GET, POST, PUT, DELETE)
- 25 Tasks (DDR5, DDR6, LPDDR5, LPDDR5X)

### ✅ Frontend
- React 19 + Vite
- Tailwind CSS
- Axios
- External access (0.0.0.0:5182)

---

## 🌐 접속 URL

- **Frontend**: http://localhost:5182
- **Backend**: http://localhost:6001
- **External**: http://YOUR_IP:5182

---

## 📝 Checkpoint 확인

```bash
# Tag 정보 보기
git show v1.0-stable

# 모든 checkpoint 목록
git tag -l

# 현재 위치 확인
git log --oneline --decorate
```

---

## 🆘 문제 해결

### "git checkout v1.0-stable" 후 detached HEAD 상태?
```bash
# 정상입니다. 다시 main으로 돌아가려면:
git checkout main
```

### 변경사항이 있어서 checkout 안됨?
```bash
# 변경사항 저장:
git stash

# 또는 변경사항 버리기:
git reset --hard HEAD
```

---

**언제든지 `v1.0-stable` tag로 돌아갈 수 있습니다!** 🔖
