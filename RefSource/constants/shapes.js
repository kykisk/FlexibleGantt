/**
 * 도형 옵션
 *
 * Task를 표현할 수 있는 도형 종류
 */
export const shapeOptions = [
  { value: 'gantt', label: 'Gantt Bar', icon: '▶' },
  { value: 'circle', label: 'Circle', icon: '●' },
  { value: 'rectangle', label: 'Rectangle', icon: '■' }
]

/**
 * Rectangle 고정 위치 (5개, 도형 내부)
 *
 * ② (20,20)  ③ (80,20)
 *        ① (50,50)
 * ④ (20,80)  ⑤ (80,80)
 */
export const rectanglePositions = [
  { index: 1, x: 50, y: 50 },  // 중앙
  { index: 2, x: 20, y: 20 },  // 좌상단
  { index: 3, x: 80, y: 20 },  // 우상단
  { index: 4, x: 20, y: 80 },  // 좌하단
  { index: 5, x: 80, y: 80 }   // 우하단
]

/**
 * 색상 옵션
 *
 * Task 바에 적용 가능한 색상 목록
 * Teamcenter 디자인 규정에 맞춰 색상을 변경할 수 있습니다.
 */
export const colorOptions = [
  { value: '#000000', label: '검은색' },
  { value: '#808080', label: '회색' },
  { value: '#3B82F6', label: '파란색' },
  { value: '#EF4444', label: '빨간색' },
  { value: '#FACC15', label: '노란색' },
  { value: '#22C55E', label: '녹색' },
  { value: '#F97316', label: '주황색' },
  { value: '#A855F7', label: '보라색' }
]

/**
 * 날짜 포맷 옵션
 */
export const dateFormatOptions = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
  { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD' },
  { value: 'MM-DD', label: 'MM-DD' }
]

/**
 * PDF 용지 크기 (mm 단위)
 */
export const pageSizes = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 }
}
