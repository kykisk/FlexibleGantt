# 도형별 속성 배치 가이드

## 📐 도형 종류

FlexibleGantt는 3가지 도형을 지원합니다:
1. **Gantt Bar** (▶) - 시작일~종료일 표시, 가변 길이
2. **Circle** (●) - 종료일 표시, 고정 크기
3. **Rectangle** (■) - 종료일 표시, 고정 크기

---

## 🎯 1. Gantt Bar

### 특징
- **위치**: 시작일~종료일 (가변 길이)
- **속성 개수**: 최대 8개
- **속성 배치**: 사용자가 드래그로 위치 조정 가능
- **날짜 표시**: 좌상단(시작일), 우상단(종료일)

### Preview
```
[2022-01-15]            [2022-03-15]
┌────────────────────────────────┐
│ ① 제품Type                    │  ← 사용자 지정 위치
│      ② Density                │
│           ③ 공정명            │
└────────────────────────────────┘
```

### Gantt
```
[2022-01-15]            [2022-03-15]
┌────────────────────────────────┐
│ LPDDR5                         │
│      16Gb                      │
│           D1                   │
└────────────────────────────────┘
```

### 코드
```javascript
// State
ganttAttributes: ['productType', 'density', 'process']
ganttLabelPositions: {
  productType: { x: 50, y: 35 },  // % 단위
  density: { x: 50, y: 50 },
  process: { x: 50, y: 65 }
}

// Render
taskConfig.ganttAttributes.map((attrKey, idx) => {
  const pos = taskConfig.ganttLabelPositions[attrKey]
  const labelLeft = barLeft + (barWidth * pos.x / 100)
  const labelTop = barTop + (barHeight * pos.y / 100)
  // ... 렌더링
})
```

---

## 🎯 2. Circle

### 특징
- **위치**: 종료일에 중심 맞춤
- **크기**: 52px × 52px (고정)
- **속성 개수**: 최대 4개
- **속성 배치**: 고정 (①중앙, ②③④오른쪽)

### Preview
```
        ① 제품Type
  ●             ② Density
                ③ 공정명
                ④ NPI여부
```

### Gantt
```
       LPDDR5
  ●          16Gb
             D1
             Yes
```

### 위치 계산
```javascript
// Circle 중심을 종료일에 맞춤
const endPercent = startPercent + widthPercent
const circleLeft = calc(endPercent% - 26px)  // 반지름(26px)만큼 빼기

// 속성 위치
// 1번: Circle 중앙
// 2-4번: Circle 오른쪽 + 8px
```

---

## 🎯 3. Rectangle

### 특징
- **위치**: 종료일에 오른쪽 맞춤
- **크기**: 100px × 52px (고정, 직사각형)
- **속성 개수**: 최대 5개
- **속성 배치**: 고정 (5개 고정 위치)

### Preview (Rectangle.png 참조)
```
┌──────────────┐
│ ② Density  ③ 모공정 │
│                    │
│     ① 제품Type     │
│                    │
│ ④ 공정명   ⑤ NPI  │
└──────────────┘
```

### 고정 위치 (도형 내부)
```javascript
const rectanglePositions = [
  { index: 1, x: 50, y: 50 },  // 중앙
  { index: 2, x: 20, y: 20 },  // 좌상단
  { index: 3, x: 80, y: 20 },  // 우상단
  { index: 4, x: 20, y: 80 },  // 좌하단
  { index: 5, x: 80, y: 80 }   // 우하단
]
```

### Gantt
```
                    ┌──────────────┐
                    │ 16Gb  Yes    │
                    │              │
                    │   LPDDR5     │
                    │              │
                    │ D1    모제품  │
                    └──────────────┘
                                   ↑
                              종료일 맞춤
```

### 위치 계산
```javascript
// Rectangle 오른쪽을 종료일에 맞춤
const endPercent = startPercent + widthPercent
const rectangleLeft = calc(endPercent% - 100px)  // 전체 너비만큼 빼기

// 속성 위치 (도형 내부 절대 좌표)
const labelLeft = calc(rectangleLeft + ${100 * pos.x / 100}px)
const labelTop = barTop + (52 * pos.y / 100)
```

---

## 🔧 Teamcenter 통합 시 주의사항

### State 구조
```javascript
const [taskConfig, setTaskConfig] = useState({
  shape: 'gantt',
  color: '#93C5FD',

  // Gantt Bar (최대 8개, 드래그 가능)
  ganttAttributes: ['productType', 'density', 'process'],
  ganttLabelPositions: {
    productType: { x: 50, y: 35 },
    density: { x: 50, y: 50 },
    process: { x: 50, y: 65 }
  },

  // Circle (최대 4개, 고정)
  circleAttributes: ['productType', 'density'],

  // Rectangle (최대 5개, 고정)
  rectangleAttributes: ['productType', 'density', 'isMainProcess']
})
```

### DB 저장
```javascript
// Teamcenter DB에 저장 시
await saveGanttConfig(configId, {
  attributes: {
    shape: taskConfig.shape,
    color: taskConfig.color,
    ganttAttributes: taskConfig.ganttAttributes,
    ganttLabelPositions: taskConfig.ganttLabelPositions,
    circleAttributes: taskConfig.circleAttributes,
    rectangleAttributes: taskConfig.rectangleAttributes
  }
})
```

---

## 📊 도형 비교표

| 항목 | Gantt Bar | Circle | Rectangle |
|------|-----------|--------|-----------|
| 아이콘 | ▶ | ● | ■ |
| 위치 기준 | 시작일~종료일 | 종료일 중심 | 종료일 오른쪽 |
| 크기 | 가변 | 52×52 | 100×52 |
| 최대 속성 | 8개 | 4개 | 5개 |
| 속성 배치 | 드래그 가능 | 고정 | 고정 |
| 위치 조정 | O | X | X |

---

## 🎨 스타일 커스터마이징

### 도형 크기 변경
```javascript
// Gantt: GanttTable.jsx
shapeHeight = ${laneHeight - 8}px

// Circle: GanttTable.jsx (line 202)
shapeWidth = '52px'
shapeHeight = '52px'

// Rectangle: GanttTable.jsx (line 195)
shapeWidth = '100px'  // ← 너비 조정
shapeHeight = '52px'  // ← 높이 조정
```

### 속성 텍스트 크기
```javascript
// Gantt: fontSize: '8px'
// Circle: fontSize: '9px' (중앙), '8px' (오른쪽)
// Rectangle: fontSize: '7px'
```

---

업데이트 날짜: 2025-12-09
버전: v0.3
