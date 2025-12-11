# 폰트 크기 조정 가이드

## 📝 도형별 폰트 크기 설정

### 1️⃣ Gantt Bar
- **폰트 크기**: 고정 8px (조정 불가)
- **이유**: 가변 길이 Task에서 일관성 유지

### 2️⃣ Circle
- **폰트 크기**: 조정 가능 (기본 9px)
- **범위**: 6px ~ 11px
- **적용 대상**:
  - ① 도형 중앙 텍스트
  - ②③④ 도형 오른쪽 텍스트 (모두 동일 크기)

### 3️⃣ Rectangle
- **폰트 크기**: 조정 가능 (기본 7px)
- **범위**: 6px ~ 11px
- **적용 대상**:
  - ①②③④⑤ 도형 내부 5개 텍스트 (모두 동일 크기)

---

## 🔧 설정 방법

### Attributes 탭에서 설정

1. **Shape** dropdown에서 Circle 또는 Rectangle 선택
2. **Font Size** dropdown 표시됨
3. 원하는 크기 선택:
   - 6px (아주 작게)
   - 7px (작게)
   - 8px (기본)
   - 9px (중간)
   - 10px (크게)
   - 11px (아주 크게)

---

## 💾 State 구조

```javascript
const [taskConfig, setTaskConfig] = useState({
  shape: 'gantt',
  color: '#93C5FD',

  // Gantt Bar - 폰트 크기 고정
  ganttAttributes: [...],
  ganttLabelPositions: {...},

  // Circle - 폰트 크기 조정 가능
  circleAttributes: [...],
  circleFontSize: 9,  // ← 기본값

  // Rectangle - 폰트 크기 조정 가능
  rectangleAttributes: [...],
  rectangleFontSize: 7  // ← 기본값
})
```

---

## 🎨 렌더링 적용

### Circle 중앙 텍스트
```javascript
<div style={{
  fontSize: `${taskConfig.circleFontSize || 9}px`,
  color: isDarkColor(taskColor) ? '#ffffff' : '#1f2937'
}}>
  {task.productType}
</div>
```

### Circle 오른쪽 텍스트
```javascript
<div style={{
  fontSize: `${taskConfig.circleFontSize || 9}px`,
  color: '#1f2937'
}}>
  {task.density}
</div>
```

### Rectangle 내부 텍스트 (5개)
```javascript
<div style={{
  fontSize: `${taskConfig.rectangleFontSize || 7}px`,
  color: isDarkColor(taskColor) ? '#ffffff' : '#1f2937'
}}>
  {task.productType}
</div>
```

---

## 🔌 Teamcenter 통합

### DB 저장
```javascript
// JSON 형태로 저장
attributesConfig: JSON.stringify({
  ganttAttributes: [...],
  ganttLabelPositions: {...},
  circleAttributes: [...],
  circleFontSize: 10,        // ← 저장
  rectangleAttributes: [...],
  rectangleFontSize: 8       // ← 저장
})
```

### 로드
```javascript
const config = await loadGanttConfig(userId, projectId)
setTaskConfig({
  ...config.attributes,
  circleFontSize: config.attributes.circleFontSize || 9,
  rectangleFontSize: config.attributes.rectangleFontSize || 7
})
```

---

## 📊 폰트 크기 비교

| 도형 | 기본 크기 | 조정 가능 | 적용 범위 |
|------|----------|---------|----------|
| Gantt Bar | 8px | ❌ | 고정 |
| Circle | 9px | ✅ | 중앙 + 오른쪽 |
| Rectangle | 7px | ✅ | 도형 내부 5개 |

---

## 💡 사용 시나리오

### 시나리오 1: 속성이 긴 경우
```
Circle: 11px (아주 크게) 선택
→ "Organization" 같은 긴 텍스트도 잘 보임
```

### 시나리오 2: 도형이 작을 때
```
Rectangle: 6px (아주 작게) 선택
→ 52px 도형에 5개 속성이 모두 들어감
```

---

업데이트 날짜: 2025-12-09
버전: v0.4
